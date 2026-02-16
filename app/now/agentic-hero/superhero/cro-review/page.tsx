"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { LeftRail } from "../LeftRail";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const DiligentAgentIcon = () => (
  <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
    <path d="M20.1006 15.6877C20.0186 15.8056 19.9338 15.9211 19.8467 16.0364C19.5697 16.4006 19.2675 16.7474 18.9443 17.0706C17.5077 18.5072 15.6393 19.5107 13.5459 19.8596L6.03223 12.345L8.3877 9.98755H8.38965L8.39258 9.98462L20.1006 15.6877Z" fill="#D3222A"/>
    <path d="M20.0259 4.21263C21.1905 5.84672 21.8735 7.84495 21.8735 9.99974C21.8735 12.116 21.2194 14.0737 20.1011 15.6872L8.39209 9.98412L20.0259 4.21263Z" fill="#EE312E"/>
    <path d="M13.5454 19.8581C13.0018 19.9504 12.4428 19.9997 11.8735 19.9997H3.69971L4.89307 13.4802L6.03174 12.3445L13.5454 19.8581Z" fill="#AF292E"/>
    <path d="M13.5435 0.141312C16.0395 0.559546 18.2228 1.90387 19.7261 3.80733C19.8311 3.94057 19.9311 4.07423 20.0259 4.2126L8.39209 9.98409H8.38623L6.04443 7.63936L13.5435 0.141312Z" fill="#D3222A"/>
    <path d="M11.8735 0C12.4429 2.15682e-05 12.9997 0.0482901 13.5435 0.140625L6.04443 7.63965L4.88232 6.47754L3.69971 0H11.8735Z" fill="#AF292E"/>
    <path d="M9.65975 9.99958L4.55273 4.89256V6.5949L7.53183 9.99958L4.55273 12.9787V15.1066L9.65975 9.99958Z" fill="#F8F8FA"/>
  </svg>
);

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

const RISK_NAMES: Record<string, string> = {
  "risk-taiwan": "Taiwan Strait Geopolitical Tensions",
  "risk-vendor": "Critical Vendor Cybersecurity Breach",
  "risk-dma": "EU Digital Markets Act Enforcement",
};

const OWNER_DATA: Record<string, { name: string; title: string; avatarUrl: string }> = {
  "diana-reyes": { name: "Diana Reyes", title: "VP Supply Chain", avatarUrl: "https://randomuser.me/api/portraits/med/women/44.jpg" },
  "marcus-webb": { name: "Marcus Webb", title: "CISO", avatarUrl: "https://i.pravatar.cc/150?u=marcus-webb" },
  "james-park": { name: "James Park", title: "Chief Compliance Officer", avatarUrl: "https://i.pravatar.cc/150?u=james-park" },
};

const SEVERITY_LABELS: Record<string, string> = {
  agree: "Agreed with CRITICAL",
  upgrade: "Suggested higher severity",
  downgrade: "Suggested lower severity",
};

const LIKELIHOOD_OPTIONS = ["", "Low", "Medium", "High", "Critical"];
const IMPACT_OPTIONS = ["", "Low", "Medium", "High", "Critical"];

type CroReviewData = {
  riskId: string;
  ownerId: string;
  ownerName: string;
  riskName: string;
  userContext: string;
  severityChoice: string | null;
  disclosureConfirmed: boolean;
};

function CroReviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const riskId = searchParams?.get("risk") || "risk-taiwan";
  const ownerId = searchParams?.get("owner") || "diana-reyes";

  const [reviewData, setReviewData] = useState<CroReviewData | null>(null);
  const [likelihood, setLikelihood] = useState("");
  const [impact, setImpact] = useState("");
  const [controls, setControls] = useState("");
  const [mitigations, setMitigations] = useState("");
  const [additionalAssessment, setAdditionalAssessment] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("croReview");
        if (stored) {
          setReviewData(JSON.parse(stored));
        } else {
          setReviewData({
            riskId,
            ownerId,
            ownerName: OWNER_DATA[ownerId]?.name || "Risk Owner",
            riskName: RISK_NAMES[riskId] || "Risk",
            userContext: "[No context provided in this session]",
            severityChoice: "agree",
            disclosureConfirmed: true,
          });
        }
      } catch {
        setReviewData({
          riskId,
          ownerId,
          ownerName: OWNER_DATA[ownerId]?.name || "Risk Owner",
          riskName: RISK_NAMES[riskId] || "Risk",
          userContext: "[No context provided in this session]",
          severityChoice: "agree",
          disclosureConfirmed: true,
        });
      }
    }
  }, [riskId, ownerId]);

  const owner = OWNER_DATA[ownerId] || OWNER_DATA["diana-reyes"];
  const riskName = reviewData?.riskName || RISK_NAMES[riskId] || "Risk";

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
            Viewing as: Chief Risk Officer
          </span>
        </div>
      </div>

      {/* Main layout: Left rail + content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        <LeftRail actorLabel="Chief Risk Officer" activeWorkflowStep="CRO Review" activeRiskId={riskId} />

        <div className="flex-1 overflow-y-auto min-w-0">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <h1 className="text-xl font-semibold text-[#f0f6fc] mb-2">Risk Owner Investigation Review</h1>
          <p className="text-sm text-[#8b949e] mb-6">
            Review what {reviewData?.ownerName || owner.name} provided for this risk investigation.
          </p>

          <div className="space-y-6">
            {/* Risk summary */}
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5">
              <h2 className="text-sm font-medium text-[#6e7681] uppercase tracking-wider mb-2">Risk</h2>
              <p className="text-base font-semibold text-[#f0f6fc]">{riskName}</p>
            </div>

            {/* Owner info */}
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5">
              <h2 className="text-sm font-medium text-[#6e7681] uppercase tracking-wider mb-3">Investigated by</h2>
              <div className="flex items-center gap-4">
                <img
                  src={owner.avatarUrl}
                  alt={owner.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-base font-semibold text-[#f0f6fc]">{owner.name}</p>
                  <p className="text-sm text-[#8b949e]">{owner.title}</p>
                </div>
              </div>
            </div>

            {/* Domain context */}
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5">
              <h2 className="text-sm font-medium text-[#6e7681] uppercase tracking-wider mb-2">Additional context from Risk Owner</h2>
              <p className="text-sm text-[#f0f6fc] whitespace-pre-wrap">
                {reviewData?.userContext || "No additional context was provided."}
              </p>
            </div>

            {/* Severity validation */}
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5">
              <h2 className="text-sm font-medium text-[#6e7681] uppercase tracking-wider mb-2">Severity assessment</h2>
              <p className="text-sm text-[#f0f6fc]">
                {reviewData?.severityChoice ? SEVERITY_LABELS[reviewData.severityChoice] || reviewData.severityChoice : "Agreed with CRITICAL"}
              </p>
            </div>

            {/* Disclosure recommendation */}
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5">
              <h2 className="text-sm font-medium text-[#6e7681] uppercase tracking-wider mb-2">Disclosure recommendation</h2>
              <p className="text-sm text-[#f0f6fc]">
                {reviewData?.disclosureConfirmed ? "Confirmed" : "Requested changes"}
              </p>
            </div>

            {/* CRO Assessment - structured fields */}
            <div className="rounded-xl border border-[#58a6ff]/30 bg-[#58a6ff]/5 p-5">
              <h2 className="text-sm font-medium text-[#58a6ff] uppercase tracking-wider mb-4">Your risk assessment</h2>
              <p className="text-xs text-[#8b949e] mb-4">
                Assess likelihood, impact, controls, and mitigations. This will inform the 10-K disclosure draft.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-[#8b949e] mb-1.5">Likelihood of occurrence</label>
                  <select
                    value={likelihood}
                    onChange={(e) => setLikelihood(e.target.value)}
                    className="w-full rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2 text-sm text-[#f0f6fc] focus:border-[#58a6ff] focus:outline-none"
                  >
                    {LIKELIHOOD_OPTIONS.map((opt) => (
                      <option key={opt || "empty"} value={opt}>{opt || "Select..."}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#8b949e] mb-1.5">Impact if it occurs</label>
                  <select
                    value={impact}
                    onChange={(e) => setImpact(e.target.value)}
                    className="w-full rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2 text-sm text-[#f0f6fc] focus:border-[#58a6ff] focus:outline-none"
                  >
                    {IMPACT_OPTIONS.map((opt) => (
                      <option key={opt || "empty"} value={opt}>{opt || "Select..."}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#8b949e] mb-1.5">Controls in place</label>
                  <textarea
                    value={controls}
                    onChange={(e) => setControls(e.target.value)}
                    placeholder="e.g., Supplier diversification program, dual-sourcing for critical components..."
                    rows={2}
                    className="w-full rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2 text-sm text-[#f0f6fc] placeholder-[#484f58] focus:border-[#58a6ff] focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#8b949e] mb-1.5">Mitigations planned or underway</label>
                  <textarea
                    value={mitigations}
                    onChange={(e) => setMitigations(e.target.value)}
                    placeholder="e.g., Samsung qualification in progress, 18-month timeline to shift 30%..."
                    rows={2}
                    className="w-full rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2 text-sm text-[#f0f6fc] placeholder-[#484f58] focus:border-[#58a6ff] focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Free-form CRO assessment prompt */}
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5">
              <h2 className="text-sm font-medium text-[#6e7681] uppercase tracking-wider mb-2">Additional CRO assessment</h2>
              <p className="text-xs text-[#8b949e] mb-3">
                Add any context that should inform the 10-K draft — key considerations, board-level messaging, or disclosure nuances.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[10px] text-[#6e7681]">Try:</span>
                {["Summarize risk for disclosure", "Highlight key controls", "Note disclosure sensitivities"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setAdditionalAssessment((prev) => prev ? `${prev}\n\n${s}` : s)}
                    className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs text-[#8b949e] hover:border-[#58a6ff]/50 hover:text-[#f0f6fc] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-3">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white flex-shrink-0 p-1.5">
                    <DiligentAgentIcon />
                  </div>
                  <textarea
                    ref={inputRef}
                    value={additionalAssessment}
                    onChange={(e) => setAdditionalAssessment(e.target.value)}
                    placeholder="Add additional context for the 10-K draft..."
                    rows={3}
                    className="flex-1 bg-transparent text-sm text-[#f0f6fc] placeholder-[#484f58] focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Next steps */}
            <div className="rounded-xl border border-[#58a6ff]/30 bg-[#58a6ff]/5 p-5">
              <h2 className="text-sm font-medium text-[#58a6ff] uppercase tracking-wider mb-2">Next steps</h2>
              <p className="text-sm text-[#8b949e] mb-4">
                Your assessment will be passed to the writer to inform the 10-K disclosure draft.
              </p>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    const croAssessment = {
                      ...(reviewData || {}),
                      likelihood,
                      impact,
                      controls,
                      mitigations,
                      additionalAssessment,
                    };
                    sessionStorage.setItem("croAssessment", JSON.stringify(croAssessment));
                  }
                  router.push(`/now/agentic-hero/superhero/writer?risk=${riskId}&owner=${ownerId}`);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#58a6ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#79c0ff] transition-colors"
              >
                Continue to 10-K drafting →
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default function CroReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d1117] flex items-center justify-center"><div className="h-8 w-8 border-2 border-[#58a6ff] border-t-transparent rounded-full animate-spin" /></div>}>
      <CroReviewContent />
    </Suspense>
  );
}
