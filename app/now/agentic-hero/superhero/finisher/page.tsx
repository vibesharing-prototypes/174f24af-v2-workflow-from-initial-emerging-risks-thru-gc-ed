"use client";
import React from "react";
import {
  PipelineBanner,
  AgentNav,
  AgentPageShell,
  SectionHeader,
  DocumentPreview,
  Icons,
  cn,
} from "../shared";

type ChecklistStatus = "complete" | "pending" | "not-started";

const FILING_CHECKLIST = [
  { label: "Draft approved by GC", status: "complete" as ChecklistStatus, date: "Feb 11, 2026" },
  { label: "Outside counsel reviewed", status: "complete" as ChecklistStatus, date: "Feb 11, 2026" },
  { label: "Audit committee sign-off", status: "pending" as ChecklistStatus, date: "Scheduled: Feb 20, 2026", isNext: true },
  { label: "CEO/CFO certification", status: "not-started" as ChecklistStatus, date: "Target: Feb 25, 2026" },
  { label: "EDGAR filing submission", status: "not-started" as ChecklistStatus, date: "Deadline: March 31, 2026" },
];

const AUDIT_TRAIL = [
  { time: "9:00 AM", action: "Pipeline initiated for Q1 2026 Board Cycle" },
  { time: "9:30 AM", action: "The Reviewer scanned 47 slides across 4 board decks", agentId: "reviewer" },
  { time: "10:15 AM", action: "The Coordinator sent validation requests to 8 business owners", agentId: "coordinator" },
  { time: "11:30 AM", action: "The Writer drafted 10K risk disclosure section (4,280 words)", agentId: "writer" },
  { time: "12:00 PM", action: "Draft shared with Davis Polk via Boards secure workspace", agentId: "writer" },
  { time: "2:15 PM", action: "3 counsel comments received, 2 accepted", agentId: "writer" },
  { time: "Pending", action: "1 counsel comment awaiting resolution", isPending: true },
  { time: "Pending", action: "The Finisher will incorporate final edits and prepare for filing", agentId: "finisher", isPending: true },
];

const FINAL_DOCUMENT_TEXT = `Item 1A. Risk Factors

The following risk factors should be read carefully in connection with evaluating our business and the forward-looking statements contained in this Annual Report on Form 10-K.

Risks Related to Our Business and Strategy

Revenue Concentration Risk — Our business is subject to significant revenue concentration, with our top three clients representing approximately 42% of annual revenue.

Third-Party Cybersecurity Risk — We rely on third-party service providers for critical business functions. A cybersecurity incident affecting any of our key vendors could disrupt our operations and expose sensitive data.

Supply Chain Concentration — Approximately 68% of our cost of goods sold is tied to two primary suppliers. Approximately 47% of our chip suppliers have Taiwan-based operations, exposing us to geopolitical supply chain disruption risk.

Regulatory and Compliance Risks — We are subject to evolving regulatory frameworks including the EU Digital Markets Act. Compliance costs associated with these regulations have not been fully budgeted.`;

function ChecklistRow({ item }: { item: typeof FILING_CHECKLIST[0] }) {
  return (
    <div className={cn("flex items-center gap-4 rounded-lg border px-4 py-3 transition-all", item.status === "complete" && "border-[#30363d] bg-[#161b22]", item.status === "pending" && "border-[#d29922]/40 bg-[#d29922]/5", item.status === "not-started" && "border-[#30363d] bg-[#161b22]", item.isNext && "ring-1 ring-[#58a6ff]/30")}>
      <div className="flex-shrink-0">
        {item.status === "complete" && <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3fb950]/20"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg></div>}
        {item.status === "pending" && <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d29922]/20"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d29922" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg></div>}
        {item.status === "not-started" && <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#484f58]"><div className="h-2 w-2 rounded-full bg-[#484f58]" /></div>}
      </div>
      <div className="flex-1 min-w-0">
        <span className={cn("text-sm", item.status === "complete" && "text-[#8b949e]", item.status === "pending" && "text-[#d29922] font-medium", item.status === "not-started" && "text-[#484f58]")}>{item.label}</span>
      </div>
      <span className={cn("text-xs whitespace-nowrap flex-shrink-0", item.status === "complete" && "text-[#3fb950]", item.status === "pending" && "text-[#d29922]", item.status === "not-started" && "text-[#484f58]")}>{item.date}</span>
    </div>
  );
}

export default function FinisherPage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <PipelineBanner />
      <AgentNav activeAgent="finisher" />

      <main className="mx-auto max-w-7xl px-6 py-6">
        <AgentPageShell agentId="finisher" title="The Finisher" subtitle="Filing Prep — Waiting on counsel review to complete" status="pending">
          <div className="rounded-xl border border-[#d29922]/40 bg-[#d29922]/5 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#d29922]/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d29922" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#d29922]">Waiting for The Writer to complete counsel review</h3>
                <p className="mt-1 text-xs text-[#8b949e]">1 pending comment must be resolved before filing prep can begin</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => <div key={i} className={cn("h-2 w-8 rounded-full", i <= 4 ? "bg-[#3fb950]" : "bg-[#30363d]")} />)}
                  </div>
                  <span className="text-xs text-[#8b949e]">4 of 5 pipeline stages complete</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <SectionHeader title="Final Document View" subtitle="Preview of filing-ready 10K risk disclosure" />
            <DocumentPreview title="10K Risk Disclosure — Final Version" type="Preview">
              <div className="max-h-[420px] overflow-y-auto pr-2">
                <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-[#8b949e]/80">{FINAL_DOCUMENT_TEXT}</div>
              </div>
            </DocumentPreview>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-3 text-center">
                <div className="text-lg font-bold text-[#f0f6fc]">4,280</div>
                <div className="text-[10px] text-[#484f58]">Words</div>
              </div>
              <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-3 text-center">
                <div className="text-lg font-bold text-[#f0f6fc]">Grade 14.2</div>
                <div className="text-[10px] text-[#484f58]">Readability</div>
              </div>
              <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-3 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                  <span className="text-lg font-bold text-[#3fb950]">Verified</span>
                </div>
                <div className="text-[10px] text-[#484f58]">Item 1A format — SEC compliance</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <SectionHeader title="Filing Workflow Checklist" subtitle="Track progress from approval through EDGAR submission" />
            <div className="space-y-2">
              {FILING_CHECKLIST.map((item) => <ChecklistRow key={item.label} item={item} />)}
            </div>
          </div>

          <div className="mt-6">
            <SectionHeader title="Audit Trail" subtitle="Complete log of every change from extraction through filing" />
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] overflow-hidden">
              <div className="px-4">
                {AUDIT_TRAIL.map((entry, i) => (
                  <div key={i} className={cn("flex items-start gap-4 py-3", i < AUDIT_TRAIL.length - 1 && "border-b border-[#21262d]")}>
                    <div className={cn("h-2 w-2 rounded-full flex-shrink-0 mt-1.5", entry.isPending ? "bg-[#d29922]" : "bg-[#3fb950]")} />
                    <span className={cn("text-[11px] whitespace-nowrap w-16 flex-shrink-0 pt-px font-mono", entry.isPending ? "text-[#d29922]" : "text-[#484f58]")}>{entry.time}</span>
                    {entry.agentId && (
                      <div className="flex h-5 w-5 items-center justify-center rounded flex-shrink-0 bg-[#21262d] text-[#8b949e]">
                        {entry.agentId === "reviewer" && Icons.scan}
                        {entry.agentId === "coordinator" && Icons.route}
                        {entry.agentId === "writer" && Icons.pen}
                        {entry.agentId === "finisher" && Icons.check}
                      </div>
                    )}
                    {!entry.agentId && <div className="flex h-5 w-5 items-center justify-center rounded flex-shrink-0 bg-[#21262d] text-[#8b949e]">{Icons.zap}</div>}
                    <span className={cn("text-xs leading-relaxed", entry.isPending ? "text-[#d29922]" : "text-[#8b949e]")}>{entry.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[#3fb950]/30 bg-[#3fb950]/5 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3fb950]/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              </div>
              <h3 className="text-sm font-semibold text-[#3fb950]">Full Pipeline Summary</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="rounded-md border border-[#30363d] bg-[#161b22] px-2.5 py-1 text-[#f0f6fc] font-medium">Board materials</span>
              <span className="text-[#3fb950]">→</span>
              <span className="rounded-md border border-[#30363d] bg-[#161b22] px-2.5 py-1 text-[#f0f6fc] font-medium">Validated risks</span>
              <span className="text-[#3fb950]">→</span>
              <span className="rounded-md border border-[#30363d] bg-[#161b22] px-2.5 py-1 text-[#f0f6fc] font-medium">10K disclosure</span>
              <span className="text-[#3fb950]">→</span>
              <span className="rounded-md border border-[#3fb950]/30 bg-[#3fb950]/10 px-2.5 py-1 text-[#3fb950] font-semibold">Filing-ready</span>
              <span className="ml-2 text-[#8b949e]">in 3 days</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <span className="text-xs text-[#484f58]">Waiting on pending counsel comment</span>
            <button disabled className="inline-flex items-center gap-2 rounded-lg bg-[#21262d] px-4 py-2 text-sm font-medium text-[#484f58] cursor-not-allowed border border-[#30363d]">
              Begin filing prep
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </AgentPageShell>
      </main>
    </div>
  );
}
