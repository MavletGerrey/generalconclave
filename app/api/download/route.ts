import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "no productId" }, { status: 400 });

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: purchase } = await admin
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", parseInt(productId))
    .single();

  if (!purchase) return NextResponse.json({ error: "not purchased" }, { status: 403 });

  const { data: product } = await admin
    .from("products")
    .select("file_path")
    .eq("id", parseInt(productId))
    .single();

  if (!product?.file_path) return NextResponse.json({ error: "no file" }, { status: 404 });

  const { data: signed } = await admin.storage
    .from("product-files")
    .createSignedUrl(product.file_path, 3600);

  if (!signed?.signedUrl) return NextResponse.json({ error: "storage error" }, { status: 500 });

  return NextResponse.redirect(signed.signedUrl);
}
