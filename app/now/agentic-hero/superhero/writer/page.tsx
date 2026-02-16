"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LeftRail } from "../LeftRail";

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

const PRIOR_YEAR_RISKS = [
  { title: "Cybersecurity and Data Privacy Risks", body: "We face risks related to cybersecurity threats and data privacy obligations across multiple jurisdictions. A breach of our information systems could result in the loss of confidential information, disruption to our business operations, and significant reputational harm. We invest in security infrastructure and employee training programs; however, no assurance can be given that our measures will prevent all cyber incidents." },
  { title: "Market and Competition Risks", body: "Our business operates in highly competitive markets that are subject to rapid technological change and evolving customer demands. We compete with both established companies and emerging market entrants, and our failure to anticipate market trends or respond to competitive pressures could materially impact our revenue and market share." },
  { title: "Regulatory and Compliance Risks", body: "We are subject to a wide range of laws and regulations in the jurisdictions in which we operate. Changes in these laws, or our failure to comply with existing requirements, could result in fines, penalties, litigation, or restrictions on our business activities. Regulatory developments may also increase our compliance costs and operational complexity." },
  { title: "Operational and Supply Chain Risks", body: "Our operations depend on the continuous and uninterrupted performance of our supply chain and key operational processes. Disruptions caused by natural disasters, geopolitical events, or failures of key vendors could adversely affect our ability to deliver products and services to our customers." },
  { title: "Financial and Economic Risks", body: "We are exposed to macroeconomic conditions including interest rate fluctuations, inflation, and foreign exchange volatility. Adverse economic conditions could reduce demand for our products and services, increase our borrowing costs, and negatively impact our financial results." },
];

const DEFAULT_NEW_RISK_TITLE = "Semiconductor Supply Chain and Geopolitical Risks";
const DEFAULT_NEW_RISK_BODY = `We face risks related to semiconductor supply chain concentration and geopolitical exposure. Approximately 47% of our chip suppliers have Taiwan-based operations. Escalating tensions in the Taiwan Strait may disrupt our semiconductor supply chain, extend lead times, and materially impact our ability to source critical components. We are evaluating supplier diversification strategies; however, qualification of alternative suppliers typically requires 12-18 months.`;

type CroAssessment = {
  riskName?: string;
  ownerName?: string;
  userContext?: string;
  likelihood?: string;
  impact?: string;
  controls?: string;
  mitigations?: string;
  additionalAssessment?: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

const RISK_LABELS: Record<string, string> = {
  "risk-taiwan": "Taiwan Strait",
  "risk-vendor": "Vendor Breach",
  "risk-dma": "EU DMA",
};

const PROMPT_SUGGESTIONS = [
  "Strengthen Taiwan risk language",
  "Add supplier diversification timeline",
  "Add controls and mitigations disclosure",
  "Tone down severity",
  "Align with CRO assessment",
];

function WriterContent() {
  const searchParams = useSearchParams();
  const riskId = searchParams?.get("risk") || "risk-taiwan";
  const ownerId = searchParams?.get("owner") || "diana-reyes";
  const layout = searchParams?.get("layout") || "primary"; // "primary" = prompt full width, "sidebar" = prompt in third column

  const [croAssessment, setCroAssessment] = useState<CroAssessment | null>(null);
  const [draftTitle, setDraftTitle] = useState(DEFAULT_NEW_RISK_TITLE);
  const [draftBody, setDraftBody] = useState(DEFAULT_NEW_RISK_BODY);
  const [promptInput, setPromptInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("croAssessment");
        if (stored) setCroAssessment(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleSendPrompt = () => {
    const trimmed = promptInput.trim();
    if (!trimmed || isLoading) return;

    const ts = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content: trimmed, timestamp: ts },
    ]);
    setPromptInput("");
    setIsLoading(true);

    // Simulated AI response and draft update
    const lower = trimmed.toLowerCase();
    let suggestedEdit = "";
    let newBody = draftBody;

    if (lower.includes("strengthen") || lower.includes("taiwan")) {
      suggestedEdit = "I've strengthened the Taiwan-specific language and added the 47% supplier concentration figure more prominently.";
      newBody = "We face significant risks related to semiconductor supply chain concentration and geopolitical exposure in the Taiwan Strait region. Approximately 47% of our chip suppliers have Taiwan-based operations, creating material concentration risk. Escalating tensions may disrupt our semiconductor supply chain, extend lead times, and materially impact our ability to source critical components. We are evaluating supplier diversification strategies; however, qualification of alternative suppliers typically requires 12-18 months.";
    } else if (lower.includes("diversification") || lower.includes("timeline")) {
      suggestedEdit = "I've added language about the supplier diversification timeline and qualification progress.";
      newBody = "We face risks related to semiconductor supply chain concentration and geopolitical exposure. Approximately 47% of our chip suppliers have Taiwan-based operations. Escalating tensions in the Taiwan Strait may disrupt our semiconductor supply chain, extend lead times, and materially impact our ability to source critical components. We have initiated a supplier diversification program; qualification of alternative suppliers (including Samsung) is in progress, with a typical timeline of 12-18 months to complete.";
    } else if (lower.includes("controls") || lower.includes("mitigation")) {
      suggestedEdit = "I've incorporated the CRO's controls and mitigations into the draft.";
      newBody = "We face risks related to semiconductor supply chain concentration and geopolitical exposure. Approximately 47% of our chip suppliers have Taiwan-based operations. Escalating tensions in the Taiwan Strait may disrupt our semiconductor supply chain, extend lead times, and materially impact our ability to source critical components. We maintain dual-sourcing arrangements for certain critical components and are evaluating supplier diversification strategies; however, qualification of alternative suppliers typically requires 12-18 months.";
    } else if (lower.includes("tone down") || lower.includes("severity")) {
      suggestedEdit = "I've softened the severity language and added appropriate qualifiers.";
      newBody = "We face risks related to semiconductor supply chain concentration and geopolitical exposure. Approximately 47% of our chip suppliers have Taiwan-based operations. In the event of escalating tensions in the Taiwan Strait, our semiconductor supply chain could be disrupted, potentially extending lead times and adversely affecting our ability to source certain critical components. We are evaluating supplier diversification strategies; however, qualification of alternative suppliers typically requires 12-18 months.";
    } else if (lower.includes("align") || lower.includes("cro")) {
      suggestedEdit = "I've aligned the draft with the CRO assessment. Review the updated language.";
      newBody = croAssessment?.controls
        ? `We face risks related to semiconductor supply chain concentration and geopolitical exposure. Approximately 47% of our chip suppliers have Taiwan-based operations. Escalating tensions in the Taiwan Strait may disrupt our semiconductor supply chain, extend lead times, and materially impact our ability to source critical components. ${croAssessment.controls} We are evaluating supplier diversification strategies; however, qualification of alternative suppliers typically requires 12-18 months.`
        : draftBody;
    } else {
      suggestedEdit = "I've reviewed your request and updated the draft. Please review the changes in the editable panel.";
    }

    setTimeout(() => {
      setDraftBody(newBody);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: suggestedEdit,
          timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        },
      ]);
      setIsLoading(false);
      scrollToBottom();
    }, 600);
  };

  const handleSuggestionClick = (s: string) => {
    setPromptInput(s);
    inputRef.current?.focus();
  };

  return (
    <div className="h-screen bg-[#0d1117] flex flex-col overflow-hidden">
      {/* Meta-Prototype-Info blue banner */}
      <div className="border-b-2 border-[#0ea5e9]/40 bg-[#e0f2fe] flex-shrink-0">
        <div className="border-b border-[#0ea5e9]/30 bg-[#bae6fd] px-4 py-2">
          <p className="text-[10px] font-medium uppercase tracking-widest text-[#0369a1]">Demo controls — not part of prototype</p>
        </div>
        <div className="px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-[#0369a1]">Prototype</span>
            <span className="text-sm font-semibold text-[#0c4a6e]">Risk Detection → 10K Update → Board Notification</span>
            <Link
              href={`/now/agentic-hero/superhero/writer?risk=${riskId}&owner=${ownerId}&layout=${layout === "sidebar" ? "primary" : "sidebar"}`}
              className="text-xs font-medium text-[#0369a1] hover:underline"
            >
              {layout === "sidebar" ? "View primary layout (prompt full width)" : "View alternative (prompt in sidebar)"}
            </Link>
          </div>
          <span className="rounded-full border-2 border-[#0c4a6e] bg-[#7dd3fc]/30 px-3 py-1 text-xs font-semibold text-[#0c4a6e]">
            Viewing as: General Counsel
          </span>
        </div>
      </div>

      {/* Main layout: Left rail + content */}
      <div className="flex-1 flex overflow-hidden min-h-0 min-w-0">
        <LeftRail actorLabel="General Counsel" activeRiskId={riskId} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Breadcrumb / context bar */}
          <div className="border-b border-[#30363d] bg-[#161b22] px-6 py-2.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-xs text-[#8b949e]">
              <Link href="/now/agentic-hero/superhero/coordinator" className="hover:text-[#f0f6fc]">Assign Owners</Link>
              <span>›</span>
              <Link href="/now/agentic-hero/superhero/cro-review" className="hover:text-[#f0f6fc]">CRO Review</Link>
              <span>›</span>
              <span className="text-[#f0f6fc] font-medium">10-K Draft</span>
            </div>
            <span className="rounded-full border border-[#58a6ff]/40 bg-[#58a6ff]/10 px-2 py-0.5 text-[10px] font-medium text-[#58a6ff]">
              {RISK_LABELS[riskId] || "Taiwan Strait"}
            </span>
          </div>

          {/* Split view content */}
          <div className="flex-1 flex overflow-hidden min-h-0">
            {layout === "primary" ? (
              /* Primary layout: full-width main area, prompt at bottom */
              <>
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  {/* Scrollable: Prior year + draft + context */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                      <div>
                        <h2 className="text-xs font-medium text-[#6e7681] uppercase tracking-wider mb-3">Prior year — Item 1A Risk Factors</h2>
                        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 max-h-48 overflow-y-auto">
                          <div className="space-y-3 text-xs leading-relaxed">
                            {PRIOR_YEAR_RISKS.slice(0, 3).map((r, i) => (
                              <div key={i}>
                                <div className="font-semibold text-[#f0f6fc] text-sm">{i + 1}. {r.title}</div>
                                <p className="text-[#8b949e] mt-0.5">{r.body.slice(0, 120)}...</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xs font-medium text-[#6e7681] uppercase tracking-wider mb-3 flex items-center gap-2">
                          Draft — New risk factor
                          <span className="rounded-full bg-[#3fb950]/10 border border-[#3fb950]/30 px-1.5 py-0 text-[9px] text-[#3fb950] font-medium">EDITABLE</span>
                        </h2>
                        <div className="rounded-xl border border-[#58a6ff]/30 bg-[#58a6ff]/5 p-4">
                          <input
                            value={draftTitle}
                            onChange={(e) => setDraftTitle(e.target.value)}
                            className="w-full bg-transparent text-sm font-semibold text-[#f0f6fc] mb-3 focus:outline-none placeholder-[#484f58]"
                            placeholder="Risk factor title..."
                          />
                          <textarea
                            value={draftBody}
                            onChange={(e) => setDraftBody(e.target.value)}
                            rows={8}
                            className="w-full rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2 text-sm text-[#f0f6fc] placeholder-[#484f58] focus:border-[#58a6ff] focus:outline-none resize-none"
                            placeholder="Draft disclosure text..."
                          />
                        </div>
                      </div>

                      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
                        <h3 className="text-xs font-medium text-[#6e7681] uppercase tracking-wider mb-2">Context from workflow</h3>
                        <div className="text-xs text-[#8b949e] space-y-1">
                          <p><span className="text-[#f0f6fc]">Risk:</span> {croAssessment?.riskName || "Taiwan Strait Geopolitical Tensions"}</p>
                          <p><span className="text-[#f0f6fc]">Owner:</span> {croAssessment?.ownerName || "Diana Reyes"}</p>
                          {croAssessment?.likelihood && <p><span className="text-[#f0f6fc]">CRO likelihood:</span> {croAssessment.likelihood}</p>}
                          {croAssessment?.impact && <p><span className="text-[#f0f6fc]">CRO impact:</span> {croAssessment.impact}</p>}
                          {croAssessment?.controls && <p className="mt-1"><span className="text-[#f0f6fc]">Controls:</span> {croAssessment.controls.slice(0, 80)}...</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat + prompt full width at bottom */}
                  <div className="flex-shrink-0 border-t border-[#30363d] bg-[#161b22] p-4">
                    {messages.length > 0 && (
                      <div className="space-y-3 mb-3 max-h-32 overflow-y-auto">
                        {messages.map((m) => (
                          <div
                            key={m.id}
                            className={cn(
                              "rounded-lg px-3 py-2 text-xs",
                              m.role === "user"
                                ? "ml-4 bg-[#58a6ff]/10 border border-[#58a6ff]/20 text-[#f0f6fc]"
                                : "mr-4 bg-[#21262d] border border-[#30363d] text-[#c9d1d9]"
                            )}
                          >
                            <p className="font-medium text-[#8b949e] mb-0.5">{m.role === "user" ? "You" : "Diligent AI"}</p>
                            <p className="leading-relaxed">{m.content}</p>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#58a6ff] animate-pulse" />
                            AI is updating the draft...
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-[10px] text-[#6e7681]">Try:</span>
                      {PROMPT_SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSuggestionClick(s)}
                          className="rounded-full border border-[#30363d] bg-[#21262d] px-2.5 py-1 text-[10px] text-[#8b949e] hover:border-[#58a6ff]/50 hover:text-[#f0f6fc] transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-2">
                      <div className="flex gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white flex-shrink-0 p-1">
                          <DiligentAgentIcon />
                        </div>
                        <textarea
                          ref={inputRef}
                          value={promptInput}
                          onChange={(e) => setPromptInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendPrompt())}
                          placeholder="Ask AI to add or change disclosure language..."
                          rows={2}
                          className="flex-1 bg-transparent text-sm text-[#f0f6fc] placeholder-[#484f58] focus:outline-none resize-none"
                          disabled={isLoading}
                        />
                      </div>
                      <button
                        onClick={handleSendPrompt}
                        disabled={!promptInput.trim() || isLoading}
                        className={cn(
                          "mt-2 w-full rounded-lg py-2 text-xs font-medium transition-colors",
                          promptInput.trim() && !isLoading
                            ? "bg-[#58a6ff] text-white hover:bg-[#79c0ff]"
                            : "bg-[#21262d] text-[#484f58] cursor-not-allowed"
                        )}
                      >
                        Apply changes
                      </button>
                    </div>
                    <Link
                      href="/now/agentic-hero/superhero/finisher"
                      className="mt-3 block w-full rounded-lg bg-[#3fb950] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#46c35a] transition-colors"
                    >
                      Continue to finalize →
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              /* Alternative layout: prompt in third column */
              <>
                <div className="flex-1 overflow-y-auto border-r border-[#30363d]">
                  <div className="p-6 space-y-6">
                    <div>
                      <h2 className="text-xs font-medium text-[#6e7681] uppercase tracking-wider mb-3">Prior year — Item 1A Risk Factors</h2>
                      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 max-h-48 overflow-y-auto">
                        <div className="space-y-3 text-xs leading-relaxed">
                          {PRIOR_YEAR_RISKS.slice(0, 3).map((r, i) => (
                            <div key={i}>
                              <div className="font-semibold text-[#f0f6fc] text-sm">{i + 1}. {r.title}</div>
                              <p className="text-[#8b949e] mt-0.5">{r.body.slice(0, 120)}...</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xs font-medium text-[#6e7681] uppercase tracking-wider mb-3 flex items-center gap-2">
                        Draft — New risk factor
                        <span className="rounded-full bg-[#3fb950]/10 border border-[#3fb950]/30 px-1.5 py-0 text-[9px] text-[#3fb950] font-medium">EDITABLE</span>
                      </h2>
                      <div className="rounded-xl border border-[#58a6ff]/30 bg-[#58a6ff]/5 p-4">
                        <input
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                          className="w-full bg-transparent text-sm font-semibold text-[#f0f6fc] mb-3 focus:outline-none placeholder-[#484f58]"
                          placeholder="Risk factor title..."
                        />
                        <textarea
                          value={draftBody}
                          onChange={(e) => setDraftBody(e.target.value)}
                          rows={8}
                          className="w-full rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2 text-sm text-[#f0f6fc] placeholder-[#484f58] focus:border-[#58a6ff] focus:outline-none resize-none"
                          placeholder="Draft disclosure text..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-[380px] flex-shrink-0 flex flex-col border-l border-[#30363d] bg-[#161b22]">
                  <div className="p-4 border-b border-[#30363d]">
                    <h3 className="text-xs font-medium text-[#6e7681] uppercase tracking-wider mb-2">Context from workflow</h3>
                    <div className="text-xs text-[#8b949e] space-y-1">
                      <p><span className="text-[#f0f6fc]">Risk:</span> {croAssessment?.riskName || "Taiwan Strait Geopolitical Tensions"}</p>
                      <p><span className="text-[#f0f6fc]">Owner:</span> {croAssessment?.ownerName || "Diana Reyes"}</p>
                      {croAssessment?.likelihood && <p><span className="text-[#f0f6fc]">CRO likelihood:</span> {croAssessment.likelihood}</p>}
                      {croAssessment?.impact && <p><span className="text-[#f0f6fc]">CRO impact:</span> {croAssessment.impact}</p>}
                      {croAssessment?.controls && <p className="mt-1"><span className="text-[#f0f6fc]">Controls:</span> {croAssessment.controls.slice(0, 80)}...</p>}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-xs font-medium text-[#6e7681] uppercase tracking-wider mb-2">Work with AI</h3>
                    <p className="text-xs text-[#8b949e] mb-3">
                      Edit the draft directly or prompt AI to suggest changes.
                    </p>

                    {messages.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {messages.map((m) => (
                          <div
                            key={m.id}
                            className={cn(
                              "rounded-lg px-3 py-2 text-xs",
                              m.role === "user"
                                ? "ml-4 bg-[#58a6ff]/10 border border-[#58a6ff]/20 text-[#f0f6fc]"
                                : "mr-4 bg-[#21262d] border border-[#30363d] text-[#c9d1d9]"
                            )}
                          >
                            <p className="font-medium text-[#8b949e] mb-0.5">{m.role === "user" ? "You" : "Diligent AI"}</p>
                            <p className="leading-relaxed">{m.content}</p>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#58a6ff] animate-pulse" />
                            AI is updating the draft...
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-[10px] text-[#6e7681]">Try:</span>
                      {PROMPT_SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSuggestionClick(s)}
                          className="rounded-full border border-[#30363d] bg-[#21262d] px-2.5 py-1 text-[10px] text-[#8b949e] hover:border-[#58a6ff]/50 hover:text-[#f0f6fc] transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-2">
                      <div className="flex gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white flex-shrink-0 p-1">
                          <DiligentAgentIcon />
                        </div>
                        <textarea
                          ref={inputRef}
                          value={promptInput}
                          onChange={(e) => setPromptInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendPrompt())}
                          placeholder="Ask AI to add or change disclosure language..."
                          rows={2}
                          className="flex-1 bg-transparent text-sm text-[#f0f6fc] placeholder-[#484f58] focus:outline-none resize-none"
                          disabled={isLoading}
                        />
                      </div>
                      <button
                        onClick={handleSendPrompt}
                        disabled={!promptInput.trim() || isLoading}
                        className={cn(
                          "mt-2 w-full rounded-lg py-2 text-xs font-medium transition-colors",
                          promptInput.trim() && !isLoading
                            ? "bg-[#58a6ff] text-white hover:bg-[#79c0ff]"
                            : "bg-[#21262d] text-[#484f58] cursor-not-allowed"
                        )}
                      >
                        Apply changes
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border-t border-[#30363d]">
                    <Link
                      href="/now/agentic-hero/superhero/finisher"
                      className="block w-full rounded-lg bg-[#3fb950] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#46c35a] transition-colors"
                    >
                      Continue to finalize →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WriterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d1117] flex items-center justify-center"><div className="h-8 w-8 border-2 border-[#58a6ff] border-t-transparent rounded-full animate-spin" /></div>}>
      <WriterContent />
    </Suspense>
  );
}
