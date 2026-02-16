"use client";

import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "GC Alerted to Emerging Risks",
    description: "General Counsel opens Command Center and sees agents have detected new risks not captured in Board materials or regulatory filings.",
    status: "complete" as const,
    href: "/step-1",
  },
  {
    id: 2,
    title: "Review Detection Sources",
    description: "GC reviews what agents scanned and where the emerging risks originated from.",
    status: "upcoming" as const,
    href: "/step-2",
  },
  {
    id: 3,
    title: "Assign Risk Owners",
    description: "GC assigns owners to each detected risk and kicks off investigation workflows.",
    status: "upcoming" as const,
    href: "/step-3",
  },
  {
    id: 4,
    title: "Risk Owner Investigation",
    description: "Risk managers investigate individual risks and provide context and recommendations.",
    status: "upcoming" as const,
    href: "/step-4",
  },
  {
    id: 5,
    title: "Update 10K Risk Disclosure",
    description: "Legal team updates regulatory filings based on investigation findings.",
    status: "upcoming" as const,
    href: "/step-5",
  },
  {
    id: 6,
    title: "Notify Board",
    description: "GC prepares and sends board notification with risk summary and actions taken.",
    status: "upcoming" as const,
    href: "/step-6",
  },
];

export default function PrototypeIndex() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc]">
      {/* Header */}
      <header className="border-b border-[#30363d] bg-[#161b22]">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold">GC Emerging Risk Response</h1>
              <p className="text-sm text-[#8b949e]">Multi-step workflow prototype</p>
            </div>
          </div>
          <p className="text-[#8b949e] leading-relaxed">
            This prototype demonstrates the General Counsel&apos;s workflow when AI agents detect 
            emerging risks that need to be addressed in Board materials and regulatory filings.
          </p>
        </div>
      </header>

      {/* Steps */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        <h2 className="text-lg font-medium mb-6 text-[#8b949e]">Workflow Steps</h2>
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`rounded-lg border ${
                step.status === "complete"
                  ? "border-[#238636] bg-[#161b22]"
                  : "border-[#30363d] bg-[#0d1117]"
              }`}
            >
              {step.status === "complete" ? (
                <Link href={step.href} className="block p-5 hover:bg-[#21262d] transition-colors rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#238636] flex items-center justify-center text-sm font-medium">
                      {step.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-[#f0f6fc]">{step.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#238636]/20 text-[#3fb950]">
                          Ready
                        </span>
                      </div>
                      <p className="text-sm text-[#8b949e] mt-1">{step.description}</p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </Link>
              ) : (
                <div className="p-5 opacity-50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#30363d] flex items-center justify-center text-sm font-medium text-[#8b949e]">
                      {step.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-[#8b949e]">{step.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#30363d] text-[#8b949e]">
                          Coming soon
                        </span>
                      </div>
                      <p className="text-sm text-[#484f58] mt-1">{step.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[#30363d] text-center">
          <p className="text-sm text-[#484f58]">
            Prototype built with Next.js • Hosted on VibeSharing
          </p>
        </div>
      </main>
    </div>
  );
}
