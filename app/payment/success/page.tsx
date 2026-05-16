import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";
import Link from "next/link";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ OrderId?: string }>;
}) {
  const { OrderId } = await searchParams;

  if (OrderId) {
    const parts = String(OrderId).split("_");
    const productId = parseInt(parts[0]);
    const userId = parts[1];

    if (productId && userId) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user && user.id === userId) {
        const admin = createAdmin(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        await admin.from("purchases").upsert(
          { user_id: userId, product_id: productId, order_id: OrderId },
          { onConflict: "user_id,product_id", ignoreDuplicates: true }
        );
      } else if (!user) {
        redirect("/auth/login");
      }
    }
  }

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(48,209,88,0.15)", border: "1px solid rgba(48,209,88,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2rem" }}>✓</div>
        <h1 style={{ fontWeight: 700, fontSize: "1.8rem", letterSpacing: "-0.04em", marginBottom: "0.75rem" }}>Оплата прошла!</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "2rem" }}>
          Продукт доступен в личном кабинете — вкладка «Покупки».
        </p>
        <Link href="/account" className="btn-apple" style={{ textDecoration: "none", border: "none" }}>
          Перейти в кабинет →
        </Link>
      </div>
    </main>
  );
}
