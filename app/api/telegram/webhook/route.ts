import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendTelegram } from "@/lib/telegram";

const SYSTEM_PROMPT = `Ты — AI-консультант General Conclave Industries. Помогаешь владельцам малого бизнеса понять как AI может помочь их делу. Ты сам — пример того продукта который мы создаём.

Компания:
- Conclave Digital: готовые промт-пакеты для ChatGPT/Midjourney, скрипты продаж. От 390 ₽.
- Conclave Tech: Telegram-боты, AI-интеграции под ключ. От 8 000 ₽. Результат за 7 дней.

СТРОГИЕ правила ответов:
- МАКСИМУМ 1-2 коротких предложения. Никаких длинных абзацев.
- Один вопрос за раз. Разговорный стиль, как в мессенджере.
- Сначала пойми бизнес, потом предлагай.
- После 4-5 обменов — попроси имя и контакт для менеджера.
- Никаких списков, звёздочек, форматирования. Только живой текст.`;

const ADMIN_MENU = `🔧 Админ-панель

/stats — статистика диалогов
/chats — последние разговоры
/broadcast — рассылка (в разработке)

Ты вошёл как администратор.`;

async function getGroqResponse(messages: {role: string, content: string}[]): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 120,
      temperature: 0.75,
    }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "Что-то пошло не так, попробуй ещё раз.";
}

async function getOrCreateChat(supabase: any, chatId: number) {
  const { data } = await (supabase as any)
    .from("bot_chats")
    .select("*")
    .eq("telegram_chat_id", chatId)
    .single();

  if (data) return data;

  const { data: newChat } = await (supabase as any)
    .from("bot_chats")
    .insert({ telegram_chat_id: chatId, messages: [] })
    .select()
    .single();
  return newChat;
}

async function replyToUser(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

async function handleAdminCommand(chatId: number, cmd: string, supabase: any) {
  if (cmd === "/admin" || cmd === "/stats") {
    const { data } = await (supabase as any).from("bot_chats").select("id", { count: "exact" });
    const total = data?.length ?? 0;
    const today = new Date().toISOString().split("T")[0];
    const { data: todayData } = await (supabase as any)
      .from("bot_chats")
      .select("id")
      .gte("updated_at", today);
    await replyToUser(chatId, `📊 Статистика\nВсего диалогов: ${total}\nАктивных сегодня: ${todayData?.length ?? 0}`);
    return;
  }

  if (cmd === "/chats") {
    const { data } = await (supabase as any)
      .from("bot_chats")
      .select("telegram_chat_id, messages, updated_at")
      .order("updated_at", { ascending: false })
      .limit(5);

    if (!data || data.length === 0) {
      await replyToUser(chatId, "Диалогов пока нет.");
      return;
    }

    let text = "💬 Последние диалоги:\n\n";
    for (const c of data) {
      const msgs = (c.messages as any[]) || [];
      const last = msgs.filter((m: any) => m.role === "user").pop();
      text += `Chat ${c.telegram_chat_id}\n`;
      if (last) text += `"${last.content.slice(0, 60)}..."\n`;
      text += "\n";
    }
    await replyToUser(chatId, text);
    return;
  }

  await replyToUser(chatId, ADMIN_MENU);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const message = body?.message;
  if (!message?.text || !message?.chat?.id) return NextResponse.json({ ok: true });

  const chatId = message.chat.id;
  const userText = message.text.trim();
  const userName = message.from?.first_name || "Клиент";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Проверяем admin-пароль
  const ADMIN_PASSWORD = process.env.BOT_ADMIN_PASSWORD || "gc_admin_2026";
  const { data: adminSession } = await (supabase as any)
    .from("bot_chats")
    .select("is_admin")
    .eq("telegram_chat_id", chatId)
    .single();

  const isAdmin = adminSession?.is_admin === true;

  // Активация admin-режима
  if (userText === `/admin_${ADMIN_PASSWORD}` || userText === `/${ADMIN_PASSWORD}`) {
    await (supabase as any).from("bot_chats").upsert(
      { telegram_chat_id: chatId, is_admin: true, messages: [] },
      { onConflict: "telegram_chat_id" }
    );
    await replyToUser(chatId, ADMIN_MENU);
    return NextResponse.json({ ok: true });
  }

  // Admin-команды
  if (isAdmin && userText.startsWith("/")) {
    await handleAdminCommand(chatId, userText, supabase);
    return NextResponse.json({ ok: true });
  }

  const chat = await getOrCreateChat(supabase, chatId);
  if (!chat) return NextResponse.json({ ok: true });

  const history = (chat.messages as {role: string, content: string}[]) || [];

  // /start — сброс диалога
  if (userText === "/start") {
    await (supabase as any).from("bot_chats").update({ messages: [] }).eq("telegram_chat_id", chatId);
    const greeting = await getGroqResponse([]);
    await replyToUser(chatId, greeting);
    await (supabase as any).from("bot_chats").update({
      messages: [{ role: "assistant", content: greeting }],
      updated_at: new Date().toISOString()
    }).eq("telegram_chat_id", chatId);
    return NextResponse.json({ ok: true });
  }

  const updatedHistory = [...history, { role: "user", content: userText }];
  const aiReply = await getGroqResponse(updatedHistory);
  const finalHistory = [...updatedHistory, { role: "assistant", content: aiReply }];

  await (supabase as any).from("bot_chats")
    .update({ messages: finalHistory, updated_at: new Date().toISOString() })
    .eq("telegram_chat_id", chatId);

  await replyToUser(chatId, aiReply);

  // Уведомление после 6 сообщений
  if (finalHistory.length === 6) {
    const userMsgs = finalHistory.filter(m => m.role === "user").map(m => m.content).join(" | ");
    await sendTelegram(
      `🤖 <b>Новый диалог в боте</b>\n${userName} (${chatId})\n\n${userMsgs.slice(0, 300)}`
    );
  }

  return NextResponse.json({ ok: true });
}
