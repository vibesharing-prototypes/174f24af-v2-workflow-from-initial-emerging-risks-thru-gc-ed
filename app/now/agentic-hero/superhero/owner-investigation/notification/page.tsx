"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const OWNER_DATA: Record<string, { name: string; title: string }> = {
  "diana-reyes": { name: "Diana Reyes", title: "VP Supply Chain" },
  "marcus-webb": { name: "Marcus Webb", title: "CISO" },
  "james-park": { name: "James Park", title: "Chief Compliance Officer" },
};

const RISK_NAMES: Record<string, string> = {
  "risk-taiwan": "Taiwan Strait Geopolitical Tensions",
  "risk-vendor": "Critical Vendor Cybersecurity Breach",
  "risk-dma": "EU Digital Markets Act Enforcement",
};

function NotificationContent() {
  const searchParams = useSearchParams();
  const riskId = searchParams?.get("risk") || "risk-taiwan";
  const ownerId = searchParams?.get("owner") || "diana-reyes";

  const owner = OWNER_DATA[ownerId] || OWNER_DATA["diana-reyes"];
  const riskName = RISK_NAMES[riskId] || RISK_NAMES["risk-taiwan"];
  const investigationUrl = `/now/agentic-hero/superhero/owner-investigation?risk=${riskId}&owner=${ownerId}`;

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      {/* Meta-Prototype-Info blue banner with actor indicator */}
      <div className="border-b-2 border-[#0ea5e9]/40 bg-[#e0f2fe] flex-shrink-0">
        <div className="border-b border-[#0ea5e9]/30 bg-[#bae6fd] px-4 py-2">
          <p className="text-[10px] font-medium uppercase tracking-widest text-[#0369a1]">Demo controls — not part of prototype</p>
        </div>
        <div className="px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-[#0369a1]">Prototype</span>
            <span className="text-sm font-semibold text-[#0c4a6e]">Risk Detection → 10K Update → Board Notification</span>
          </div>
          <span className="rounded-full border-2 border-[#0c4a6e] bg-[#7dd3fc]/30 px-3 py-1 text-xs font-semibold text-[#0c4a6e]">
            Viewing as: {owner.name} (Risk Owner)
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <p className="text-center text-sm text-[#8b949e] mb-6">
            {owner.name} receives this notification after the General Counsel assigns risk owners.
          </p>

          {/* Email mockup */}
          <div className="rounded-2xl border border-[#30363d] bg-[#161b22] overflow-hidden shadow-xl">
            <div className="border-b border-[#30363d] bg-[#0d1117] px-6 py-4">
              <div className="flex items-center gap-2 text-[#6e7681] text-xs mb-2">
                <span>From:</span>
                <span className="text-[#f0f6fc]">GRC Command Center &lt;noreply@diligent.com&gt;</span>
              </div>
              <div className="flex items-center gap-2 text-[#6e7681] text-xs mb-2">
                <span>To:</span>
                <span className="text-[#f0f6fc]">{owner.name} &lt;{owner.name.toLowerCase().replace(" ", ".")}@company.com&gt;</span>
              </div>
              <div className="flex items-center gap-2 text-[#6e7681] text-xs">
                <span>Subject:</span>
                <span className="text-[#f0f6fc] font-medium">Risk investigation required: {riskName}</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-[#f0f6fc]">
                Hi {owner.name.split(" ")[0]},
              </p>
              <p className="text-sm text-[#8b949e] leading-relaxed">
                The General Counsel has assigned you to investigate an emerging risk that requires your domain expertise. 
                Your input is needed before the team can draft 10-K disclosure updates.
              </p>
              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#6e7681] mb-1">Assigned risk</p>
                <p className="text-sm font-semibold text-[#f0f6fc]">{riskName}</p>
              </div>
              <p className="text-sm text-[#8b949e] leading-relaxed">
                Please review the AI analysis, add context from your expertise, and validate the severity and disclosure recommendations. 
                The investigation is due by Feb 5, 2026.
              </p>
              <Link
                href={investigationUrl}
                className="inline-flex items-center gap-2 rounded-lg bg-[#58a6ff] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#79c0ff] transition-colors"
              >
                Start investigation
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-[#6e7681] mt-6">
            Click &quot;Start investigation&quot; to continue as {owner.name} →
          </p>

          <div className="mt-8 text-center">
            <Link href="/now/agentic-hero/superhero/coordinator" className="text-xs text-[#58a6ff] hover:underline">
              ← Back to coordinator (GC view)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotificationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d1117] flex items-center justify-center"><div className="h-8 w-8 border-2 border-[#58a6ff] border-t-transparent rounded-full animate-spin" /></div>}>
      <NotificationContent />
    </Suspense>
  );
}
