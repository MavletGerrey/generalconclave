import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendTelegram } from "@/lib/telegram";

const SYSTEM_PROMPT = `Ты — AI-консультант компании General Conclave Industries. Твоя задача — помочь владельцу малого бизнеса понять, как AI-автоматизация может изменить его работу.

Ты сам являешься примером того, что мы создаём для клиентов — умный AI-ассистент, который общается как человек, понимает контекст и помогает принять решение.

Компания предлагает два направления:
- **Conclave Digital** — готовые цифровые продукты: промт-пакеты для ChatGPT, Midjourney, скрипты продаж. Цены от 390 ₽. Подходит тем, кто хочет начать использовать AI прямо сейчас.
- **Conclave Tech** — разработка под ключ: Telegram-боты для записи клиентов, AI-интеграции, автоматизация рутины. Цены от 8 000 ₽. Первый результат за 7 дней.

Правила общения:
- Говори по-русски, живо и дружелюбно. Без канцелярщины.
- Задавай один вопрос за раз. Не заваливай человека текстом.
- Сначала пойми бизнес клиента, потом предлагай решение.
- Когда понял что нужно — объясни конкретно как это поможет именно его бизнесу.
- После 4-5 сообщений ненавязчиво спроси имя и контакт (телефон или email) чтобы менеджер мог связаться.
- Не придумывай цены и сроки кроме указанных выше.
- Если спрашивают не по теме — вежливо верни к теме автоматизации бизнеса.

Начни с короткого приветствия и спроси чем занимается их бизнес.`;

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
      max_tokens: 400,
      temperature: 0.7,
    }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "Произошла ошибка. Попробуйте ещё раз.";
}

async function getOrCreateChat(supabase: ReturnType<typeof createClient>, chatId: number) {
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

export async function POST(req: NextRequest) {
  const body = await req.json();
  const message = body?.message;
  if (!message?.text || !message?.chat?.id) return NextResponse.json({ ok: true });

  const chatId = message.chat.id;
  const userText = message.text;
  const userName = message.from?.first_name || "Клиент";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const chat = await getOrCreateChat(supabase, chatId);
  if (!chat) return NextResponse.json({ ok: true });

  const history = (chat.messages as {role: string, content: string}[]) || [];

  // Команда /start — сброс
  if (userText === "/start") {
    await (supabase as any).from("bot_chats").update({ messages: [] }).eq("telegram_chat_id", chatId);
    const greeting = await getGroqResponse([]);
    await replyToUser(chatId, greeting);
    await (supabase as any).from("bot_chats").update({ messages: [{ role: "assistant", content: greeting }], updated_at: new Date().toISOString() }).eq("telegram_chat_id", chatId);
    return NextResponse.json({ ok: true });
  }

  const updatedHistory = [...history, { role: "user", content: userText }];
  const aiReply = await getGroqResponse(updatedHistory);
  const finalHistory = [...updatedHistory, { role: "assistant", content: aiReply }];

  await (supabase as any).from("bot_chats")
    .update({ messages: finalHistory, updated_at: new Date().toISOString() })
    .eq("telegram_chat_id", chatId);

  await replyToUser(chatId, aiReply);

  // После 6 сообщений уведомляем админа с резюме
  if (finalHistory.length >= 6 && finalHistory.length % 4 === 2) {
    const summary = finalHistory
      .filter(m => m.role === "user")
      .map(m => m.content)
      .join(" | ");
    await sendTelegram(
      `🤖 <b>Диалог с клиентом в боте</b>\n` +
      `Имя: ${userName}\n` +
      `Chat ID: ${chatId}\n` +
      `Сообщений: ${finalHistory.length}\n` +
      `Последние слова клиента: ${summary.slice(-200)}`
    );
  }

  return NextResponse.json({ ok: true });
}
