"use client";
import React, { useState } from "react";
import Link from "next/link";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function DiligentLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 222 222" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path fill="#EE312E" d="M200.87,110.85c0,33.96-12.19,61.94-33.03,81.28c-0.24,0.21-0.42,0.43-0.66,0.64c-15.5,14.13-35.71,23.52-59.24,27.11l-1.59-1.62l35.07-201.75l1.32-3.69C178.64,30.36,200.87,65.37,200.87,110.85z"/>
        <path fill="#AF292E" d="M142.75,12.83l-0.99,1.47L0.74,119.34L0,118.65c0,0,0-0.03,0-0.06V0.45h85.63c5.91,0,11.64,0.34,17.19,1.01h0.21c14.02,1.66,26.93,5.31,38.48,10.78C141.97,12.46,142.75,12.83,142.75,12.83z"/>
        <path fill="#D3222A" d="M142.75,12.83L0,118.65v99.27v3.62h85.96c7.61,0,14.94-0.58,21.99-1.66C107.95,219.89,142.75,12.83,142.75,12.83z"/>
      </g>
    </svg>
  );
}

const workflowStages = [
  { id: "detect", label: "Detect", status: "completed" as const, href: "/step-1" },
  { id: "review", label: "Review Sources", status: "completed" as const, href: "/now/agentic-hero/superhero/reviewer" },
  { id: "assign", label: "Assign Owners", status: "completed" as const, href: "/now/agentic-hero/superhero/coordinator" },
  { id: "investigate", label: "Investigate", status: "current" as const, href: "/now/agentic-hero/superhero/investigator" },
  { id: "draft", label: "Draft 10-K", status: "pending" as const, href: "/now/agentic-hero/superhero/writer" },
  { id: "notify", label: "Notify Board", status: "pending" as const, href: "/now/agentic-hero/superhero/finisher" },
];

const RISK_DETAILS = {
  name: "Taiwan Strait Geopolitical Tensions",
  severity: "critical" as const,
  assignedTo: { name: "Diana Reyes", title: "VP Supply Chain", avatar: "from-[#3fb950] to-[#58a6ff]" },
  assignedAt: "9:45 AM",
  dueDate: "Feb 5, 2026",
  summary: "Escalating tensions in the Taiwan Strait may disrupt semiconductor supply chain. Analysis shows 47% of chip suppliers have Taiwan-based operations.",
  aiAnalysis: `Based on analysis of 2,847 news items, 186 supply chain records, and cross-reference with current 10-K disclosures, I've identified a significant disclosure gap:

CURRENT STATE:
- 47% of semiconductor suppliers have Taiwan-based manufacturing
- 23% of annual chip procurement flows through Taiwan facilities
- Current 10-K mentions "general supply chain risks" but no geographic specificity

RISK FACTORS:
1. Recent military exercises increased shipping disruption risk by 340%
2. Insurance costs for Taiwan-sourced components up 67% YoY
3. Lead times extended 2-4 weeks for Taiwan-manufactured chips

RECOMMENDED DISCLOSURE UPDATE:
Add specific language addressing semiconductor supply concentration in Taiwan region and potential impact of geopolitical disruption on operations.`,
};

const AI_GATHERED_CONTEXT = [
  { id: "taiwan-exposure", label: "Taiwan Supplier Exposure", aiValue: "47%", source: "Supply Chain Database", confidence: 94 },
  { id: "inventory-buffer", label: "Current Inventory Buffer", aiValue: "~8 weeks", source: "Procurement Systems", confidence: 89 },
  { id: "lead-time-impact", label: "Estimated Lead Time Impact", aiValue: "2-4 weeks additional", source: "Industry Analysis", confidence: 76 },
  { id: "alternative-suppliers", label: "Alternative Suppliers Identified", aiValue: "3 (12-18 mo qualification)", source: "Vendor Intelligence", confidence: 82 },
  { id: "revenue-impact", label: "Potential Revenue Impact", aiValue: "$45-60M quarterly", source: "Financial Modeling", confidence: 71 },
];

const QUESTIONS_FOR_OWNER = [
  { id: "q1", question: "Have you begun supplier diversification efforts? If so, what's the timeline?", placeholder: "e.g., We initiated Samsung discussions in Q3 2025..." },
  { id: "q2", question: "What's the realistic timeline to shift 50% of Taiwan-sourced components to alternatives?", placeholder: "e.g., 18-24 months minimum..." },
  { id: "q3", question: "Are there any internal initiatives or Board-approved plans that should be mentioned?", placeholder: "e.g., Board approved $15M supply chain resilience investment..." },
];

const ACTIVITY_LOG = [
  { time: "9:45 AM", action: "Risk assigned by General Counsel to Diana Reyes (VP Supply Chain)" },
  { time: "9:46 AM", action: "AI began gathering context from supply chain systems" },
  { time: "9:50 AM", action: "Identified comparable disclosure language from peer 10-K filings" },
  { time: "9:52 AM", action: "Generated investigation questions based on disclosure requirements" },
];

export default function InvestigatorPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contextEdits, setContextEdits] = useState<Record<string, string>>({});
  const [severityValidated, setSeverityValidated] = useState<"agree" | "upgrade" | "downgrade" | null>(null);
  const [severityReason, setSeverityReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim()).length;
  const allAnswered = answeredCount === QUESTIONS_FOR_OWNER.length;
  const canSubmit = allAnswered && severityValidated !== null;

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="w-full border-b border-[#30363d] bg-[#161b22]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[#6e7681]">Prototype</span>
            <span className="text-sm font-semibold text-[#f0f6fc]">Risk Detection → 10K Update → Board Notification</span>
            <span className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/10 px-2 py-0.5 text-[10px] font-medium text-[#a371f7]">Step 3: Owner Investigation</span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="rounded-3xl border border-[#30363d] bg-[#161b22] shadow-sm">
          <div className="border-b border-[#30363d] bg-[#0d1117]/90 px-6 py-4 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <DiligentLogo className="h-7 w-auto" />
                  <span className="text-sm font-semibold text-[#f0f6fc]">GRC Command Center</span>
                </div>
                <span className="rounded-full border border-[#3fb950]/40 bg-[#3fb950]/10 px-2 py-0.5 text-[10px] font-medium text-[#3fb950]">Risk Owner: {RISK_DETAILS.assignedTo.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/step-1" className="text-xs text-[#8b949e] hover:text-[#f0f6fc]">← Back to Dashboard</Link>
                <div className={cn("h-8 w-8 rounded-full bg-gradient-to-br", RISK_DETAILS.assignedTo.avatar)} />
              </div>
            </div>
          </div>

          <div className="border-b border-[#30363d] bg-[#0d1117]/50 px-6 py-3">
            <div className="flex items-center justify-center gap-2">
              {workflowStages.map((stage, idx) => (
                <React.Fragment key={stage.id}>
                  <Link href={stage.href} className={cn("flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors", stage.status === "completed" && "bg-[#3fb950]/10 text-[#3fb950] hover:bg-[#3fb950]/20", stage.status === "current" && "bg-[#a371f7]/20 text-[#a371f7] ring-1 ring-[#a371f7]/50", stage.status === "pending" && "bg-[#21262d] text-[#6e7681] hover:text-[#8b949e]")}>
                    {stage.status === "completed" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
                    {stage.status === "current" && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a371f7] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#a371f7]"></span></span>}
                    <span className="font-medium">{stage.label}</span>
                  </Link>
                  {idx < workflowStages.length - 1 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stage.status === "completed" ? "#3fb950" : "#30363d"} strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="px-6 py-6">
            <div className={cn("rounded-xl border p-4 mb-6", submitted ? "border-[#3fb950]/30 bg-[#3fb950]/5" : "border-[#a371f7]/30 bg-[#a371f7]/5")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("h-12 w-12 rounded-full bg-gradient-to-br flex items-center justify-center", RISK_DETAILS.assignedTo.avatar)}>
                    {submitted && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#f0f6fc]">{RISK_DETAILS.assignedTo.name}</div>
                    <div className="text-xs text-[#8b949e]">{RISK_DETAILS.assignedTo.title}</div>
                  </div>
                </div>
                <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", submitted ? "border-[#3fb950]/50 bg-[#3fb950]/20 text-[#3fb950]" : "border-[#d29922]/50 bg-[#d29922]/20 text-[#d29922]")}>{submitted ? "Submitted" : "In Progress"}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#da3633]/20">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#da3633" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-[#f0f6fc]">{RISK_DETAILS.name}</h1>
                  <span className="rounded-full border border-[#da3633]/50 bg-[#da3633]/20 px-2 py-0.5 text-[10px] font-medium uppercase text-[#da3633]">{RISK_DETAILS.severity}</span>
                </div>
              </div>
              <p className="text-sm text-[#8b949e] ml-[52px]">{RISK_DETAILS.summary}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
                    <span className="text-sm font-medium text-[#f0f6fc]">AI Analysis</span>
                  </div>
                  <div className="p-4">
                    <pre className="text-xs text-[#8b949e] whitespace-pre-wrap font-mono leading-relaxed">{RISK_DETAILS.aiAnalysis}</pre>
                  </div>
                </div>

                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
                    <span className="text-sm font-medium text-[#f0f6fc]">AI-Gathered Context</span>
                  </div>
                  <div className="divide-y divide-[#21262d]">
                    {AI_GATHERED_CONTEXT.map((item) => (
                      <div key={item.id} className="px-4 py-3 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-xs font-medium text-[#f0f6fc]">{item.label}</div>
                          <div className="text-[10px] text-[#6e7681] mt-0.5">{item.source}</div>
                        </div>
                        <input type="text" value={contextEdits[item.id] ?? item.aiValue} onChange={(e) => setContextEdits(prev => ({ ...prev, [item.id]: e.target.value }))} className="w-32 rounded border border-[#30363d] bg-[#161b22] px-2 py-1 text-xs text-[#f0f6fc] text-right focus:border-[#58a6ff] focus:outline-none" disabled={submitted} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
                    <span className="text-sm font-medium text-[#f0f6fc]">Your Domain Expertise Needed ({answeredCount}/{QUESTIONS_FOR_OWNER.length} answered)</span>
                  </div>
                  <div className="p-4 space-y-4">
                    {QUESTIONS_FOR_OWNER.map((q, i) => (
                      <div key={q.id}>
                        <label className="text-xs font-medium text-[#f0f6fc] block mb-2">{i + 1}. {q.question}</label>
                        <textarea value={answers[q.id] ?? ""} onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))} placeholder={q.placeholder} className="w-full rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2 text-xs text-[#f0f6fc] placeholder-[#484f58] focus:border-[#58a6ff] focus:outline-none resize-none" rows={3} disabled={submitted} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
                    <span className="text-sm font-medium text-[#f0f6fc]">Validate Severity Assessment</span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-[#8b949e] mb-4">AI assessed this risk as <span className="text-[#da3633] font-semibold">CRITICAL</span>. Based on your domain expertise, do you agree?</p>
                    <div className="flex items-center gap-3 mb-4">
                      {[{ value: "agree", label: "Agree with CRITICAL" }, { value: "upgrade", label: "Should be higher" }, { value: "downgrade", label: "Should be lower" }].map((opt) => (
                        <label key={opt.value} className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-all", severityValidated === opt.value ? "border-[#58a6ff] bg-[#58a6ff]/10" : "border-[#30363d] hover:border-[#58a6ff]/50", submitted && "cursor-not-allowed opacity-70")}>
                          <input type="radio" name="severity" value={opt.value} checked={severityValidated === opt.value} onChange={() => setSeverityValidated(opt.value as typeof severityValidated)} className="hidden" disabled={submitted} />
                          <div className={cn("h-3 w-3 rounded-full border", severityValidated === opt.value ? "bg-[#58a6ff] border-[#58a6ff]" : "border-[#484f58]")} />
                          <span className="text-xs text-[#f0f6fc]">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                    {(severityValidated === "upgrade" || severityValidated === "downgrade") && <textarea value={severityReason} onChange={(e) => setSeverityReason(e.target.value)} placeholder="Please explain your reasoning..." className="w-full rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2 text-xs text-[#f0f6fc] placeholder-[#484f58] focus:border-[#58a6ff] focus:outline-none resize-none" rows={2} disabled={submitted} />}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-[#484f58] mb-3">Investigation Progress</div>
                  <div className="space-y-3">
                    {[{ label: "Review AI analysis", done: true }, { label: "Verify context data", done: Object.keys(contextEdits).length > 0 || submitted }, { label: "Answer questions", done: allAnswered }, { label: "Validate severity", done: severityValidated !== null }].map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={cn("h-5 w-5 rounded-full flex items-center justify-center", step.done ? "bg-[#3fb950]/20" : "bg-[#21262d]")}>
                          {step.done ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg> : <div className="h-2 w-2 rounded-full bg-[#484f58]" />}
                        </div>
                        <span className={cn("text-xs", step.done ? "text-[#3fb950]" : "text-[#8b949e]")}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-[#484f58] mb-3">Activity</div>
                  <div className="space-y-2">
                    {ACTIVITY_LOG.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-[10px]">
                        <span className="text-[#484f58] whitespace-nowrap">{item.time}</span>
                        <span className="text-[#8b949e]">{item.action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => setSubmitted(true)} disabled={!canSubmit || submitted} className={cn("w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors", canSubmit && !submitted ? "bg-[#3fb950] text-[#0d1117] hover:bg-[#56d364]" : "bg-[#21262d] text-[#484f58] cursor-not-allowed")}>
                  {submitted ? "✓ Investigation Submitted" : canSubmit ? "Submit Investigation" : `Complete ${4 - [true, Object.keys(contextEdits).length > 0, allAnswered, severityValidated !== null].filter(Boolean).length} more steps`}
                </button>

                {submitted && (
                  <div className="rounded-xl border border-[#3fb950]/30 bg-[#3fb950]/5 p-4">
                    <div className="text-xs font-medium text-[#3fb950] mb-2">Investigation Complete</div>
                    <p className="text-[10px] text-[#8b949e]">Your context has been added to the risk analysis. The General Counsel will proceed to draft the 10-K disclosure update.</p>
                    <Link href="/now/agentic-hero/superhero/writer" className="mt-3 inline-flex items-center gap-1 text-xs text-[#58a6ff] hover:underline">Continue to 10-K drafting →</Link>
                  </div>
                )}

                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-[#484f58] mb-3">Quick Links</div>
                  <div className="space-y-2">
                    <Link href="/now/agentic-hero/superhero/coordinator" className="block text-xs text-[#58a6ff] hover:underline">← Back to owner assignments</Link>
                    <Link href="/step-1" className="block text-xs text-[#8b949e] hover:text-[#f0f6fc]">← Back to Command Center</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
