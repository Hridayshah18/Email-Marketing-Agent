import { AppShell } from "@/components/layout/app-shell";
import { CsvUploadClient } from "./upload-client";

export default function UploadContactsPage() {
  return (
    <AppShell title="Upload contacts">
      <CsvUploadClient />
    </AppShell>
  );
}

