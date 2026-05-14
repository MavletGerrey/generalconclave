import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminClient from "./AdminClient";

const ADMIN_EMAIL = "mavletgerreyllc@gmail.com";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) redirect("/");

  const { data: tickets } = await supabase
    .from("tickets")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  const { data: requests } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminClient tickets={tickets ?? []} requests={requests ?? []} />;
}
