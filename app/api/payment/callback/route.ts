import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function verifyToken(params: Record<string, string>, password: string): boolean {
  const filtered: Record<string, string> = { ...params, Password: password };
  delete filtered.Token;
  const sorted = Object.keys(filtered).sort().map(k => filtered[k]).join("");
  const expected = createHash("sha256").update(sorted).digest("hex");
  return expected === params.Token;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { Status, OrderId, Token } = body;

  if (!verifyToken(body, process.env.TINKOFF_SECRET!)) {
    return NextResponse.json({ error: "invalid token" }, { status: 400 });
  }

  if (Status === "CONFIRMED" && OrderId) {
    const parts = String(OrderId).split("_");
    const productId = parseInt(parts[0]);
    const userId = parts[1];

    if (productId && userId) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await supabase.from("purchases").upsert(
        { user_id: userId, product_id: productId, order_id: OrderId },
        { onConflict: "user_id,product_id", ignoreDuplicates: true }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
