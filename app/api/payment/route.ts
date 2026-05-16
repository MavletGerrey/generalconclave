import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

function generateToken(params: Record<string, string | number>, password: string): string {
  const filtered: Record<string, string | number> = { ...params, Password: password };
  delete filtered.Token;
  delete filtered.Receipt;

  const sorted = Object.keys(filtered)
    .sort()
    .map(key => String(filtered[key]))
    .join("");

  return createHash("sha256").update(sorted).digest("hex");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount, orderId, description, email } = body;

  const terminal = process.env.NEXT_PUBLIC_TINKOFF_TERMINAL!;
  const password = process.env.TINKOFF_SECRET!;

  const params: Record<string, string | number> = {
    TerminalKey: terminal,
    Amount: Math.round(amount * 100), // в копейках
    OrderId: orderId,
    Description: description,
    Email: email || "",
    SuccessURL: `https://generalconclave.general-conclave-industries.workers.dev/payment/success?OrderId=${orderId}`,
    FailURL: "https://generalconclave.general-conclave-industries.workers.dev/digital",
    NotificationURL: "https://generalconclave.general-conclave-industries.workers.dev/api/payment/callback",
  };

  params.Token = generateToken(params, password);

  const response = await fetch("https://securepay.tinkoff.ru/v2/Init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!data.Success) {
    return NextResponse.json({ error: data.Message }, { status: 400 });
  }

  return NextResponse.json({ url: data.PaymentURL });
}
