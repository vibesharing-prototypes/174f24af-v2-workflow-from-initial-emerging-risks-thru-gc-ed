"use client";

import React from "react";
import Link from "next/link";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type AgentStatus = "complete" | "active" | "pending" | "needs-review";

export type PipelineStage = {
  id: string;
  name: string;
  agent: string;
  status: AgentStatus;
  href: string;
};

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: "reviewer", name: "The Reviewer", agent: "Risk Extraction", status: "complete", href: "/now/agentic-hero/superhero/reviewer" },
  { id: "coordinator", name: "The Coordinator", agent: "Validation Workflow", status: "complete", href: "/now/agentic-hero/superhero/coordinator" },
  { id: "investigator", name: "Investigator", agent: "Owner Investigation", status: "complete", href: "/now/agentic-hero/superhero/investigator" },
  { id: "writer", name: "The Writer", agent: "10K Disclosure Draft", status: "active", href: "/now/agentic-hero/superhero/writer" },
  { id: "finisher", name: "The Finisher", agent: "Filing Prep", status: "pending", href: "/now/agentic-hero/superhero/finisher" },
];

export const Icons = {
  shield: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  scan: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="7" y1="12" x2="17" y2="12" /></svg>,
  route: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><path d="M6 9v3a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3" /></svg>,
  presentation: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
  pen: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>,
  clock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  zap: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
  file: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>,
};

export const AGENT_ICONS: Record<string, React.ReactNode> = {
  reviewer: Icons.scan,
  coordinator: Icons.route,
  investigator: Icons.scan,
  producer: Icons.presentation,
  writer: Icons.pen,
  finisher: Icons.check,
};

function StatusDot({ status }: { status: AgentStatus }) {
  return (
    <div className={cn("h-2 w-2 rounded-full flex-shrink-0", status === "complete" && "bg-[#3fb950]", status === "active" && "bg-[#58a6ff] animate-pulse", status === "pending" && "bg-[#484f58]", status === "needs-review" && "bg-[#d29922]")} />
  );
}

export function PipelineBanner() {
  return (
    <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-6 py-2.5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#3fb950]" />
          <span className="text-xs font-semibold text-[#f0f6fc]">Q1 2026 Board Cycle</span>
        </div>
        <div className="h-3 w-px bg-[#30363d]" />
        <span className="text-xs text-[#8b949e]">Enterprise Risk Management Pipeline</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={cn("h-1.5 w-4 rounded-full", i <= 3 ? "bg-[#3fb950]" : i === 4 ? "bg-[#58a6ff]" : "bg-[#30363d]")} />
            ))}
          </div>
          <span className="text-[10px] text-[#8b949e]">4/5 stages</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#3fb950]">
          {Icons.clock}
          <span>6 weeks → 3 days</span>
        </div>
      </div>
    </div>
  );
}

export function AgentNav({ activeAgent }: { activeAgent: string }) {
  return (
    <nav className="flex items-center gap-1 border-b border-[#30363d] bg-[#0d1117] px-6">
      <Link href="/step-1" className={cn("flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors border-b-2", activeAgent === "hub" ? "border-[#58a6ff] text-[#f0f6fc]" : "border-transparent text-[#8b949e] hover:text-[#f0f6fc]")}>
        <span className="flex h-5 w-5 items-center justify-center rounded bg-[#21262d]">{Icons.shield}</span>
        Hub
      </Link>
      {PIPELINE_STAGES.map((stage) => (
        <Link key={stage.id} href={stage.href} className={cn("flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors border-b-2", activeAgent === stage.id ? "border-[#58a6ff] text-[#f0f6fc]" : "border-transparent text-[#8b949e] hover:text-[#f0f6fc]")}>
          <StatusDot status={stage.status} />
          <span className="flex h-5 w-5 items-center justify-center">{AGENT_ICONS[stage.id]}</span>
          {stage.name}
        </Link>
      ))}
    </nav>
  );
}

export function StatusBadge({ status }: { status: AgentStatus }) {
  const config: Record<AgentStatus, { label: string; classes: string }> = {
    complete: { label: "Complete", classes: "bg-[#3fb950]/10 text-[#3fb950] border-[#3fb950]/30" },
    active: { label: "Active", classes: "bg-[#58a6ff]/10 text-[#58a6ff] border-[#58a6ff]/30 animate-pulse" },
    pending: { label: "Pending", classes: "bg-[#21262d] text-[#484f58] border-[#30363d]" },
    "needs-review": { label: "Needs Review", classes: "bg-[#d29922]/10 text-[#d29922] border-[#d29922]/30" },
  };
  const c = config[status];
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium", c.classes)}>{c.label}</span>;
}

export function MetricCard({ label, value, trend, trendDirection }: { label: string; value: string; trend?: string; trendDirection?: "up" | "down" | "neutral" }) {
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <div className="text-[10px] font-medium uppercase tracking-wider text-[#484f58]">{label}</div>
      <div className="mt-1 text-2xl font-bold text-[#f0f6fc]">{value}</div>
      {trend && <div className={cn("mt-1 text-xs", trendDirection === "up" && "text-[#3fb950]", trendDirection === "down" && "text-[#da3633]", trendDirection === "neutral" && "text-[#8b949e]")}>{trend}</div>}
    </div>
  );
}

export function DocumentPreview({ title, type, children }: { title: string; type?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[#8b949e]">{Icons.file}</span>
          <span className="text-xs font-medium text-[#f0f6fc]">{title}</span>
        </div>
        {type && <span className="rounded-full bg-[#21262d] border border-[#30363d] px-2 py-0.5 text-[10px] text-[#8b949e]">{type}</span>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-lg font-semibold text-[#f0f6fc]">{title}</h2>
        {subtitle && <p className="text-xs text-[#8b949e] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CTAButton({ children, href }: { children: React.ReactNode; href?: string }) {
  const classes = "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-[#58a6ff] text-[#0d1117] hover:bg-[#79c0ff] transition-colors";
  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <button className={classes}>{children}</button>;
}

export function AgentPageShell({ agentId, title, subtitle, status, children }: { agentId: string; title: string; subtitle: string; status: AgentStatus; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", status === "complete" && "bg-[#3fb950]/20 text-[#3fb950]", status === "active" && "bg-[#58a6ff]/20 text-[#58a6ff]", status === "pending" && "bg-[#21262d] text-[#484f58]", status === "needs-review" && "bg-[#d29922]/20 text-[#d29922]")}>
            <span className="scale-125">{AGENT_ICONS[agentId]}</span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#f0f6fc]">{title}</h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-sm text-[#8b949e] mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export function ActivityItem({ time, agentId, action }: { time: string; agentId: string; action: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="mt-0.5 text-[10px] text-[#484f58] whitespace-nowrap w-16 flex-shrink-0">{time}</span>
      <div className="flex h-5 w-5 items-center justify-center rounded flex-shrink-0 bg-[#21262d] text-[#8b949e]">{AGENT_ICONS[agentId] || Icons.zap}</div>
      <span className="text-xs text-[#8b949e]">{action}</span>
    </div>
  );
}

export function PipelineStepper() {
  return null;
}

export { cn };
