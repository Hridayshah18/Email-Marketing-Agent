import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ContactForm } from "../contact-form";
import { deleteContact } from "../form-actions";

export const dynamic = "force-dynamic";

export default async function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const contact = supabase ? (await supabase.from("contacts").select("*").eq("id", id).single()).data : null;
  return (
    <AppShell title="Edit contact">
      <ContactForm contact={contact} />
      <form action={deleteContact} className="mt-4">
        <input type="hidden" name="id" value={id} />
        <Button variant="danger">Delete contact</Button>
      </form>
    </AppShell>
  );
}

