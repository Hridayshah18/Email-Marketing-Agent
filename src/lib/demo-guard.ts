import { NextResponse } from "next/server";

export function isDemoRequest(request: Request) {
  const demoHeader = request.headers.get("x-demo-mode") === "true";
  const referer = request.headers.get("referer") || "";
  return demoHeader || referer.includes("/demo");
}

export function blockDemoRequest(request: Request) {
  if (!isDemoRequest(request)) return null;
  return NextResponse.json({ error: "Demo mode cannot perform this action." }, { status: 403 });
}

