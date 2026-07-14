"use client";

import Papa from "papaparse";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CsvUploadClient() {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        const response = await fetch("/api/contacts/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contacts: result.data }),
        });
        const json = await response.json();
        setSummary(`Inserted ${json.inserted || 0}, skipped ${json.skipped || 0}, failed ${json.failed || 0}.`);
        setLoading(false);
      },
      error: (error) => {
        setSummary(error.message);
        setLoading(false);
      },
    });
  }

  return (
    <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8">
      <h3 className="text-lg font-bold text-slate-950">CSV upload</h3>
      <p className="mt-2 text-sm text-slate-500">
        Required columns: first_name,last_name,email,company_name,city,business_type,service_interest,source.
      </p>
      <label className="mt-6 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 text-center text-sm text-slate-600 hover:bg-slate-100">
        <input
          className="sr-only"
          type="file"
          accept=".csv,text/csv"
          disabled={loading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        <span className="font-semibold">Choose CSV file</span>
        <span className="mt-1">Duplicate and invalid emails are skipped.</span>
      </label>
      {loading ? <Button className="mt-4" disabled>Uploading...</Button> : null}
      {summary ? <p className="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800">{summary}</p> : null}
    </section>
  );
}

