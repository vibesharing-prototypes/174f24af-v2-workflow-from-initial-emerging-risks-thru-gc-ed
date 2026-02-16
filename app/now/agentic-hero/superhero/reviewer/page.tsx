"use client";
import React, { useState } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Shared Utilities & Components                                      */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Workflow stages                                                    */
/* ------------------------------------------------------------------ */

type WorkflowStage = {
  id: string;
  label: string;
  status: "completed" | "current" | "pending";
  href: string;
};

const workflowStages: WorkflowStage[] = [
  { id: "detect", label: "Detect", status: "completed", href: "/step-1" },
  { id: "review", label: "Review Sources", status: "current", href: "/now/agentic-hero/superhero/reviewer" },
  { id: "assign", label: "Assign Owners", status: "pending", href: "/now/agentic-hero/superhero/coordinator" },
  { id: "investigate", label: "Investigate", status: "pending", href: "/now/agentic-hero/superhero/investigator" },
  { id: "draft", label: "Draft 10-K", status: "pending", href: "/now/agentic-hero/superhero/writer" },
  { id: "notify", label: "Notify Board", status: "pending", href: "/now/agentic-hero/superhero/finisher" },
];

/* ------------------------------------------------------------------ */
/*  Sources Scanned Data                                               */
/* ------------------------------------------------------------------ */

type SourceScanned = {
  name: string;
  type: "news" | "regulatory" | "vendor" | "internal" | "financial";
  itemsScanned: number;
  risksFound: number;
  lastScan: string;
  coverage: string;
};

const SOURCES_SCANNED: SourceScanned[] = [
  {
    name: "Global News & Media Feeds",
    type: "news",
    itemsScanned: 2847,
    risksFound: 1,
    lastScan: "8:47 AM",
    coverage: "Reuters, Bloomberg, WSJ, FT, AP, industry publications",
  },
  {
    name: "SEC EDGAR & Regulatory Filings",
    type: "regulatory",
    itemsScanned: 156,
    risksFound: 0,
    lastScan: "7:23 AM",
    coverage: "8-K, 10-K, 10-Q filings from peer companies",
  },
  {
    name: "EU Regulatory Database",
    type: "regulatory",
    itemsScanned: 89,
    risksFound: 1,
    lastScan: "7:23 AM",
    coverage: "EC enforcement actions, DMA/DSA decisions, GDPR fines",
  },
  {
    name: "Vendor Intelligence Network",
    type: "vendor",
    itemsScanned: 342,
    risksFound: 1,
    lastScan: "9:12 AM",
    coverage: "Third-party risk feeds, vendor news, cybersecurity advisories",
  },
  {
    name: "Current 10-K Risk Factors",
    type: "internal",
    itemsScanned: 47,
    risksFound: 3,
    lastScan: "8:50 AM",
    coverage: "Item 1A risk disclosures from most recent annual report",
  },
  {
    name: "Board Meeting Materials",
    type: "internal",
    itemsScanned: 28,
    risksFound: 0,
    lastScan: "8:55 AM",
    coverage: "Feb 28 board deck, committee reports, CEO presentation",
  },
  {
    name: "Supply Chain Data",
    type: "financial",
    itemsScanned: 186,
    risksFound: 1,
    lastScan: "8:47 AM",
    coverage: "Supplier contracts, concentration analysis, geographic exposure",
  },
];

const sourceTypeIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  news: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8M18 18h-8M18 10h-8M18 6h-8" />
      </svg>
    ),
    color: "text-[#58a6ff] bg-[#58a6ff]/10",
  },
  regulatory: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    color: "text-[#3fb950] bg-[#3fb950]/10",
  },
  vendor: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: "text-[#a371f7] bg-[#a371f7]/10",
  },
  internal: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
    color: "text-[#f0883e] bg-[#f0883e]/10",
  },
  financial: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    color: "text-[#d29922] bg-[#d29922]/10",
  },
};

/* ------------------------------------------------------------------ */
/*  Detected Risks Data                                                */
/* ------------------------------------------------------------------ */

type DetectedRiskWithReasoning = {
  name: string;
  severity: "critical" | "high" | "medium";
  source: string;
  confidence: number;
  sources: string[];
  reasoning: string;
  disclosureGap: string;
};

const DETECTED_RISKS: DetectedRiskWithReasoning[] = [
  {
    name: "Taiwan Strait Geopolitical Tensions",
    severity: "critical",
    source: "News Feeds + Supply Chain Data",
    confidence: 94,
    sources: [
      "Reuters: Taiwan military exercises report (8:12 AM)",
      "Bloomberg: Semiconductor supply chain analysis (8:23 AM)",
      "Internal: Supplier geographic mapping (8:47 AM)",
    ],
    reasoning:
      "Escalating tensions in the Taiwan Strait may disrupt semiconductor supply chain. Analysis of supplier contracts shows 47% of chip suppliers have Taiwan-based operations. Cross-referenced with current 10-K which mentions 'general supply chain risks' but does not specifically address semiconductor concentration or geopolitical exposure in Taiwan region.",
    disclosureGap: "No specific disclosure of semiconductor supply concentration or Taiwan geopolitical risk in Item 1A",
  },
  {
    name: "Critical Vendor Cybersecurity Breach",
    severity: "high",
    source: "Vendor Intelligence Network",
    confidence: 91,
    sources: [
      "CloudSecure Inc. 8-K filing (9:08 AM)",
      "Cybersecurity Advisory: Ransomware attack confirmed (9:10 AM)",
      "Internal: Data Processing Agreement inventory (9:12 AM)",
    ],
    reasoning:
      "CloudSecure Inc. (our primary data processing vendor) disclosed a ransomware incident in their 8-K filing. They process customer PII under 3 of our data processing agreements affecting approximately 2.3M customer records. Current 10-K includes cybersecurity risks but focuses on direct company systems, not vendor/third-party exposure. May trigger state breach notification obligations in CA, NY, and TX.",
    disclosureGap: "Third-party data processor breach exposure not specifically disclosed; vendor concentration risk understated",
  },
  {
    name: "EU Digital Markets Act Enforcement Pattern",
    severity: "high",
    source: "EU Regulatory Database",
    confidence: 89,
    sources: [
      "EC Press Release: DMA enforcement actions (7:15 AM)",
      "FT: Analysis of tech sector DMA fines (7:20 AM)",
      "Internal: EU revenue exposure analysis (7:23 AM)",
    ],
    reasoning:
      "European Commission initiated enforcement actions against 3 companies in our sector for DMA non-compliance. Pattern analysis suggests our EU operations (representing 23% of revenue) may face similar scrutiny. Current 10-K mentions EU regulatory environment generally but DMA-specific compliance risks and potential enforcement exposure are not detailed. Estimated compliance costs of €8-12M not budgeted.",
    disclosureGap: "DMA compliance risks and potential enforcement exposure not disclosed in risk factors",
  },
];

/* ------------------------------------------------------------------ */
/*  Activity Log                                                       */
/* ------------------------------------------------------------------ */

const ACTIVITY_LOG = [
  { time: "7:15 AM", action: "Regulatory Watch initiated scan of EU regulatory databases" },
  { time: "7:23 AM", action: "Detected DMA enforcement pattern affecting 3 peer companies" },
  { time: "8:12 AM", action: "Risk Intelligence flagged Taiwan geopolitical news from Reuters" },
  { time: "8:47 AM", action: "Cross-referenced supplier data—47% Taiwan exposure identified" },
  { time: "8:50 AM", action: "Compared against current 10-K Item 1A risk factors" },
  { time: "9:08 AM", action: "Vendor Intelligence detected CloudSecure 8-K filing (ransomware)" },
  { time: "9:12 AM", action: "Identified 3 affected data processing agreements" },
  { time: "9:15 AM", action: "Completed disclosure gap analysis—3 risks require review" },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ReviewerPage() {
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null);
  const [expandedSource, setExpandedSource] = useState<number | null>(null);

  const totalItemsScanned = SOURCES_SCANNED.reduce((sum, s) => sum + s.itemsScanned, 0);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Prototype Nav - matches main Command Center */}
      <div className="w-full border-b border-[#30363d] bg-[#161b22]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[#6e7681]">Prototype</span>
            <span className="text-sm font-semibold text-[#f0f6fc]">Risk Detection → 10K Update → Board Notification</span>
            <span className="rounded-full border border-[#58a6ff]/40 bg-[#58a6ff]/10 px-2 py-0.5 text-[10px] font-medium text-[#58a6ff]">
              Step 1: Review Sources
            </span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Wrapper */}
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="rounded-3xl border border-[#30363d] bg-[#161b22] shadow-sm">
          {/* TopNav */}
          <div className="border-b border-[#30363d] bg-[#0d1117]/90 px-6 py-4 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <DiligentLogo className="h-7 w-auto" />
                  <span className="text-sm font-semibold text-[#f0f6fc]">GRC Command Center</span>
                </div>
                <span className="rounded-full border border-[#58a6ff]/40 bg-[#58a6ff]/10 px-2 py-0.5 text-[10px] font-medium text-[#58a6ff]">
                  General Counsel
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/step-1" className="text-xs text-[#8b949e] hover:text-[#f0f6fc]">
                  ← Back to Dashboard
                </Link>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a371f7]" />
              </div>
            </div>
          </div>

          {/* Workflow Progress */}
          <div className="border-b border-[#30363d] bg-[#0d1117]/50 px-6 py-3">
            <div className="flex items-center justify-center gap-2">
              {workflowStages.map((stage, idx) => (
                <React.Fragment key={stage.id}>
                  <Link
                    href={stage.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors",
                      stage.status === "completed" && "bg-[#3fb950]/10 text-[#3fb950] hover:bg-[#3fb950]/20",
                      stage.status === "current" && "bg-[#58a6ff]/20 text-[#58a6ff] ring-1 ring-[#58a6ff]/50",
                      stage.status === "pending" && "bg-[#21262d] text-[#6e7681] hover:text-[#8b949e]"
                    )}
                  >
                    {stage.status === "completed" && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                    {stage.status === "current" && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#58a6ff] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#58a6ff]"></span>
                      </span>
                    )}
                    <span className="font-medium">{stage.label}</span>
                  </Link>
                  {idx < workflowStages.length - 1 && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stage.status === "completed" ? "#3fb950" : "#30363d"} strokeWidth="2">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Page Content */}
          <div className="px-6 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-[#f0f6fc]">Detection Source Analysis</h1>
              <p className="mt-1 text-sm text-[#8b949e]">
                Review what agents scanned and how emerging risks were identified.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#484f58]">Sources Scanned</div>
                <div className="mt-1 text-2xl font-bold text-[#f0f6fc]">{SOURCES_SCANNED.length}</div>
                <div className="mt-1 text-xs text-[#8b949e]">News, regulatory, vendor data</div>
              </div>
              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#484f58]">Items Analyzed</div>
                <div className="mt-1 text-2xl font-bold text-[#f0f6fc]">{totalItemsScanned.toLocaleString()}</div>
                <div className="mt-1 text-xs text-[#8b949e]">Documents, articles, filings</div>
              </div>
              <div className="rounded-xl border border-[#da3633]/30 bg-[#da3633]/5 p-4">
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#da3633]">Risks Detected</div>
                <div className="mt-1 text-2xl font-bold text-[#da3633]">{DETECTED_RISKS.length}</div>
                <div className="mt-1 text-xs text-[#8b949e]">1 critical, 2 high severity</div>
              </div>
              <div className="rounded-xl border border-[#d29922]/30 bg-[#d29922]/5 p-4">
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#d29922]">Disclosure Gaps</div>
                <div className="mt-1 text-2xl font-bold text-[#d29922]">{DETECTED_RISKS.length}</div>
                <div className="mt-1 text-xs text-[#8b949e]">Missing from current 10-K</div>
              </div>
            </div>

            {/* Two Panel Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel: Sources Scanned */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#f0f6fc]">Sources Scanned</h2>
                    <p className="text-xs text-[#8b949e] mt-0.5">{totalItemsScanned.toLocaleString()} items across {SOURCES_SCANNED.length} sources</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {SOURCES_SCANNED.map((source, idx) => {
                    const typeConfig = sourceTypeIcons[source.type];
                    const isExpanded = expandedSource === idx;
                    return (
                      <div
                        key={source.name}
                        className={cn(
                          "rounded-xl border bg-[#0d1117] overflow-hidden transition-all",
                          source.risksFound > 0 ? "border-[#d29922]/40" : "border-[#30363d]"
                        )}
                      >
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#21262d]/50"
                          onClick={() => setExpandedSource(isExpanded ? null : idx)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", typeConfig.color)}>
                              {typeConfig.icon}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[#f0f6fc]">{source.name}</div>
                              <div className="text-[10px] text-[#6e7681] mt-0.5">
                                {source.itemsScanned.toLocaleString()} items · Last: {source.lastScan}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {source.risksFound > 0 ? (
                              <span className="rounded-full border border-[#d29922]/30 bg-[#d29922]/10 px-2 py-0.5 text-[10px] font-medium text-[#d29922]">
                                {source.risksFound} risk{source.risksFound !== 1 ? "s" : ""}
                              </span>
                            ) : (
                              <span className="rounded-full border border-[#3fb950]/30 bg-[#3fb950]/10 px-2 py-0.5 text-[10px] font-medium text-[#3fb950]">
                                Clear
                              </span>
                            )}
                            <svg
                              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                              className={cn("text-[#484f58] transition-transform", isExpanded && "rotate-180")}
                            >
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="border-t border-[#30363d] bg-[#161b22] px-4 py-3">
                            <div className="text-[10px] font-medium uppercase tracking-wider text-[#484f58] mb-2">Coverage</div>
                            <p className="text-xs text-[#8b949e]">{source.coverage}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-[#484f58] mb-3">
                    10-K Disclosure Gap Analysis
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-lg bg-[#161b22] border border-[#30363d] p-3 text-center">
                      <div className="text-lg font-bold text-[#3fb950]">44</div>
                      <div className="text-[10px] text-[#8b949e]">Adequately disclosed</div>
                    </div>
                    <div className="flex-1 rounded-lg bg-[#161b22] border border-[#da3633]/30 p-3 text-center">
                      <div className="text-lg font-bold text-[#da3633]">3</div>
                      <div className="text-[10px] text-[#8b949e]">Gaps found</div>
                    </div>
                    <div className="flex-1 rounded-lg bg-[#161b22] border border-[#30363d] p-3 text-center">
                      <div className="text-lg font-bold text-[#58a6ff]">47</div>
                      <div className="text-[10px] text-[#8b949e]">Total risk factors</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Detected Risks */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#f0f6fc]">Detected Risks</h2>
                    <p className="text-xs text-[#8b949e] mt-0.5">3 risks with disclosure gaps</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {DETECTED_RISKS.map((risk, i) => (
                    <div
                      key={risk.name}
                      className={cn(
                        "rounded-xl border bg-[#0d1117] overflow-hidden",
                        risk.severity === "critical" && "border-[#da3633]/40",
                        risk.severity === "high" && "border-[#d29922]/40"
                      )}
                    >
                      <div
                        className={cn(
                          "px-4 py-3 cursor-pointer hover:bg-[#21262d]/50",
                          risk.severity === "critical" && "bg-gradient-to-r from-[#da3633]/10 to-transparent",
                          risk.severity === "high" && "bg-gradient-to-r from-[#d29922]/10 to-transparent"
                        )}
                        onClick={() => setExpandedRisk(expandedRisk === i ? null : i)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-lg",
                              risk.severity === "critical" && "bg-[#da3633]/20 text-[#da3633]",
                              risk.severity === "high" && "bg-[#d29922]/20 text-[#d29922]"
                            )}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <path d="M12 9v4M12 17h.01" />
                              </svg>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-[#f0f6fc]">{risk.name}</span>
                                <span className={cn(
                                  "rounded-full border px-1.5 py-0 text-[9px] font-medium uppercase",
                                  risk.severity === "critical" && "border-[#da3633]/50 bg-[#da3633]/20 text-[#da3633]",
                                  risk.severity === "high" && "border-[#d29922]/50 bg-[#d29922]/20 text-[#d29922]"
                                )}>
                                  {risk.severity}
                                </span>
                              </div>
                              <div className="text-[10px] text-[#6e7681] mt-0.5">
                                {risk.source} · {risk.confidence}% confidence
                              </div>
                            </div>
                          </div>
                          <svg
                            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            className={cn("text-[#484f58] transition-transform", expandedRisk === i && "rotate-180")}
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </div>

                      {expandedRisk === i && (
                        <div className="border-t border-[#30363d]">
                          <div className="px-4 py-3 bg-[#161b22]">
                            <div className="text-[10px] font-medium uppercase tracking-wider text-[#484f58] mb-2">AI Reasoning</div>
                            <p className="text-xs text-[#8b949e] leading-relaxed">{risk.reasoning}</p>
                          </div>
                          <div className="px-4 py-3 border-t border-[#21262d]">
                            <div className="text-[10px] font-medium uppercase tracking-wider text-[#484f58] mb-2">Detection Sources</div>
                            <div className="space-y-1">
                              {risk.sources.map((src) => (
                                <div key={src} className="flex items-start gap-2 text-xs text-[#8b949e]">
                                  <span className="text-[#3fb950] mt-0.5">•</span>
                                  <span>{src}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="px-4 py-3 border-t border-[#21262d] bg-[#da3633]/5">
                            <div className="text-[10px] font-medium uppercase tracking-wider text-[#da3633] mb-2 flex items-center gap-1">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8v4M12 16h.01" />
                              </svg>
                              Disclosure Gap
                            </div>
                            <p className="text-xs text-[#f0f6fc]">{risk.disclosureGap}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#f0f6fc]">Detection Timeline</h2>
                  <p className="text-xs text-[#8b949e] mt-0.5">How agents identified these risks</p>
                </div>
              </div>
              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] px-4 divide-y divide-[#21262d]">
                {ACTIVITY_LOG.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2">
                    <span className="text-[10px] text-[#484f58] whitespace-nowrap w-16 flex-shrink-0 mt-0.5">{item.time}</span>
                    <div className="flex h-5 w-5 items-center justify-center rounded flex-shrink-0 bg-[#21262d] text-[#8b949e]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                        <line x1="7" y1="12" x2="17" y2="12" />
                      </svg>
                    </div>
                    <span className="text-xs text-[#8b949e]">{item.action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between border-t border-[#30363d] pt-6 mt-8">
              <Link href="/step-1" className="text-sm text-[#8b949e] hover:text-[#f0f6fc]">
                ← Back to Dashboard
              </Link>
              <Link
                href="/now/agentic-hero/superhero/coordinator"
                className="inline-flex items-center gap-2 rounded-lg bg-[#58a6ff] px-4 py-2 text-sm font-medium text-[#0d1117] hover:bg-[#79c0ff]"
              >
                Assign owners for investigation →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
