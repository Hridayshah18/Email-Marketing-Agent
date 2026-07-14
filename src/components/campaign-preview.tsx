export function CampaignPreview({ html }: { html?: string | null }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <iframe
        title="Email preview"
        className="h-[620px] w-full bg-white"
        sandbox=""
        srcDoc={html || "<p style='font-family:Arial;padding:24px;color:#64748b'>No HTML preview yet.</p>"}
      />
    </div>
  );
}

