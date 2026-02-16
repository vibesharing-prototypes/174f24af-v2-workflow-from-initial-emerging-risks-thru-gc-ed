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

const RISKS = [
  { id: "risk-taiwan", label: "Taiwan Strait", href: "/now/agentic-hero/superhero/writer?risk=risk-taiwan&owner=diana-reyes" },
  { id: "risk-vendor", label: "Vendor Breach", href: "/now/agentic-hero/superhero/writer?risk=risk-vendor&owner=marcus-webb" },
  { id: "risk-dma", label: "EU DMA", href: "/now/agentic-hero/superhero/writer?risk=risk-dma&owner=james-park" },
];

const WORKFLOW_STEPS = [
  { label: "Assign Owners", href: "/now/agentic-hero/superhero/coordinator" },
  { label: "CRO Review", href: "/now/agentic-hero/superhero/cro-review" },
  { label: "10-K Draft", href: "/now/agentic-hero/superhero/writer" },
  { label: "Finalize", href: "/now/agentic-hero/superhero/finisher" },
];

const NAV_LINKS = [
  { label: "Home", href: "/step-1", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Detection Sources", href: "/now/agentic-hero/superhero/reviewer", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Feedback", href: "#", icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
];

type LeftRailProps = {
  actorLabel?: string;
  actorEmail?: string;
  activeRiskId?: string;
  activeWorkflowStep?: string;
};

export function LeftRail({ actorLabel = "General Counsel", actorEmail, activeRiskId, activeWorkflowStep = "10-K Draft" }: LeftRailProps) {
  const [risksOpen, setRisksOpen] = useState(true);
  const [workflowOpen, setWorkflowOpen] = useState(true);

  return (
    <aside className="w-[240px] flex-shrink-0 flex flex-col bg-[#21262d] border-r border-[#30363d]">
      {/* Top: Logo */}
      <div className="p-4 border-b border-[#30363d]">
        <Link href="/step-1" className="flex items-center gap-2">
          <DiligentLogo className="h-6 w-auto" />
          <span className="text-xs font-semibold text-[#f0f6fc]">GRC Command Center</span>
        </Link>
      </div>

      {/* Risks - collapsible */}
      <div className="flex-1 overflow-y-auto py-3">
        <button
          onClick={() => setRisksOpen(!risksOpen)}
          className="w-full flex items-center justify-between px-4 py-1.5 text-left text-xs font-medium text-[#8b949e] hover:text-[#f0f6fc]"
        >
          Risks
          <svg className={cn("w-3.5 h-3.5 transition-transform", risksOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {risksOpen && (
          <div className="mt-1 px-4 space-y-0.5">
            {RISKS.map((r) => (
              <Link
                key={r.id}
                href={r.href}
                className={cn(
                  "block py-1.5 pl-3 text-xs border-l-2",
                  activeRiskId === r.id
                    ? "text-[#f0f6fc] font-medium border-[#58a6ff]"
                    : "text-[#c9d1d9] border-transparent hover:text-[#f0f6fc] hover:border-[#58a6ff]"
                )}
              >
                • {r.label}
              </Link>
            ))}
            <span className="block py-1.5 pl-3 text-xs text-[#58a6ff] hover:underline cursor-pointer">
              + Add New Risk
            </span>
          </div>
        )}

        {/* Workflow - collapsible */}
        <button
          onClick={() => setWorkflowOpen(!workflowOpen)}
          className="w-full mt-4 flex items-center justify-between px-4 py-1.5 text-left text-xs font-medium text-[#8b949e] hover:text-[#f0f6fc]"
        >
          Workflow
          <svg className={cn("w-3.5 h-3.5 transition-transform", workflowOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {workflowOpen && (
          <div className="mt-1 px-4 space-y-0.5">
            {WORKFLOW_STEPS.map((step) => {
              const isActive = step.label === activeWorkflowStep;
              return (
                <Link
                  key={step.label}
                  href={step.href}
                  className={cn(
                    "block py-1.5 pl-3 text-xs border-l-2",
                    isActive
                      ? "text-[#f0f6fc] border-[#58a6ff] font-medium"
                      : "text-[#c9d1d9] border-transparent hover:text-[#f0f6fc] hover:border-[#58a6ff]/50"
                  )}
                >
                  {isActive && "→ "}
                  {step.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Main nav links */}
        <div className="mt-6 px-4 space-y-1 border-t border-[#30363d] pt-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-2 py-2 text-xs text-[#8b949e] hover:text-[#f0f6fc]"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom: User */}
      <div className="p-4 border-t border-[#30363d]">
        <p className="text-[10px] font-medium text-[#8b949e]">{actorLabel}</p>
        {actorEmail && <p className="text-[10px] text-[#6e7681] mt-0.5 truncate">{actorEmail}</p>}
        <div className="flex items-center gap-2 mt-2">
          <button className="p-1.5 rounded text-[#6e7681] hover:bg-[#30363d] hover:text-[#f0f6fc]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
          <button className="p-1.5 rounded text-[#6e7681] hover:bg-[#30363d] hover:text-[#f0f6fc]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
