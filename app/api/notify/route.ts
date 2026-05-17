import { NextRequest, NextResponse } from "next/server";
import { sendTelegram } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  const { type, service, name, email, message } = await req.json();

  if (type === "ticket") {
    await sendTelegram(
      `🎫 <b>Новый тикет</b>\n` +
      `Услуга: <b>${service}</b>\n` +
      `Сообщение: ${message}\n\n` +
      `<a href="https://generalconclave.general-conclave-industries.workers.dev/admin">Открыть админку →</a>`
    );
  } else if (type === "request") {
    await sendTelegram(
      `📩 <b>Новая заявка</b>\n` +
      `Имя: <b>${name}</b>\n` +
      `Email: ${email}\n` +
      `Тема: ${service}\n` +
      `Сообщение: ${message}\n\n` +
      `<a href="https://generalconclave.general-conclave-industries.workers.dev/admin">Открыть админку →</a>`
    );
  }

  return NextResponse.json({ ok: true });
}
