"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
// Tambo not available in VibeSharing - running in demo mode
import {
  CanvasType,
  WorkflowCanvas,
  DocumentCanvas,
  ReportingCanvas,
  SearchCanvas,
  MeetingCanvas,
  EmailCanvas,
  tamboCanvasComponents,
  SearchResultCard,
  ContractSummaryCard,
  MeetingProposalCard,
  ReportInsightCard,
  EmailDraftCard,
} from "../shared/canvases";

// Stub for useTamboThread when Tambo provider is unavailable
function useTamboThread() {
  return {
    sendThreadMessage: async (_message: string) => ({ content: "" }),
  };
}

// Grayscale SVG Icons
const Icons = {
  workflow: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  document: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  reporting: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  search: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  meeting: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  email: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
};

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

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/*  People Database for Owner Suggestions                              */
/* ------------------------------------------------------------------ */

type SuggestedPerson = {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  matchScore: number;
  reasoning: string;
  recentActivity?: string;
};

const PEOPLE_DATABASE: SuggestedPerson[] = [
  {
    id: "diana-reyes",
    name: "Diana Reyes",
    title: "VP Supply Chain",
    department: "Operations",
    avatar: "from-[#3fb950] to-[#58a6ff]",
    matchScore: 94,
    reasoning: "Primary owner of supplier relationships. Led Taiwan risk assessment in Q3.",
    recentActivity: "Updated supplier contingency plans 2 days ago",
  },
  {
    id: "marcus-webb",
    name: "Marcus Webb",
    title: "CISO",
    department: "Information Security",
    avatar: "from-[#f85149] to-[#f0883e]",
    matchScore: 96,
    reasoning: "Leads vendor security program. Managing CloudSecure incident response.",
    recentActivity: "Filed preliminary breach assessment this morning",
  },
  {
    id: "james-park",
    name: "James Park",
    title: "Chief Compliance Officer",
    department: "Compliance",
    avatar: "from-[#a371f7] to-[#bc8cff]",
    matchScore: 91,
    reasoning: "EU compliance lead. Presented DMA readiness to Board in January.",
    recentActivity: "Reviewed peer enforcement actions last week",
  },
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    title: "Deputy General Counsel",
    department: "Legal",
    avatar: "from-[#58a6ff] to-[#a371f7]",
    matchScore: 88,
    reasoning: "Securities law expertise. Handles 10-K filings and disclosure review.",
    recentActivity: "Drafted last quarter's risk factor updates",
  },
  {
    id: "michael-torres",
    name: "Michael Torres",
    title: "CFO",
    department: "Finance",
    avatar: "from-[#d29922] to-[#f0883e]",
    matchScore: 85,
    reasoning: "Financial impact assessment. Determines materiality thresholds.",
    recentActivity: "Approved Q4 risk exposure estimates",
  },
  {
    id: "rachel-green",
    name: "Rachel Green",
    title: "VP Risk Management",
    department: "Enterprise Risk",
    avatar: "from-[#58a6ff] to-[#3fb950]",
    matchScore: 82,
    reasoning: "Enterprise risk coordinator. Maintains risk register and heat maps.",
    recentActivity: "Presented ERM update to Audit Committee",
  },
  {
    id: "tom-nguyen",
    name: "Tom Nguyen",
    title: "Director, Procurement",
    department: "Operations",
    avatar: "from-[#3fb950] to-[#d29922]",
    matchScore: 79,
    reasoning: "Manages chip supplier contracts. Deep knowledge of Taiwan operations.",
    recentActivity: "Negotiated backup supplier agreement last month",
  },
  {
    id: "lisa-wang",
    name: "Lisa Wang",
    title: "Privacy Officer",
    department: "Legal",
    avatar: "from-[#f0883e] to-[#a371f7]",
    matchScore: 76,
    reasoning: "Data breach notification specialist. Manages state privacy compliance.",
    recentActivity: "Updated breach response procedures in December",
  },
];

/* ------------------------------------------------------------------ */
/*  Chat Message Types                                                 */
/* ------------------------------------------------------------------ */

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  component?: React.ReactNode;
};

/* ------------------------------------------------------------------ */
/*  Person Suggestion Card                                             */
/* ------------------------------------------------------------------ */

function PersonSuggestionCard({ 
  person, 
  isPrimary,
  onSelect,
  isSelected,
}: { 
  person: SuggestedPerson;
  isPrimary: boolean;
  onSelect: () => void;
  isSelected: boolean;
}) {
  return (
    <div 
      onClick={onSelect}
      className={cn(
        "rounded-xl border p-3 cursor-pointer transition-all",
        isSelected 
          ? "border-[#3fb950] bg-[#3fb950]/10 ring-1 ring-[#3fb950]/50"
          : isPrimary
            ? "border-[#58a6ff]/50 bg-[#58a6ff]/5 hover:bg-[#58a6ff]/10"
            : "border-[#30363d] bg-[#161b22] hover:border-[#58a6ff]/50"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "h-10 w-10 rounded-full bg-gradient-to-br flex items-center justify-center flex-shrink-0",
          person.avatar
        )}>
          {isSelected && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#f0f6fc]">{person.name}</span>
                {isPrimary && !isSelected && (
                  <span className="rounded-full border border-[#58a6ff]/50 bg-[#58a6ff]/20 px-1.5 py-0 text-[9px] font-medium text-[#58a6ff]">
                    Recommended
                  </span>
                )}
                {isSelected && (
                  <span className="rounded-full border border-[#3fb950]/50 bg-[#3fb950]/20 px-1.5 py-0 text-[9px] font-medium text-[#3fb950]">
                    Selected
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#8b949e]">{person.title}</div>
            </div>
            <div className={cn(
              "text-sm font-bold",
              person.matchScore >= 90 ? "text-[#3fb950]" : person.matchScore >= 80 ? "text-[#58a6ff]" : "text-[#8b949e]"
            )}>
              {person.matchScore}%
            </div>
          </div>
          <div className="mt-1 text-[11px] text-[#6e7681]">{person.reasoning}</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Assignment Suggestion Response (Inline)                            */
/* ------------------------------------------------------------------ */

type AssignmentSuggestion = {
  riskId: string;
  riskName: string;
  severity: "critical" | "high" | "medium";
  primarySuggestion: SuggestedPerson;
  alternativeSuggestions: SuggestedPerson[];
};

function InlineAssignmentCard({ 
  suggestions,
  onConfirm,
}: { 
  suggestions: AssignmentSuggestion[];
  onConfirm: (assignments: Record<string, string>) => void;
}) {
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    suggestions.forEach(s => {
      defaults[s.riskId] = s.primarySuggestion.id;
    });
    return defaults;
  });
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const selectPerson = (riskId: string, personId: string) => {
    setSelections(prev => ({ ...prev, [riskId]: personId }));
  };

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm(selections);
  };

  if (confirmed) {
    return (
      <div className="rounded-xl border border-[#3fb950]/30 bg-[#3fb950]/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3fb950]/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#3fb950]">Owners Assigned & Notified</div>
            <div className="text-[11px] text-[#8b949e]">
              {suggestions.map((s, i) => {
                const person = [...[s.primarySuggestion], ...s.alternativeSuggestions].find(p => p.id === selections[s.riskId]);
                return (
                  <span key={s.riskId}>
                    {person?.name}{i < suggestions.length - 1 ? ", " : ""}
                  </span>
                );
              })}
            </div>
          </div>
          <a 
            href="/now/agentic-hero/superhero/coordinator"
            className="ml-auto rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-[11px] text-[#f0f6fc] hover:bg-[#30363d]"
          >
            View Details →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#58a6ff]/30 bg-[#58a6ff]/5 overflow-hidden">
      <div className="px-4 py-3 border-b border-[#30363d] bg-[#0d1117]/30">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#58a6ff] to-[#a371f7]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#f0f6fc]">Recommended Owners</div>
            <div className="text-[10px] text-[#8b949e]">Click to change · Expand for alternatives</div>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {suggestions.map((suggestion) => {
          const allPeople = [suggestion.primarySuggestion, ...suggestion.alternativeSuggestions];
          const selectedPerson = allPeople.find(p => p.id === selections[suggestion.riskId]);
          const isExpanded = expandedRisk === suggestion.riskId;

          return (
            <div key={suggestion.riskId} className="rounded-lg border border-[#30363d] bg-[#0d1117]/50 overflow-hidden">
              {/* Risk Header */}
              <div 
                className="px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#21262d]/50"
                onClick={() => setExpandedRisk(isExpanded ? null : suggestion.riskId)}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    suggestion.severity === "critical" && "bg-[#da3633]",
                    suggestion.severity === "high" && "bg-[#d29922]"
                  )} />
                  <span className="text-xs font-medium text-[#f0f6fc]">{suggestion.riskName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#8b949e]">{selectedPerson?.name}</span>
                  <svg 
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={cn("text-[#484f58] transition-transform", isExpanded && "rotate-180")}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* Expanded Options */}
              {isExpanded && (
                <div className="border-t border-[#30363d] p-3 space-y-2 bg-[#161b22]/50">
                  <PersonSuggestionCard
                    person={suggestion.primarySuggestion}
                    isPrimary={true}
                    onSelect={() => selectPerson(suggestion.riskId, suggestion.primarySuggestion.id)}
                    isSelected={selections[suggestion.riskId] === suggestion.primarySuggestion.id}
                  />
                  <div className="text-[10px] text-[#6e7681] uppercase tracking-wider pt-1">Other options</div>
                  {suggestion.alternativeSuggestions.map((person) => (
                    <React.Fragment key={person.id}>
                      <PersonSuggestionCard
                        person={person}
                        isPrimary={false}
                        onSelect={() => selectPerson(suggestion.riskId, person.id)}
                        isSelected={selections[suggestion.riskId] === person.id}
                      />
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-4 py-3 border-t border-[#30363d] bg-[#0d1117]/30 flex items-center justify-between">
        <a 
          href="/now/agentic-hero/superhero/coordinator"
          className="text-[11px] text-[#58a6ff] hover:underline"
        >
          Deep dive in Coordinator →
        </a>
        <button 
          onClick={handleConfirm}
          className="rounded-lg bg-[#3fb950] px-4 py-1.5 text-xs font-medium text-[#0d1117] hover:bg-[#56d364]"
        >
          Confirm & Notify
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chat Message Bubble                                                */
/* ------------------------------------------------------------------ */

function ChatMessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div className={cn(
      "flex gap-3",
      message.role === "user" && "flex-row-reverse"
    )}>
      <div className={cn(
        "h-7 w-7 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden",
        message.role === "user" 
          ? "bg-gradient-to-br from-[#58a6ff] to-[#a371f7]"
          : "bg-white p-1"
      )}>
        {message.role === "assistant" ? (
          <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
            <path d="M20.1006 15.6877C20.0186 15.8056 19.9338 15.9211 19.8467 16.0364C19.5697 16.4006 19.2675 16.7474 18.9443 17.0706C17.5077 18.5072 15.6393 19.5107 13.5459 19.8596L6.03223 12.345L8.3877 9.98755H8.38965L8.39258 9.98462L20.1006 15.6877Z" fill="#D3222A"/>
            <path d="M20.0259 4.21263C21.1905 5.84672 21.8735 7.84495 21.8735 9.99974C21.8735 12.116 21.2194 14.0737 20.1011 15.6872L8.39209 9.98412L20.0259 4.21263Z" fill="#EE312E"/>
            <path d="M13.5454 19.8581C13.0018 19.9504 12.4428 19.9997 11.8735 19.9997H3.69971L4.89307 13.4802L6.03174 12.3445L13.5454 19.8581Z" fill="#AF292E"/>
            <path d="M7.40379 10.0005L4.93727 11.2296L3.69979 13.7003L2.46653 11.2296L0 10.0005L2.46653 8.76302L3.69979 6.29649L3.71242 6.31754L4.93727 8.76302L7.40379 10.0005Z" fill="#1E1E1E"/>
            <path d="M13.5435 0.141312C16.0395 0.559546 18.2228 1.90387 19.7261 3.80733C19.8311 3.94057 19.9311 4.07423 20.0259 4.2126L8.39209 9.98409H8.38623L6.04443 7.63936L13.5435 0.141312Z" fill="#D3222A"/>
            <path d="M11.8735 0C12.4429 2.15682e-05 12.9997 0.0482901 13.5435 0.140625L6.04443 7.63965L4.88232 6.47754L3.69971 0H11.8735Z" fill="#AF292E"/>
            <path d="M9.65975 9.99958L4.55273 4.89256V6.5949L7.53183 9.99958L4.55273 12.9787V15.1066L9.65975 9.99958Z" fill="#F8F8FA"/>
            <path d="M9.65975 9.99958L4.55273 4.89256V6.5949L7.53183 9.99958L4.55273 12.9787V15.1066L9.65975 9.99958Z" fill="#F8F8FA"/>
            <path d="M9.65975 9.99958L4.55273 4.89256V6.5949L7.53183 9.99958L4.55273 12.9787V15.1066L9.65975 9.99958Z" fill="#F8F8FA"/>
            <path d="M9.65975 9.99958L4.55273 4.89256V6.5949L7.53183 9.99958L4.55273 12.9787V15.1066L9.65975 9.99958Z" fill="#F8F8FA"/>
            <path d="M9.66016 9.99998L4.55273 15.1064V12.9785L7.53223 9.99998L4.55273 6.59471V4.89256L9.66016 9.99998Z" fill="#F8F8FA"/>
          </svg>
        ) : null}
      </div>

      <div className={cn(
        "flex-1",
        message.role === "user" && "text-right"
      )}>
        <div className={cn(
          "inline-block rounded-2xl px-4 py-2",
          message.role === "user" 
            ? "bg-[#58a6ff] text-white"
            : "bg-[#21262d] text-[#f0f6fc]"
        )}>
          <p className="text-sm">{message.content}</p>
        </div>
        {message.component && (
          <div className="mt-3 text-left">
            {message.component}
          </div>
        )}
        <div className={cn(
          "text-[10px] text-[#6e7681] mt-1",
          message.role === "user" ? "text-right" : "text-left"
        )}>
          {message.timestamp}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pinned Prompt Box Component                                        */
/* ------------------------------------------------------------------ */

function PinnedPromptBox({ 
  onSubmit, 
  isLoading,
  suggestions,
  inline = false,
}: { 
  onSubmit: (message: string) => void;
  isLoading: boolean;
  suggestions: string[];
  inline?: boolean;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      setInput("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className={cn(
      inline 
        ? "mt-6 border-t border-[#30363d] pt-6" 
        : "fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117] to-transparent pb-4 pt-8 z-50"
    )}>
      <div className="mx-auto max-w-4xl px-6">
        {/* Suggestions */}
        {suggestions.length > 0 && !input && (
          <div className="flex items-center gap-2 mb-3 flex-wrap justify-center">
            <span className="text-[10px] text-[#6e7681]">Try:</span>
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(suggestion)}
                className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs text-[#8b949e] hover:border-[#58a6ff]/50 hover:text-[#f0f6fc] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-2 shadow-xl shadow-black/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white flex-shrink-0 p-1.5">
              <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                <path d="M20.1006 15.6877C20.0186 15.8056 19.9338 15.9211 19.8467 16.0364C19.5697 16.4006 19.2675 16.7474 18.9443 17.0706C17.5077 18.5072 15.6393 19.5107 13.5459 19.8596L6.03223 12.345L8.3877 9.98755H8.38965L8.39258 9.98462L20.1006 15.6877Z" fill="#D3222A"/>
                <path d="M20.0259 4.21263C21.1905 5.84672 21.8735 7.84495 21.8735 9.99974C21.8735 12.116 21.2194 14.0737 20.1011 15.6872L8.39209 9.98412L20.0259 4.21263Z" fill="#EE312E"/>
                <path d="M13.5454 19.8581C13.0018 19.9504 12.4428 19.9997 11.8735 19.9997H3.69971L4.89307 13.4802L6.03174 12.3445L13.5454 19.8581Z" fill="#AF292E"/>
                <path d="M7.40379 10.0005L4.93727 11.2296L3.69979 13.7003L2.46653 11.2296L0 10.0005L2.46653 8.76302L3.69979 6.29649L3.71242 6.31754L4.93727 8.76302L7.40379 10.0005Z" fill="#1E1E1E"/>
                <path d="M13.5435 0.141312C16.0395 0.559546 18.2228 1.90387 19.7261 3.80733C19.8311 3.94057 19.9311 4.07423 20.0259 4.2126L8.39209 9.98409H8.38623L6.04443 7.63936L13.5435 0.141312Z" fill="#D3222A"/>
                <path d="M11.8735 0C12.4429 2.15682e-05 12.9997 0.0482901 13.5435 0.140625L6.04443 7.63965L4.88232 6.47754L3.69971 0H11.8735Z" fill="#AF292E"/>
                <path d="M9.65975 9.99958L4.55273 4.89256V6.5949L7.53183 9.99958L4.55273 12.9787V15.1066L9.65975 9.99958Z" fill="#F8F8FA"/>
                <path d="M9.65975 9.99958L4.55273 4.89256V6.5949L7.53183 9.99958L4.55273 12.9787V15.1066L9.65975 9.99958Z" fill="#F8F8FA"/>
                <path d="M9.65975 9.99958L4.55273 4.89256V6.5949L7.53183 9.99958L4.55273 12.9787V15.1066L9.65975 9.99958Z" fill="#F8F8FA"/>
                <path d="M9.65975 9.99958L4.55273 4.89256V6.5949L7.53183 9.99958L4.55273 12.9787V15.1066L9.65975 9.99958Z" fill="#F8F8FA"/>
                <path d="M9.66016 9.99998L4.55273 15.1064V12.9785L7.53223 9.99998L4.55273 6.59471V4.89256L9.66016 9.99998Z" fill="#F8F8FA"/>
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Ask me anything about these risks..."
              className="flex-1 bg-transparent text-sm text-[#f0f6fc] placeholder-[#484f58] focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                input.trim() && !isLoading
                  ? "bg-[#58a6ff] text-white hover:bg-[#79c0ff]"
                  : "bg-[#21262d] text-[#484f58]"
              )}
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-[#484f58] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="text-center mt-2">
          <span className="text-[10px] text-[#484f58]">
            AI assistant powered by Tambo · Press Enter to send
          </span>
        </div>
      </div>
    </div>
  );
}

type Vision = "near-term" | "future";
type DeviceType = "desktop" | "ipad" | "iphone";

type AgentStatus = {
  name: string;
  lastRun: string;
  nextRun: string;
  note: string;
  state: string;
  criteria: string[];
  futureNote?: string;
  futureCriteria?: string[];
};

const agents: AgentStatus[] = [
  {
    name: "Risk Intelligence",
    lastRun: "8 minutes ago",
    nextRun: "in 7 minutes",
    note: "⚠️ 3 emerging risks detected requiring disclosure review",
    state: "ALERT",
    criteria: ["External risk signals", "News & media monitoring", "Regulatory filing analysis"],
    futureNote: "Cross-referenced risks against current 10K disclosures; gaps identified",
    futureCriteria: ["Predictive risk materiality scoring", "Auto-disclosure language generation", "Peer company disclosure comparison", "SEC comment letter pattern matching"],
  },
  {
    name: "Regulatory Watch",
    lastRun: "15 minutes ago",
    nextRun: "in 15 minutes",
    note: "⚠️ EU Digital Markets Act enforcement action pattern detected",
    state: "ALERT",
    criteria: ["Enforcement action tracking", "Cross-jurisdictional analysis", "Regulatory filing deadlines"],
    futureNote: "Impact assessment complete; recommends 10K risk factor update",
    futureCriteria: ["Predictive regulatory impact modeling", "Auto-generated compliance roadmaps", "Cross-jurisdictional harmonization", "Regulatory relationship mapping"],
  },
  {
    name: "Vendor Intelligence",
    lastRun: "32 minutes ago",
    nextRun: "in 28 minutes",
    note: "⚠️ Critical vendor cybersecurity incident reported",
    state: "ALERT",
    criteria: ["Vendor news monitoring", "Third-party risk signals", "Supply chain disruption tracking"],
    futureNote: "Vendor breach affects 3 data processing agreements; disclosure may be required",
    futureCriteria: ["Autonomous vendor risk scoring", "Supply chain impact modeling", "Contract clause trigger detection", "Regulatory notification requirements"],
  },
  {
    name: "Board Materials Monitor",
    lastRun: "1 hour ago",
    nextRun: "in 30 minutes",
    note: "Gap detected: Board materials don't reflect emerging risks",
    state: "Needs attention",
    criteria: ["Board meeting prep deadlines", "Material completeness checks", "Risk disclosure alignment"],
    futureNote: "AI-drafted risk summary ready for board notification",
    futureCriteria: ["Autonomous board brief generation", "Predictive governance risk scoring", "Real-time disclosure compliance", "Director liability monitoring"],
  },
  {
    name: "10K Disclosure Tracker",
    lastRun: "2 hours ago",
    nextRun: "in 1 hour",
    note: "Current risk factors may be incomplete based on new signals",
    state: "Review recommended",
    criteria: ["Risk factor currency", "Material change detection", "SEC filing deadlines"],
    futureNote: "Draft 8-K language prepared for material risk disclosure",
    futureCriteria: ["Auto-generated disclosure language", "Peer disclosure benchmarking", "SEC comment letter prediction", "Materiality threshold analysis"],
  },
];

// Detected emerging risks that triggered the alert
type DetectedRisk = {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium";
  source: string;
  detectedAt: string;
  summary: string;
  currentDisclosure: string | null;
  disclosureGap: string;
  recommendedAction: string;
  affectedFilings: string[];
};

const detectedRisks: DetectedRisk[] = [
  {
    id: "risk-1",
    title: "Taiwan Strait Geopolitical Tensions",
    severity: "critical",
    source: "Risk Intelligence + News Monitoring",
    detectedAt: "Today, 8:47 AM",
    summary: "Escalating tensions in the Taiwan Strait may disrupt semiconductor supply chain. 47% of our chip suppliers have Taiwan-based operations.",
    currentDisclosure: "Item 1A mentions 'general supply chain risks' but does not specifically address semiconductor concentration or geopolitical exposure.",
    disclosureGap: "No specific disclosure of semiconductor supply concentration or Taiwan geopolitical risk",
    recommendedAction: "Update Item 1A Risk Factors to include specific semiconductor supply chain and geopolitical risk language",
    affectedFilings: ["10-K Risk Factors", "Upcoming 10-Q MD&A"],
  },
  {
    id: "risk-2", 
    title: "Critical Vendor Cybersecurity Breach",
    severity: "high",
    source: "Vendor Intelligence",
    detectedAt: "Today, 9:12 AM",
    summary: "CloudSecure Inc. (our primary data processing vendor) disclosed a ransomware incident. They process customer PII under 3 of our data processing agreements.",
    currentDisclosure: "Item 1A includes cybersecurity risks but focuses on direct company systems, not vendor/third-party exposure.",
    disclosureGap: "Third-party data processor breach exposure not specifically disclosed",
    recommendedAction: "Assess notification obligations under state breach laws; consider 8-K materiality; update vendor risk disclosure",
    affectedFilings: ["Potential 8-K", "10-K Risk Factors", "Privacy Policy"],
  },
  {
    id: "risk-3",
    title: "EU Digital Markets Act Enforcement Pattern",
    severity: "high", 
    source: "Regulatory Watch",
    detectedAt: "Today, 7:23 AM",
    summary: "EC initiated enforcement actions against 3 companies in our sector for DMA non-compliance. Pattern analysis suggests our EU operations may face similar scrutiny.",
    currentDisclosure: "10-K mentions EU regulatory environment generally but DMA-specific risks not detailed.",
    disclosureGap: "DMA compliance risks and potential enforcement exposure not disclosed",
    recommendedAction: "Add DMA-specific risk factor; brief board on EU regulatory exposure; review compliance posture",
    affectedFilings: ["10-K Risk Factors", "Board Risk Committee Materials"],
  },
];

// Workflow stages for the risk response process
type WorkflowStage = {
  id: string;
  label: string;
  status: "completed" | "current" | "pending";
  description: string;
};

const riskWorkflowStages: WorkflowStage[] = [
  { id: "detect", label: "Risk Detected", status: "completed", description: "Agents identified emerging risks" },
  { id: "assess", label: "Assess & Prioritize", status: "current", description: "Review severity and disclosure gaps" },
  { id: "draft", label: "Draft Updates", status: "pending", description: "Prepare 10K amendments and board memo" },
  { id: "review", label: "Legal Review", status: "pending", description: "GC and securities counsel sign-off" },
  { id: "notify", label: "Notify Board", status: "pending", description: "Send to Audit Committee and full Board" },
  { id: "file", label: "File/Disclose", status: "pending", description: "Submit amended filings if required" },
];

const recentApps = {
  "near-term": [
    {
      name: "Boards",
      description: "Finalized Q1 board meeting agenda and uploaded supporting materials to the board book.",
      lastUsed: "Jan 16",
      icon: "boards",
    },
    {
      name: "Entities",
      description: "Verified annual report filings for 3 subsidiaries; all jurisdictions current.",
      lastUsed: "Jan 15",
      icon: "entities",
    },
    {
      name: "Policy Manager",
      description: "Reviewed attestation status for updated Code of Conduct; 94% employee completion.",
      lastUsed: "Jan 14",
      icon: "policy",
    },
    {
      name: "Diligent AI Reporting",
      description: "Generated executive summary of legal department KPIs for leadership review.",
      lastUsed: "Jan 12",
      icon: "reporting",
    },
  ],
  "future": [
    {
      name: "AI Legal Workspace",
      description: "Your autonomous agents handled 12 routine matters this week—review the summary.",
      lastUsed: "Today",
      icon: "ai",
      tag: "AI-Managed",
    },
    {
      name: "Predictive Analytics",
      description: "Updated litigation outcome models reflect recent case law changes.",
      lastUsed: "Today",
      icon: "analytics",
      tag: "Auto-Updated",
    },
    {
      name: "Autonomous Filings",
      description: "3 annual reports auto-filed; 2 more awaiting your approval.",
      lastUsed: "Yesterday",
      icon: "filings",
      tag: "Agent Action",
    },
    {
      name: "Board Intelligence",
      description: "AI-drafted board materials ready for your review before auto-distribution.",
      lastUsed: "Yesterday",
      icon: "boards",
      tag: "Draft Ready",
    },
  ],
};

const nextActions = {
  "near-term": [
    {
      title: "Review Taiwan supply chain risk assessment",
      detail: "Critical severity. 47% of chip suppliers have Taiwan operations. May require 10K Item 1A update.",
      app: "Risk Intelligence",
    },
    {
      title: "Assess vendor breach notification obligations",
      detail: "CloudSecure incident may trigger state breach notification laws. Check DPA terms.",
      app: "Vendor Intelligence",
    },
    {
      title: "Brief Audit Committee on emerging risks",
      detail: "Board meeting in 12 days. Current materials don't reflect these risks.",
      app: "Boards",
    },
    {
      title: "Coordinate with CFO on disclosure approach",
      detail: "Financial impact assessment needed for materiality determination.",
      app: "AI Reporting",
    },
  ],
  "future": [
    {
      title: "Review AI-drafted 10K risk factor updates",
      detail: "System has generated disclosure language for all 3 emerging risks based on peer filings.",
      tag: "AI-Generated",
    },
    {
      title: "Approve AI-prepared Board briefing memo",
      detail: "Executive summary of risks, disclosure gaps, and recommended actions ready for review.",
      tag: "Auto-Draft Ready",
    },
    {
      title: "Validate materiality assessment",
      detail: "AI analyzed quantitative and qualitative factors; recommends Taiwan risk as material.",
      tag: "Predictive",
    },
    {
      title: "Review stakeholder coordination plan",
      detail: "System has identified key reviewers and proposed timeline for disclosure workflow.",
      tag: "Auto-Generated",
    },
  ],
};

const whatsNew = {
  "near-term": [
    {
      title: "Boards: Consent agenda workflows",
      detail: "Streamline routine approvals with new consent agenda templates and e-signatures.",
      href: "#",
    },
    {
      title: "Entities: Jurisdiction alerts",
      detail: "Get notified of filing deadline changes and regulatory updates by jurisdiction.",
      href: "#",
    },
    {
      title: "AI Reporting: Natural language queries",
      detail: "Ask questions in plain English and get instant governance insights.",
      href: "#",
    },
  ],
  "future": [
    {
      title: "Predictive Litigation Outcomes",
      detail: "AI models trained on case law predict outcomes and optimal strategies.",
      href: "#",
    },
    {
      title: "Autonomous Contract Negotiation",
      detail: "AI drafts negotiation positions and redlines based on your playbook.",
      href: "#",
    },
    {
      title: "Proactive Compliance Engine",
      detail: "System anticipates regulatory changes and pre-builds compliance roadmaps.",
      href: "#",
    },
  ],
};

// Near-term: Pending regulatory filings awaiting approval
const pendingFilings = [
  {
    entity: "Acme Holdings, Inc.",
    filing: "Delaware Annual Report",
    jurisdiction: "Delaware",
    dueDate: "Mar 1, 2025",
    status: "Ready to file",
    fee: "$225",
    preparedBy: "Entities",
  },
  {
    entity: "Acme West LLC",
    filing: "Statement of Information",
    jurisdiction: "California",
    dueDate: "Feb 15, 2025",
    status: "Ready to file",
    fee: "$20",
    preparedBy: "Entities",
  },
  {
    entity: "Acme Services Corp.",
    filing: "Annual Report",
    jurisdiction: "Nevada",
    dueDate: "Feb 28, 2025",
    status: "Ready to file",
    fee: "$150",
    preparedBy: "Entities",
  },
];

// Future: Cross-Diligent risk signals requesting GC input
const riskSignals = [
  {
    source: "Risk Manager",
    title: "Litigation exposure assessment needed",
    detail: "Q1 risk register update requires your input on active matter reserves and potential new claims.",
    impact: "High",
    requestedBy: "Chief Risk Officer",
    dueDate: "Jan 24",
  },
  {
    source: "Contract Intelligence",
    title: "Vendor concentration risk identified",
    detail: "3 critical vendors account for 40% of spend. Legal review needed for contingency planning.",
    impact: "Medium",
    requestedBy: "Procurement",
    dueDate: "Jan 28",
  },
  {
    source: "Regulatory Watch",
    title: "SEC rule impact on disclosure obligations",
    detail: "Pending climate disclosure rule may affect 10-K filings. Legal interpretation requested.",
    impact: "High",
    requestedBy: "CFO",
    dueDate: "Feb 1",
  },
];

const activityLog = {
  "near-term": [
    "🚨 Risk Intelligence: 3 emerging risks detected requiring disclosure review (8:47 AM)",
    "⚠️ Regulatory Watch: EU DMA enforcement pattern identified affecting our sector (7:23 AM)",
    "⚠️ Vendor Intelligence: CloudSecure Inc. cybersecurity incident reported (9:12 AM)",
    "📋 Board Materials Monitor: Gap detected between current materials and emerging risks",
    "📊 10K Disclosure Tracker: Current risk factors flagged for review",
  ],
  "future": [
    "🤖 Risk AI: Cross-referenced 3 risks against current 10K—disclosure gaps identified",
    "📝 Document AI: Draft risk factor language prepared for your review",
    "👥 Stakeholder AI: Identified Sarah Chen, CFO, and Audit Committee as key reviewers",
    "📅 Board AI: Recommended adding risk briefing to Feb 28 meeting agenda",
    "⚖️ Materiality AI: Assessed Taiwan supply chain risk as potentially material",
  ],
};

function SectionHeader({
  title,
  description,
  className,
  titleClassName,
}: {
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-6", className)}>
      <div>
        <h2 className={cn("mt-2 text-2xl font-semibold text-[#f0f6fc]", titleClassName)}>{title}</h2>
        {description ? <p className="mt-2 text-sm text-[#8b949e]">{description}</p> : null}
      </div>
    </div>
  );
}

function SoftTag({ children, variant = "default" }: { children?: React.ReactNode; variant?: "default" | "ai" | "predictive" }) {
  const styles = {
    default: "border-[#30363d] bg-[#21262d] text-[#8b949e]",
    ai: "border-[#a371f7]/40 bg-[#a371f7]/10 text-[#a371f7]",
    predictive: "border-[#3fb950]/40 bg-[#3fb950]/10 text-[#3fb950]",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium", styles[variant])}>
      {children}
    </span>
  );
}

function Card({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-sm", className)}>{children}</div>
  );
}

function VisionToggle({ vision, onChange, variant = "dark" }: { vision: Vision; onChange: (v: Vision) => void; variant?: "dark" | "light" }) {
  const isLight = variant === "light";
  return (
    <div className={cn(
      "flex items-center gap-1 rounded-xl border p-1",
      isLight ? "border-[#0ea5e9]/40 bg-white" : "border-[#30363d] bg-[#0d1117]"
    )}>
      <button
        onClick={() => onChange("near-term")}
        className={cn(
          "rounded-lg px-3 py-1.5 text-xs font-medium transition",
          vision === "near-term"
            ? isLight ? "bg-[#0ea5e9] text-white" : "bg-[#21262d] text-[#f0f6fc]"
            : isLight ? "text-[#0369a1] hover:bg-[#bae6fd]" : "text-[#8b949e] hover:text-[#f0f6fc]"
        )}
      >
        Near-term Vision
      </button>
      <button
        onClick={() => onChange("future")}
        className={cn(
          "rounded-lg px-3 py-1.5 text-xs font-medium transition",
          vision === "future"
            ? isLight ? "bg-[#a78bfa] text-white" : "bg-[#a371f7]/20 text-[#a371f7]"
            : isLight ? "text-[#0369a1] hover:bg-[#bae6fd]" : "text-[#8b949e] hover:text-[#f0f6fc]"
        )}
      >
        1 Year+ Vision
      </button>
    </div>
  );
}

function DeviceToggle({ device, onChange }: { device: DeviceType; onChange: (d: DeviceType) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-[#30363d] bg-[#0d1117] p-1">
      <button
        onClick={() => onChange("desktop")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
          device === "desktop"
            ? "bg-[#21262d] text-[#f0f6fc]"
            : "text-[#8b949e] hover:text-[#f0f6fc]"
        )}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
        Desktop
      </button>
      <button
        onClick={() => onChange("ipad")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
          device === "ipad"
            ? "bg-[#21262d] text-[#f0f6fc]"
            : "text-[#8b949e] hover:text-[#f0f6fc]"
        )}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M12 18h.01" />
        </svg>
        iPad
      </button>
      <button
        onClick={() => onChange("iphone")}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
          device === "iphone"
            ? "bg-[#21262d] text-[#f0f6fc]"
            : "text-[#8b949e] hover:text-[#f0f6fc]"
        )}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="3" />
          <path d="M12 18h.01" />
        </svg>
        iPhone
      </button>
    </div>
  );
}

function DevicePreviewBar({ device, onDeviceChange }: { device: DeviceType; onDeviceChange: (d: DeviceType) => void }) {
  return (
    <div className="w-full border-b border-[#30363d] bg-[#161b22]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-2">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6e7681]">Device Preview</span>
        </div>
        <DeviceToggle device={device} onChange={onDeviceChange} />
      </div>
    </div>
  );
}

function IPhoneFrame({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative">
        {/* iPhone bezel */}
        <div className="relative rounded-[3rem] border-[14px] border-[#1c1c1e] bg-[#1c1c1e] shadow-2xl">
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-2 z-20 h-[25px] w-[90px] -translate-x-1/2 rounded-full bg-black" />
          {/* Screen */}
          <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[2.5rem] bg-[#0d1117]">
            <div className="h-full w-full overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
        {/* Side button */}
        <div className="absolute -right-[3px] top-[120px] h-[80px] w-[3px] rounded-r-sm bg-[#2c2c2e]" />
        <div className="absolute -left-[3px] top-[100px] h-[35px] w-[3px] rounded-l-sm bg-[#2c2c2e]" />
        <div className="absolute -left-[3px] top-[150px] h-[60px] w-[3px] rounded-l-sm bg-[#2c2c2e]" />
        <div className="absolute -left-[3px] top-[220px] h-[60px] w-[3px] rounded-l-sm bg-[#2c2c2e]" />
      </div>
    </div>
  );
}

function IPadFrame({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative">
        {/* iPad bezel */}
        <div className="relative rounded-[2rem] border-[18px] border-[#1c1c1e] bg-[#1c1c1e] shadow-2xl">
          {/* Camera */}
          <div className="absolute left-1/2 top-3 z-20 h-[8px] w-[8px] -translate-x-1/2 rounded-full bg-[#2c2c2e]" />
          {/* Screen */}
          <div className="relative h-[700px] w-[980px] overflow-hidden rounded-[1rem] bg-[#0d1117]">
            <div className="h-full w-full overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrototypeNav({ 
  vision, 
  onVisionChange,
  device,
  onDeviceChange,
}: { 
  vision: Vision; 
  onVisionChange: (v: Vision) => void;
  device: DeviceType;
  onDeviceChange: (d: DeviceType) => void;
}) {
  return (
    <div className="border-b-2 border-[#0ea5e9]/40 bg-[#e0f2fe]">
      {/* Explicit label: these controls are NOT part of the prototype */}
      <div className="border-b border-[#0ea5e9]/30 bg-[#bae6fd] px-4 py-2">
        <p className="text-[10px] font-medium uppercase tracking-widest text-[#0369a1]">
          Demo controls — not part of prototype
        </p>
      </div>

      {/* Top bar with scenario description */}
      <div className="w-full border-b border-[#0ea5e9]/20 bg-[#e0f2fe]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[#0369a1]">Prototype</span>
            <span className="text-sm font-semibold text-[#0c4a6e]">Risk Detection → 10K Update → Board Notification</span>
            <span className="rounded-full border border-[#dc2626]/50 bg-[#fecaca] px-2 py-0.5 text-[10px] font-medium text-[#b91c1c]">
              Scenario
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="rounded-full border-2 border-[#0c4a6e] bg-[#7dd3fc]/30 px-3 py-1 text-xs font-semibold text-[#0c4a6e]">
              Viewing as: General Counsel
            </span>
            <VisionToggle vision={vision} onChange={onVisionChange} variant="light" />
          </div>
        </div>
      </div>

      {/* Scenario context bar */}
      <div className="w-full border-b border-[#0ea5e9]/20 bg-[#e0f2fe]">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fecaca]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#0c4a6e]">
                <span className="font-medium text-[#075985]">Scenario:</span> The General Counsel opens their GRC Command Center and sees that monitoring agents have detected 
                emerging risks not captured in upcoming Board materials or regulatory filings. The GC will assess the risks, 
                coordinate with stakeholders, update 10K risk disclosures, and notify the Board.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Device selector */}
      <div className="flex flex-col items-center gap-3 bg-[#e0f2fe] py-4">
        <div className="flex items-center gap-2 rounded-xl border border-[#0ea5e9]/40 bg-white p-1 shadow-sm">
          {[
            { id: "desktop" as DeviceType, icon: "🖥️", label: "Desktop" },
            { id: "ipad" as DeviceType, icon: "📱", label: "iPad" },
            { id: "iphone" as DeviceType, icon: "📱", label: "iPhone" },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => onDeviceChange(d.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition",
                device === d.id
                  ? "bg-[#0ea5e9] text-white shadow-sm"
                  : "text-[#0369a1] hover:bg-[#bae6fd]"
              )}
            >
              <span>{d.icon}</span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>
        
        {/* Tambo prompt hints */}
        <div className="flex items-center gap-2 text-xs text-[#0369a1]">
          <span className="rounded bg-[#a78bfa]/30 px-1.5 py-0.5 text-[10px] font-medium text-[#6d28d9]">Live Mode</span>
          <span>Try:</span>
          {["draft 10K update", "compare to current disclosures", "notify the board", "who should review this", "show risk timeline"].map((prompt, i) => (
            <span key={prompt}>
              <span className="text-[#0c4a6e]">&ldquo;{prompt}&rdquo;</span>
              {i < 4 && <span className="ml-2 text-[#0ea5e9]/50">•</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Prototype boundary label */}
      <div className="border-t-2 border-[#0ea5e9] bg-[#0c4a6e] px-4 py-2">
        <p className="text-[10px] font-medium uppercase tracking-widest text-[#7dd3fc]">
          ↓ Prototype starts below (Diligent logo & GRC Command Center)
        </p>
      </div>
    </div>
  );
}

function TopNav({
  activityOpen,
  onToggleActivity,
  activityCount,
  vision,
}: {
  activityOpen: boolean;
  onToggleActivity: () => void;
  activityCount: number;
  vision: Vision;
}) {
  return (
    <div className="sticky top-0 z-10 -mx-6 mb-8 border-b border-[#30363d] bg-[#0d1117]/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <DiligentLogo className="h-7 w-auto" />
            <span className="text-sm font-semibold text-[#f0f6fc]">GRC Command Center</span>
          </div>
          <span className="rounded-full border border-[#58a6ff]/40 bg-[#58a6ff]/10 px-2 py-0.5 text-[10px] font-medium text-[#58a6ff]">
            General Counsel
          </span>
          {vision === "future" && (
            <span className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#a371f7]">
              AI-Enhanced
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleActivity}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-xl border bg-[#161b22] px-3 text-sm text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]",
              activityOpen ? "border-[#58a6ff]" : "border-[#30363d]"
            )}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6h12M9 12h12M9 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <span className="font-medium">Recent activity</span>
            <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e]">({activityCount})</span>
          </button>

          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#30363d] bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]" aria-label="Notifications">
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-[#da3633] ring-2 ring-[#0d1117]" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#30363d] bg-[#161b22] text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]" aria-label="More">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>

          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a371f7]" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

// Canvas action buttons configuration
const canvasActions: Array<{ id: CanvasType; label: string; icon: React.ReactNode; description: string }> = [
  { 
    id: "workflow", 
    label: "Start Workflow", 
    icon: Icons.workflow, 
    description: "Complex multi-step tasks",
  },
  { 
    id: "document", 
    label: "Draft Document", 
    icon: Icons.document, 
    description: "Create or review docs",
  },
  { 
    id: "reporting", 
    label: "Run Report", 
    icon: Icons.reporting, 
    description: "Trends & analytics",
  },
  { 
    id: "search", 
    label: "AI Search", 
    icon: Icons.search, 
    description: "Find anything",
  },
  { 
    id: "meeting", 
    label: "Schedule", 
    icon: Icons.meeting, 
    description: "AI finds time",
  },
  { 
    id: "email", 
    label: "Draft Email", 
    icon: Icons.email, 
    description: "Secure sharing",
  },
];

// Tambo-enabled prompt box with chat functionality
// Generate card components based on Tambo response content
function generateCardsFromContent(content: string, query: string): React.ReactNode | undefined {
  const text = (content + " " + query).toLowerCase();
  const q = query.toLowerCase(); // Use query alone for intent detection
  
  // PRIORITY 1: Detect explicit search intent from query (who, find, where, search)
  if (q.includes("who") || q.includes("find") || q.includes("where is") || q.includes("search for") || q.includes("look up")) {
    // Extract name from query if present
    const nameMatch = query.match(/who is (\w+ \w+|\w+)/i) || query.match(/find (\w+ \w+|\w+)/i);
    const name = nameMatch ? nameMatch[1] : "Sarah Chen";
    return (
      <div className="mt-3 space-y-2">
        <SearchResultCard 
          id="search-1"
          title={`${name} - Deputy General Counsel`}
          source="Employee Directory"
          sourceIcon="👤"
          snippet="Specializes in corporate governance and compliance. Primary contact for regulatory filings."
          relevance={98}
          lastModified="Active employee"
          owner="Legal"
        />
      </div>
    );
  }
  
  // PRIORITY 2: Detect email/draft intent from query
  if (q.includes("email") || q.includes("draft") || q.includes("send") || q.includes("compose")) {
    return (
      <div className="mt-3 space-y-2">
        <EmailDraftCard 
          id="email-1"
          to="CFO, Board Secretary"
          subject="Q1 Board Materials - Pre-Read"
          preview="Please find the attached pre-read materials for our upcoming Q1 board meeting on February 14. The financial summary and risk assessment are ready for your review..."
          attachments={["Q1 Financial Summary", "Risk Assessment Update"]}
          isSecure={true}
          status="draft"
        />
      </div>
    );
  }
  
  // PRIORITY 3: Detect meeting/schedule intent from query
  if (q.includes("schedule") || q.includes("meeting") || q.includes("calendar") || q.includes("set up time")) {
    return (
      <div className="mt-3 space-y-2">
        <MeetingProposalCard 
          id="meeting-1"
          time="3:30 PM"
          date="Tomorrow"
          available={true}
          aiNote="Moved low-priority call to open this slot"
          attendeesAvailable={3}
          totalAttendees={3}
        />
      </div>
    );
  }
  
  // PRIORITY 4: Detect report/trend/analytics content
  if (q.includes("report") || q.includes("trend") || q.includes("analytic") || q.includes("insight") || q.includes("pattern") || q.includes("attendance") || q.includes("voting")) {
    return (
      <div className="mt-3 space-y-2">
        <ReportInsightCard 
          id="report-1"
          title="Board Attendance Trends"
          insight="Attendance has increased 8% over the last 4 quarters. Average meeting duration down 12%."
          metric="94%"
          change="+8% vs prior year"
          changeType="positive"
        />
        <ReportInsightCard 
          id="report-2"
          title="Voting Patterns"
          insight="97% consensus rate on strategic initiatives. 3 items required multiple votes."
          metric="97%"
          change="Consistent with peers"
          changeType="neutral"
        />
      </div>
    );
  }
  
  // PRIORITY 5: Detect contract content from query or response
  if (text.includes("contract") || text.includes("renewal") || text.includes("agreement") || text.includes("vendor")) {
    return (
      <div className="mt-3 space-y-2">
        <ContractSummaryCard 
          id="contract-1"
          title="Master Services Agreement"
          counterparty="Acme Corp"
          value="$2.4M/year"
          renewalDate="Mar 15, 2025"
          owner="Sarah Chen"
          riskScore="65"
          status="Renewal pending"
        />
      </div>
    );
  }
  
  // PRIORITY 5: Detect matter/litigation content
  if (text.includes("matter") || text.includes("litigation") || text.includes("case") || text.includes("lawsuit")) {
    return (
      <div className="mt-3 space-y-2">
        <SearchResultCard 
          id="matter-1"
          title="Smith v. Acme Holdings"
          source="Matter Manager"
          sourceIcon="⚖️"
          snippet="Discovery phase. Document production deadline approaching. 73% favorable outlook."
          relevance={98}
          lastModified="2 days ago"
        />
      </div>
    );
  }
  
  // PRIORITY 6: Detect board/governance content (only if no specific intent above)
  if (q.includes("board") || q.includes("agenda") || q.includes("directors") || q.includes("governance")) {
    return (
      <div className="mt-3 space-y-2">
        <ReportInsightCard 
          id="board-insight"
          title="Board Meeting Status"
          insight="All agenda items finalized. 72% of directors have reviewed materials."
          metric="72%"
          change="+8% from last meeting"
          changeType="positive"
        />
      </div>
    );
  }
  
  return undefined;
}

function TamboPromptBoxWithHooks({ vision, onOpenCanvas, onFocusChange }: { vision: Vision; onOpenCanvas: (canvas: CanvasType) => void; onFocusChange?: (focused: boolean) => void }) {
  const [inputValue, setInputValue] = React.useState("");
  const [messages, setMessages] = React.useState<Array<{ role: "user" | "assistant"; content: string; component?: React.ReactNode }>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [demoMode, setDemoMode] = React.useState(true);
  const [isFocused, setIsFocused] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  const tamboThread = useTamboThread();
  
  // Track focus state - focused when input focused OR has messages
  const isActive = isFocused || messages.length > 0;
  
  React.useEffect(() => {
    onFocusChange?.(isActive);
  }, [isActive, onFocusChange]);

  React.useEffect(() => {
    // Scroll within container only, not the whole page
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Check if query should open a canvas instead of chat
  const detectCanvasIntent = (query: string): CanvasType | null => {
    const q = query.toLowerCase();
    if (q.includes("workflow") || q.includes("prepare board materials")) return "workflow";
    if (q.includes("draft") && (q.includes("document") || q.includes("memo") || q.includes("letter"))) return "document";
    if (q.includes("report") || q.includes("trend") || q.includes("attendance pattern") || q.includes("voting pattern")) return "reporting";
    if (q.includes("schedule") && (q.includes("meeting") || q.includes("call"))) return "meeting";
    if (q.includes("draft email") || q.includes("send email")) return "email";
    return null;
  };

  const getDemoResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("matter") || q.includes("litigation") || q.includes("smith")) {
      return "I found 2 active matters:\n\n• Smith v. Acme Holdings (Discovery phase, 73% favorable)\n  → Document production deadline: Feb 15\n\n• IP Licensing Dispute (Negotiation, settlement likely)\n  → Counter-proposal awaiting your review";
    }
    if (q.includes("contract") || q.includes("acme") || q.includes("renewal")) {
      return "Sarah Chen (Procurement) owns the Acme Corp relationship.\n\n• Master Services Agreement: $2.4M/year\n• Renewal date: March 15, 2025\n• Status: Renewal pending\n\nWould you like me to schedule a meeting with Sarah?";
    }
    if (q.includes("board") || q.includes("meeting")) {
      return "Your next board meeting is in 12 days (Feb 14).\n\nPreparation status:\n✓ Financial Results Review — Complete\n○ Equity Grant Approval — In progress\n○ Risk Assessment Update — Not started\n\nShould I open the workflow canvas to prepare materials?";
    }
    if (q.includes("who") || q.includes("owner")) {
      return "I searched across Third Party Manager, Entities, and Risk Manager.\n\nSarah Chen (Procurement) is the primary owner:\n• 98% confidence from Contract Manager\n• 92% confidence from Risk Manager";
    }
    return "I can help you with:\n• Active legal matters and litigation status\n• Contract renewals and vendor relationships\n• Board meeting preparation\n• Finding relationship owners across systems";
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage = inputValue.trim();
    // All interactions stay in the prompt box - no modal redirects
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInputValue("");
    setIsLoading(true);

    if (demoMode) {
      setTimeout(() => {
        const demoComponent = generateCardsFromContent("", userMessage);
        setMessages(prev => [...prev, { role: "assistant", content: getDemoResponse(userMessage), component: demoComponent }]);
        setIsLoading(false);
      }, 800);
    } else {
      try {
        const response = await tamboThread.sendThreadMessage(userMessage);
        const rawContent = (response as unknown as Record<string, unknown>)?.content;
        let textContent = "";
        if (typeof rawContent === "string") {
          textContent = rawContent;
        } else if (Array.isArray(rawContent)) {
          textContent = rawContent
            .filter((c): c is { type: string; text: string } => c && typeof c === "object" && "text" in c)
            .map((c) => c.text)
            .join("\n");
        }
        // Generate cards based on response content
        const liveComponent = generateCardsFromContent(textContent, userMessage);
        setMessages(prev => [...prev, { role: "assistant", content: textContent || "I found some relevant information.", component: liveComponent }]);
        setIsLoading(false);
      } catch (err) {
        setMessages(prev => [...prev, { role: "assistant", content: `Error: ${err instanceof Error ? err.message : "Unknown error"}. Try demo mode.` }]);
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className={cn(
      "p-6 transition-all duration-300",
      isActive && "scale-[1.02] shadow-lg shadow-[#58a6ff]/10 ring-1 ring-[#58a6ff]/20"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={cn(
            "font-semibold text-[#f0f6fc] transition-all duration-300",
            isActive ? "text-xl" : "text-lg"
          )}>
            {vision === "near-term" ? "What do you need to do?" : "Direct your autonomous Legal AI workforce."}
          </h3>
          <p className={cn(
            "mt-1 text-[#8b949e] transition-all duration-300",
            isActive ? "text-base" : "text-sm"
          )}>
            Ask questions or choose an action below. Work entirely within Diligent.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-[#30363d] bg-[#21262d] p-0.5">
            <button onClick={() => setDemoMode(true)} className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium transition", demoMode ? "bg-[#161b22] text-[#f0f6fc]" : "text-[#6e7681] hover:text-[#8b949e]")}>Demo</button>
            <button onClick={() => setDemoMode(false)} className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium transition", !demoMode ? "bg-[#161b22] text-[#f0f6fc]" : "text-[#6e7681] hover:text-[#8b949e]")}>Live</button>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-[#a371f7]/10 px-2 py-0.5 text-[10px] text-[#a371f7]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#a371f7]" />Tambo
          </span>
        </div>
      </div>

      {/* Unified Chat Container */}
      <div className={cn(
        "mt-4 flex flex-col rounded-xl border bg-[#0d1117] transition-all duration-300",
        isActive ? "border-[#58a6ff]/50 ring-1 ring-[#58a6ff]/20" : "border-[#30363d]"
      )}>
        {/* Messages Area */}
        {messages.length > 0 && (
          <div ref={messagesContainerRef} className="max-h-[400px] space-y-3 overflow-y-auto p-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.role === "user" ? "flex justify-end" : ""}>
                {msg.role === "user" ? (
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#30363d] px-3 py-2">
                    <p className="whitespace-pre-wrap text-sm text-[#f0f6fc]">{msg.content}</p>
                  </div>
                ) : (
                  <div className="w-full space-y-2">
                    <div className="rounded-2xl rounded-bl-md border border-[#58a6ff]/20 bg-[#58a6ff]/5 px-3 py-2">
                      <p className="whitespace-pre-wrap text-sm text-[#f0f6fc]">{msg.content}</p>
                    </div>
                    {msg.component && <div>{msg.component}</div>}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#58a6ff]/20 bg-[#58a6ff]/5 px-3 py-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#58a6ff]" />
                <span className="text-xs text-[#8b949e]">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className={cn(
          "flex items-center gap-2 p-3",
          messages.length > 0 && "border-t border-[#30363d]"
        )}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            className="flex-1 bg-transparent px-2 py-2 text-base text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none"
            placeholder="Ask a question or describe what you need..."
          />
          {messages.length > 0 && (
            <button
              onClick={() => { setMessages([]); setInputValue(""); }}
              className="mr-1 rounded-lg border border-[#30363d] px-3 py-2 text-xs text-[#6e7681] hover:border-[#8b949e] hover:text-[#8b949e]"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#58a6ff] text-white transition hover:bg-[#79b8ff] disabled:opacity-50"
          >
            {Icons.send}
          </button>
        </div>
      </div>

      {/* Canvas Action Buttons - dim when focused */}
      <div className={cn("mt-4 transition-opacity duration-300", isActive && "opacity-25")}>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#6e7681]">Or start with</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {canvasActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onOpenCanvas(action.id)}
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-[#30363d] bg-[#21262d] p-3 text-[#8b949e] transition hover:border-[#58a6ff]/50 hover:bg-[#30363d] hover:text-[#f0f6fc]"
            >
              <span className="flex h-8 w-8 items-center justify-center">{action.icon}</span>
              <span className="text-xs font-medium text-[#f0f6fc]">{action.label}</span>
              <span className="hidden text-[10px] text-[#6e7681] sm:block">{action.description}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

// Demo-only version (no Tambo hooks)
function TamboPromptBoxDemoOnly({ vision, onOpenCanvas, onFocusChange }: { vision: Vision; onOpenCanvas: (canvas: CanvasType) => void; onFocusChange?: (focused: boolean) => void }) {
  const [inputValue, setInputValue] = React.useState("");
  const [messages, setMessages] = React.useState<Array<{ role: "user" | "assistant"; content: string; component?: React.ReactNode }>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Track focus state - focused when input focused OR has messages
  const isActive = isFocused || messages.length > 0;
  
  React.useEffect(() => {
    onFocusChange?.(isActive);
  }, [isActive, onFocusChange]);

  React.useEffect(() => {
    // Scroll within container only, not the whole page
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const detectCanvasIntent = (query: string): CanvasType | null => {
    const q = query.toLowerCase();
    if (q.includes("workflow") || q.includes("prepare board materials")) return "workflow";
    if (q.includes("draft") && (q.includes("document") || q.includes("memo") || q.includes("letter"))) return "document";
    if (q.includes("report") || q.includes("trend") || q.includes("attendance pattern") || q.includes("voting pattern")) return "reporting";
    if (q.includes("schedule") && (q.includes("meeting") || q.includes("call"))) return "meeting";
    if (q.includes("draft email") || q.includes("send email")) return "email";
    return null;
  };

  const getDemoResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("matter") || q.includes("litigation") || q.includes("smith")) {
      return "I found 2 active matters:\n\n• Smith v. Acme Holdings (Discovery phase, 73% favorable)\n  → Document production deadline: Feb 15\n\n• IP Licensing Dispute (Negotiation, settlement likely)\n  → Counter-proposal awaiting your review";
    }
    if (q.includes("contract") || q.includes("acme") || q.includes("renewal")) {
      return "Sarah Chen (Procurement) owns the Acme Corp relationship.\n\n• Master Services Agreement: $2.4M/year\n• Renewal date: March 15, 2025\n• Status: Renewal pending\n\nWould you like me to schedule a meeting with Sarah?";
    }
    if (q.includes("board") || q.includes("meeting")) {
      return "Your next board meeting is in 12 days (Feb 14).\n\nPreparation status:\n✓ Financial Results Review — Complete\n○ Equity Grant Approval — In progress\n○ Risk Assessment Update — Not started\n\nShould I open the workflow canvas to prepare materials?";
    }
    if (q.includes("who") || q.includes("owner")) {
      return "I searched across Third Party Manager, Entities, and Risk Manager.\n\nSarah Chen (Procurement) is the primary owner:\n• 98% confidence from Contract Manager\n• 92% confidence from Risk Manager";
    }
    return "I can help you with:\n• Active legal matters and litigation status\n• Contract renewals and vendor relationships\n• Board meeting preparation\n• Finding relationship owners across systems";
  };

  const handleSubmit = () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage = inputValue.trim();
    
    // All interactions stay in the prompt box - no modal redirects
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInputValue("");
    setIsLoading(true);
    setTimeout(() => {
      const demoComponent = generateCardsFromContent("", userMessage);
      setMessages(prev => [...prev, { role: "assistant", content: getDemoResponse(userMessage), component: demoComponent }]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <Card className={cn(
      "p-6 transition-all duration-300",
      isActive && "scale-[1.02] shadow-lg shadow-[#58a6ff]/10 ring-1 ring-[#58a6ff]/20"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={cn(
            "font-semibold text-[#f0f6fc] transition-all duration-300",
            isActive ? "text-xl" : "text-lg"
          )}>
            {vision === "near-term" ? "What do you need to do?" : "Direct your autonomous Legal AI workforce."}
          </h3>
          <p className={cn(
            "mt-1 text-[#8b949e] transition-all duration-300",
            isActive ? "text-base" : "text-sm"
          )}>
            Ask questions or choose an action below. Work entirely within Diligent.
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-[#d29922]/10 px-2 py-1 text-[10px] text-[#d29922]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d29922]" />Demo
        </span>
      </div>

      {/* Unified Chat Container */}
      <div className={cn(
        "mt-4 flex flex-col rounded-xl border bg-[#0d1117] transition-all duration-300",
        isActive ? "border-[#58a6ff]/50 ring-1 ring-[#58a6ff]/20" : "border-[#30363d]"
      )}>
        {/* Messages Area */}
        {messages.length > 0 && (
          <div ref={messagesContainerRef} className="max-h-[400px] space-y-3 overflow-y-auto p-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.role === "user" ? "flex justify-end" : ""}>
                {msg.role === "user" ? (
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#30363d] px-3 py-2">
                    <p className="whitespace-pre-wrap text-sm text-[#f0f6fc]">{msg.content}</p>
                  </div>
                ) : (
                  <div className="w-full space-y-2">
                    <div className="rounded-2xl rounded-bl-md border border-[#58a6ff]/20 bg-[#58a6ff]/5 px-3 py-2">
                      <p className="whitespace-pre-wrap text-sm text-[#f0f6fc]">{msg.content}</p>
                    </div>
                    {msg.component && <div>{msg.component}</div>}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#58a6ff]/20 bg-[#58a6ff]/5 px-3 py-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#58a6ff]" />
                <span className="text-xs text-[#8b949e]">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className={cn(
          "flex items-center gap-2 p-3",
          messages.length > 0 && "border-t border-[#30363d]"
        )}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            className="flex-1 bg-transparent px-2 py-2 text-base text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none"
            placeholder="Ask a question or describe what you need..."
          />
          {messages.length > 0 && (
            <button
              onClick={() => { setMessages([]); setInputValue(""); }}
              className="mr-1 rounded-lg border border-[#30363d] px-3 py-2 text-xs text-[#6e7681] hover:border-[#8b949e] hover:text-[#8b949e]"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#58a6ff] text-white transition hover:bg-[#79b8ff] disabled:opacity-50"
          >
            {Icons.send}
          </button>
        </div>
      </div>

      {/* Canvas Action Buttons - dim when focused */}
      <div className={cn("mt-4 transition-opacity duration-300", isActive && "opacity-25")}>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#6e7681]">Or start with</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {canvasActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onOpenCanvas(action.id)}
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-[#30363d] bg-[#21262d] p-3 text-[#8b949e] transition hover:border-[#58a6ff]/50 hover:bg-[#30363d] hover:text-[#f0f6fc]"
            >
              <span className="flex h-8 w-8 items-center justify-center">{action.icon}</span>
              <span className="text-xs font-medium text-[#f0f6fc]">{action.label}</span>
              <span className="hidden text-[10px] text-[#6e7681] sm:block">{action.description}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

// Wrapper that switches based on TamboProvider availability
function PromptBox({ vision, onOpenCanvas, hasTamboProvider, onFocusChange }: { vision: Vision; onOpenCanvas: (canvas: CanvasType) => void; hasTamboProvider: boolean; onFocusChange?: (focused: boolean) => void }) {
  if (!hasTamboProvider) return <TamboPromptBoxDemoOnly vision={vision} onOpenCanvas={onOpenCanvas} onFocusChange={onFocusChange} />;
  return <TamboPromptBoxWithHooks vision={vision} onOpenCanvas={onOpenCanvas} onFocusChange={onFocusChange} />;
}

// Mobile-optimized prompt button for iPhone
function MobilePromptButton({ vision, onOpenCanvas }: { vision: Vision; onOpenCanvas: (canvas: CanvasType) => void }) {
  return (
    <div className="space-y-3">
      <button 
        onClick={() => onOpenCanvas("search")}
        className={cn(
          "w-full rounded-2xl border p-4 text-left transition",
          vision === "future"
            ? "border-[#a371f7]/30 bg-[#a371f7]/5 hover:bg-[#a371f7]/10"
            : "border-[#30363d] bg-[#21262d] hover:bg-[#30363d]"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            vision === "future" ? "bg-[#a371f7]/20" : "bg-[#58a6ff]/20"
          )}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={vision === "future" ? "#a371f7" : "#58a6ff"} strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
              <path d="M12 12 2.1 9.1" />
              <path d="m12 12 3.9 7.8" />
              <path d="m12 12 7.8-3.9" />
            </svg>
          </div>
          <div className="flex-1">
            <p className={cn(
              "text-sm font-semibold",
              vision === "future" ? "text-[#a371f7]" : "text-[#f0f6fc]"
            )}>
              {vision === "future" ? "Direct AI Workforce" : "Ask Diligent AI"}
            </p>
            <p className="text-xs text-[#8b949e]">Tap to start</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e7681" strokeWidth="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </button>
      {/* Quick actions for mobile */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: "workflow" as CanvasType, icon: Icons.workflow, label: "Workflow" },
          { id: "document" as CanvasType, icon: Icons.document, label: "Document" },
          { id: "meeting" as CanvasType, icon: Icons.meeting, label: "Schedule" },
        ].map((action) => (
          <button
            key={action.id}
            onClick={() => onOpenCanvas(action.id)}
            className="flex flex-col items-center gap-1 rounded-xl border border-[#30363d] bg-[#21262d] p-2 text-[#8b949e] transition hover:bg-[#30363d] hover:text-[#f0f6fc]"
          >
            <span className="flex h-6 w-6 items-center justify-center">{action.icon}</span>
            <span className="text-[10px]">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Compact filings card for iPhone
function MobileFilingsCard() {
  return (
    <div className="rounded-2xl border border-[#f0883e]/30 bg-[#f0883e]/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0883e]/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f0883e" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M9 15l2 2 4-4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#f0f6fc]">3 filings ready</p>
            <p className="text-xs text-[#8b949e]">$395 total fees</p>
          </div>
        </div>
        <button className="rounded-xl border border-[#3fb950] bg-[#3fb950]/10 px-3 py-2 text-xs font-medium text-[#3fb950]">
          Review
        </button>
      </div>
    </div>
  );
}

// Compact risk signals card for iPhone
function MobileRiskSignalsCard() {
  return (
    <div className="rounded-2xl border border-[#a371f7]/30 bg-[#a371f7]/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a371f7]/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a371f7" strokeWidth="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#f0f6fc]">3 risk signals</p>
            <p className="text-xs text-[#8b949e]">Your input needed</p>
          </div>
        </div>
        <button className="rounded-xl border border-[#a371f7] bg-[#a371f7]/10 px-3 py-2 text-xs font-medium text-[#a371f7]">
          Review
        </button>
      </div>
    </div>
  );
}

// Dashboard content component to allow reuse in device frames
function DashboardContent({ 
  vision, 
  activityOpen, 
  setActivityOpen, 
  currentActivityLog,
  currentNextActions,
  currentWhatsNew,
  hoveredAgent,
  setHoveredAgent,
  popoverPos,
  setPopoverPos,
  popoverHovered,
  setPopoverHovered,
  tickerRef,
  device = "desktop",
  onOpenCanvas,
  hasTamboProvider = false,
  showChat = false,
  chatMessages = [],
  chatEndRef,
  onPromptSubmit,
  promptLoading = false,
  promptSuggestions = [],
}: {
  vision: Vision;
  activityOpen: boolean;
  setActivityOpen: (v: boolean) => void;
  currentActivityLog: string[];
  currentNextActions: typeof nextActions["near-term"] | typeof nextActions["future"];
  currentWhatsNew: typeof whatsNew["near-term"];
  hoveredAgent: AgentStatus | null;
  setHoveredAgent: (a: AgentStatus | null) => void;
  popoverPos: { x: number; y: number };
  setPopoverPos: (p: { x: number; y: number }) => void;
  popoverHovered: boolean;
  setPopoverHovered: (v: boolean) => void;
  tickerRef: React.RefObject<HTMLDivElement>;
  device?: DeviceType;
  onOpenCanvas: (canvas: CanvasType) => void;
  hasTamboProvider?: boolean;
  showChat?: boolean;
  chatMessages?: ChatMessage[];
  chatEndRef?: React.RefObject<HTMLDivElement>;
  onPromptSubmit?: (message: string) => void;
  promptLoading?: boolean;
  promptSuggestions?: string[];
}) {
  const isIphone = device === "iphone";
  const isIpad = device === "ipad";
  const isMobile = isIphone || isIpad;
  
  return (
    <div className={cn(
      "overflow-hidden rounded-3xl border shadow-sm transition-colors duration-300",
      vision === "future" 
        ? "border-[#a371f7]/30 bg-[#161b22]" 
        : "border-[#30363d] bg-[#161b22]",
      isMobile && "rounded-none border-0"
    )}>
      <div className={cn("px-6", isIphone && "px-4", isIpad && "px-5")}>
        <TopNav
          activityOpen={activityOpen}
          onToggleActivity={() => setActivityOpen(!activityOpen)}
          activityCount={currentActivityLog.length}
          vision={vision}
        />
        {activityOpen ? (
          <div className="-mt-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">Recent activity</p>
                  {vision === "future" && (
                    <span className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/10 px-2 py-0.5 text-[10px] text-[#a371f7]">AI-Enhanced</span>
                  )}
                </div>
                <button
                  onClick={() => setActivityOpen(false)}
                  className="rounded-lg border border-[#30363d] bg-[#161b22] px-2 py-1 text-xs text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]"
                >
                  Close
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {currentActivityLog.map((entry) => (
                  <div key={entry} className="flex items-start gap-3 rounded-xl border border-[#30363d] bg-[#21262d] px-3 py-2">
                    <div className={cn(
                      "mt-1 h-2 w-2 rounded-full",
                      vision === "future" ? "bg-[#a371f7]" : "bg-[#3fb950]"
                    )} />
                    <p className="text-sm text-[#8b949e]">{entry}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : null}

        {/* ALERT HERO - Emerging risks detected */}
        <header className={cn(
          "rounded-3xl border p-10 shadow-sm transition-all duration-300",
          "border-[#da3633]/40 bg-gradient-to-br from-[#da3633]/10 to-[#0d1117]",
          isIphone && "p-5 rounded-2xl",
          isIpad && "p-6 rounded-2xl",
        )}>
          {/* Alert badge */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#da3633]/50 bg-[#da3633]/20 px-4 py-1.5 text-sm font-medium text-[#ff7b72]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#da3633] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#da3633]"></span>
              </span>
              Agents Detected Emerging Risks
            </span>
          </div>
          
          <h1 className={cn(
            "text-center text-4xl font-semibold tracking-tight text-[#f0f6fc]",
            isIphone && "text-xl",
            isIpad && "text-2xl"
          )}>
            3 risks require disclosure review
          </h1>
          <p className="mt-4 text-center text-sm text-[#8b949e] max-w-2xl mx-auto">
            Your monitoring agents detected emerging risks that may not be adequately disclosed in current SEC filings 
            or Board meeting materials. Review recommended before the Feb 28 Board meeting.
          </p>
          
          {/* Risk severity summary */}
          <div className={cn(
            "mt-6 flex justify-center gap-4",
            isIphone && "mt-4 flex-wrap gap-2",
            isIpad && "gap-3"
          )}>
            <div className={cn(
              "rounded-xl border border-[#da3633]/40 bg-[#da3633]/10 px-4 py-2 text-center",
              isIphone && "flex-1 min-w-[90px] px-2"
            )}>
              <p className={cn("text-2xl font-semibold text-[#da3633]", isIphone && "text-xl")}>1</p>
              <p className={cn("text-xs text-[#8b949e]", isIphone && "text-[10px]")}>Critical</p>
            </div>
            <div className={cn(
              "rounded-xl border border-[#d29922]/40 bg-[#d29922]/10 px-4 py-2 text-center",
              isIphone && "flex-1 min-w-[90px] px-2"
            )}>
              <p className={cn("text-2xl font-semibold text-[#d29922]", isIphone && "text-xl")}>2</p>
              <p className={cn("text-xs text-[#8b949e]", isIphone && "text-[10px]")}>High</p>
            </div>
            <div className={cn(
              "rounded-xl border border-[#58a6ff]/40 bg-[#58a6ff]/10 px-4 py-2 text-center",
              isIphone && "flex-1 min-w-[90px] px-2"
            )}>
              <p className={cn("text-2xl font-semibold text-[#58a6ff]", isIphone && "text-xl")}>3</p>
              <p className={cn("text-xs text-[#8b949e]", isIphone && "text-[10px]")}>Filings Affected</p>
            </div>
          </div>

          {/* Workflow progress indicator */}
          {!isIphone && (
            <div className="mt-8 border-t border-[#30363d] pt-6">
              <p className="text-xs text-center uppercase tracking-wider text-[#6e7681] mb-4">Response Workflow</p>
              <div className="flex items-center justify-center gap-2">
                {riskWorkflowStages.map((stage, idx) => (
                  <React.Fragment key={stage.id}>
                    <div className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs",
                      stage.status === "completed" && "bg-[#3fb950]/20 text-[#3fb950]",
                      stage.status === "current" && "bg-[#d29922]/20 text-[#d29922] ring-2 ring-[#d29922]/50",
                      stage.status === "pending" && "bg-[#21262d] text-[#6e7681]"
                    )}>
                      {stage.status === "completed" && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                      {stage.status === "current" && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d29922] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d29922]"></span>
                        </span>
                      )}
                      <span className="font-medium">{stage.label}</span>
                    </div>
                    {idx < riskWorkflowStages.length - 1 && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stage.status === "completed" ? "#3fb950" : "#30363d"} strokeWidth="2">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Agent ticker - hidden on iPhone */}
        {!isIphone && (
          <div
            className={cn(
              "ticker-strip relative mt-4 rounded-2xl border px-4 py-2 transition-all duration-300",
              vision === "future"
                ? "border-[#a371f7]/30 bg-[#a371f7]/5"
                : "border-[#30363d] bg-[#21262d]",
            )}
            ref={tickerRef}
            onMouseLeave={() => {
              if (!popoverHovered) {
                setHoveredAgent(null);
              }
            }}
          >
            <div className="flex items-center gap-3">
              <span className={cn(
                "shrink-0 text-xs font-medium uppercase tracking-[0.2em]",
                vision === "future" ? "text-[#a371f7]" : "text-[#6e7681]"
              )}>
                {vision === "future" ? "AI Legal Agents" : "Legal Monitoring Agents"}
              </span>
              <div className="relative flex-1 overflow-hidden">
                <div className="ticker-track flex w-max items-center gap-6">
                  {[...agents, ...agents].map((agent, idx) => (
                    <div
                      key={`${agent.name}-${idx}`}
                      className="whitespace-nowrap text-sm text-[#8b949e]"
                      onMouseEnter={(event) => {
                        const bounds = tickerRef.current?.getBoundingClientRect();
                        if (!bounds) return;
                        setHoveredAgent(agent);
                        setPopoverPos({
                          x: event.clientX - bounds.left,
                          y: event.clientY - bounds.top,
                        });
                      }}
                    >
                      <span className="font-medium text-[#f0f6fc]">{agent.name}</span>
                      <span className="mx-2 text-[#6e7681]">·</span>
                      <span className="text-[#6e7681]">Last {agent.lastRun}, next {agent.nextRun}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {hoveredAgent && !isMobile ? (
            <div
              className={cn(
                "pointer-events-auto absolute z-20 w-80 rounded-2xl border p-4 text-left text-sm shadow-lg transition-colors duration-300",
                vision === "future"
                  ? "border-[#a371f7]/30 bg-[#161b22]"
                  : "border-[#30363d] bg-[#161b22]"
              )}
              style={{
                left: popoverPos.x,
                top: popoverPos.y + 16,
                transform: "translateX(-50%)",
              }}
              onMouseEnter={() => setPopoverHovered(true)}
              onMouseLeave={() => {
                setPopoverHovered(false);
                setHoveredAgent(null);
              }}
            >
              <div className="flex items-center justify-between">
                <div className={cn(
                  "text-xs uppercase tracking-[0.2em]",
                  vision === "future" ? "text-[#a371f7]" : "text-[#6e7681]"
                )}>
                  {vision === "future" ? "AI Agent Capabilities" : "Agent Criteria"}
                </div>
                {vision === "future" && (
                  <span className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/10 px-2 py-0.5 text-[10px] text-[#a371f7]">Autonomous</span>
                )}
              </div>
              <div className="mt-2 text-base font-semibold text-[#f0f6fc]">{hoveredAgent.name}</div>
              <p className="mt-1 text-sm text-[#8b949e]">
                {vision === "future" && hoveredAgent.futureNote ? hoveredAgent.futureNote : hoveredAgent.note}
              </p>
              <div className="mt-3 space-y-1 text-xs text-[#8b949e]">
                {(vision === "future" && hoveredAgent.futureCriteria ? hoveredAgent.futureCriteria : hoveredAgent.criteria).map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className={cn(
                      "mt-1 h-1.5 w-1.5 rounded-full",
                      vision === "future" ? "bg-[#a371f7]" : "bg-[#6e7681]"
                    )} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <a
                  href="#"
                  className="inline-flex items-center rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs font-medium text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]"
                >
                  {vision === "future" ? "Configure AI" : "Edit agent"}
                </a>
                <a
                  href="#"
                  className={cn(
                    "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium",
                    vision === "future"
                      ? "border-[#a371f7] bg-[#a371f7] text-white hover:bg-[#8b5cf6]"
                      : "border-[#58a6ff] bg-[#58a6ff] text-[#0d1117] hover:bg-[#79b8ff]"
                  )}
                >
                  {vision === "future" ? "Review AI output" : "View activity"}
                </a>
              </div>
            </div>
          ) : null}
          <style jsx>{`
            .ticker-track {
              animation: ticker 90s linear infinite;
            }
            .ticker-strip:hover .ticker-track {
              animation-play-state: paused;
            }
            @keyframes ticker {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @media (prefers-reduced-motion: reduce) {
              .ticker-track { animation: none; }
            }
            `}</style>
          </div>
        )}

        {/* DETECTED RISKS SECTION - Main content area */}
        {!isIphone && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-[#f0f6fc]">Detected Risks Requiring Review</h2>
                <span className="rounded-full border border-[#da3633]/40 bg-[#da3633]/10 px-2 py-0.5 text-xs font-medium text-[#da3633]">
                  {detectedRisks.length} risks
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href="/now/agentic-hero/superhero/reviewer"
                  className="rounded-lg border border-[#30363d] bg-[#21262d] px-4 py-1.5 text-xs font-medium text-[#f0f6fc] hover:bg-[#30363d] hover:border-[#8b949e] transition-colors"
                >
                  Review detection sources
                </a>
                <a 
                  href="/now/agentic-hero/superhero/coordinator"
                  className="rounded-lg border border-[#58a6ff] bg-[#58a6ff]/10 px-4 py-1.5 text-xs font-medium text-[#58a6ff] hover:bg-[#58a6ff]/20"
                >
                  Assign Owners →
                </a>
              </div>
            </div>
            
            <div className="space-y-4">
              {detectedRisks.map((risk) => (
                <React.Fragment key={risk.id}>
                <Card className={cn(
                  "p-0 overflow-hidden",
                  risk.severity === "critical" && "border-[#da3633]/40",
                  risk.severity === "high" && "border-[#d29922]/40"
                )}>
                  {/* Risk header */}
                  <div className={cn(
                    "flex items-start justify-between gap-4 px-5 py-4",
                    risk.severity === "critical" && "bg-gradient-to-r from-[#da3633]/10 to-transparent",
                    risk.severity === "high" && "bg-gradient-to-r from-[#d29922]/10 to-transparent"
                  )}>
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        risk.severity === "critical" && "bg-[#da3633]/20",
                        risk.severity === "high" && "bg-[#d29922]/20",
                        risk.severity === "medium" && "bg-[#f0883e]/20"
                      )}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={
                          risk.severity === "critical" ? "#da3633" : 
                          risk.severity === "high" ? "#d29922" : "#f0883e"
                        } strokeWidth="2">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <path d="M12 9v4M12 17h.01" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-[#f0f6fc]">{risk.title}</h3>
                          <span className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase",
                            risk.severity === "critical" && "border-[#da3633]/50 bg-[#da3633]/20 text-[#da3633]",
                            risk.severity === "high" && "border-[#d29922]/50 bg-[#d29922]/20 text-[#d29922]",
                            risk.severity === "medium" && "border-[#f0883e]/50 bg-[#f0883e]/20 text-[#f0883e]"
                          )}>
                            {risk.severity}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[#6e7681]">
                          <span>{risk.source}</span>
                          <span>·</span>
                          <span>{risk.detectedAt}</span>
                        </div>
                        <p className="mt-2 text-sm text-[#8b949e]">{risk.summary}</p>
                      </div>
                    </div>
                  </div>

                  {/* Disclosure gap analysis */}
                  <div className="border-t border-[#30363d] bg-[#0d1117]/50 px-5 py-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-[#6e7681] mb-2">Current Disclosure</p>
                        <p className="text-sm text-[#8b949e] bg-[#21262d] rounded-lg p-3 border border-[#30363d]">
                          {risk.currentDisclosure || <span className="italic text-[#6e7681]">No specific disclosure found</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-[#da3633] mb-2 flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4M12 16h.01" />
                          </svg>
                          Disclosure Gap
                        </p>
                        <p className="text-sm text-[#f0f6fc] bg-[#da3633]/10 rounded-lg p-3 border border-[#da3633]/30">
                          {risk.disclosureGap}
                        </p>
                      </div>
                    </div>
                    
                    {/* Affected filings */}
                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-[#6e7681]">Affected filings:</span>
                      {risk.affectedFilings.map((filing) => (
                        <span key={filing} className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e]">
                          {filing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommended action */}
                  <div className="border-t border-[#30363d] px-5 py-3 flex items-center justify-between bg-[#161b22]">
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                      <span className="text-xs text-[#8b949e]">
                        <span className="text-[#3fb950] font-medium">Recommended:</span> {risk.recommendedAction}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">
                        View Details
                      </button>
                      <button 
                        onClick={() => onOpenCanvas("document")}
                        className="rounded-lg border border-[#58a6ff] bg-[#58a6ff]/10 px-3 py-1.5 text-xs font-medium text-[#58a6ff] hover:bg-[#58a6ff]/20"
                      >
                        Draft Update
                      </button>
                    </div>
                  </div>
                </Card>
                </React.Fragment>
              ))}
            </div>
          </section>
        )}

        {/* Mobile risk summary for iPhone */}
        {isIphone && (
          <section className="mt-6 space-y-3">
            {detectedRisks.map((risk) => (
              <div key={risk.id} className={cn(
                "rounded-2xl border p-4",
                risk.severity === "critical" && "border-[#da3633]/40 bg-[#da3633]/5",
                risk.severity === "high" && "border-[#d29922]/40 bg-[#d29922]/5"
              )}>
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    risk.severity === "critical" && "bg-[#da3633]/20",
                    risk.severity === "high" && "bg-[#d29922]/20"
                  )}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={
                      risk.severity === "critical" ? "#da3633" : "#d29922"
                    } strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <path d="M12 9v4M12 17h.01" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#f0f6fc]">{risk.title}</p>
                    <p className="text-xs text-[#8b949e] mt-1">{risk.summary.substring(0, 80)}...</p>
                    <button className="mt-2 text-xs font-medium text-[#58a6ff]">
                      Review →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Quick Actions for Risk Response */}
        {!isIphone && (
          <section className="mt-8">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#f0f6fc]">Risk Response Actions</h3>
                <span className="text-xs text-[#6e7681]">Complete these steps to address detected risks</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <button 
                  onClick={() => onOpenCanvas("document")}
                  className="flex items-center gap-3 rounded-xl border border-[#30363d] bg-[#21262d] p-4 text-left hover:border-[#58a6ff]/50 hover:bg-[#30363d] transition"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#58a6ff]/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6M12 18v-6M9 15h6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#f0f6fc]">Draft 10K Updates</p>
                    <p className="text-xs text-[#6e7681]">AI-assisted risk factor drafting</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => onOpenCanvas("reporting")}
                  className="flex items-center gap-3 rounded-xl border border-[#30363d] bg-[#21262d] p-4 text-left hover:border-[#58a6ff]/50 hover:bg-[#30363d] transition"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#a371f7]/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a371f7" strokeWidth="2">
                      <path d="M18 20V10M12 20V4M6 20v-6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#f0f6fc]">Compare Disclosures</p>
                    <p className="text-xs text-[#6e7681]">Gap analysis vs. current filings</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => onOpenCanvas("email")}
                  className="flex items-center gap-3 rounded-xl border border-[#30363d] bg-[#21262d] p-4 text-left hover:border-[#58a6ff]/50 hover:bg-[#30363d] transition"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3fb950]/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 6-10 7L2 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#f0f6fc]">Notify Board</p>
                    <p className="text-xs text-[#6e7681]">Draft memo to Audit Committee</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => onOpenCanvas("workflow")}
                  className="flex items-center gap-3 rounded-xl border border-[#30363d] bg-[#21262d] p-4 text-left hover:border-[#58a6ff]/50 hover:bg-[#30363d] transition"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f0883e]/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f0883e" strokeWidth="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#f0f6fc]">Start Full Workflow</p>
                    <p className="text-xs text-[#6e7681]">Coordinate all stakeholders</p>
                  </div>
                </button>
              </div>
            </Card>
          </section>
        )}

        {/* Stakeholder Coordination Panel */}
        {!isIphone && (
          <section className="mt-8">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#f0f6fc]">Stakeholders to Involve</h3>
                <button className="text-xs text-[#58a6ff] hover:underline">
                  Add stakeholder +
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-[#30363d] bg-[#21262d] p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a371f7]" />
                    <div>
                      <p className="text-sm font-medium text-[#f0f6fc]">Sarah Chen</p>
                      <p className="text-xs text-[#6e7681]">Securities Counsel</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-[#8b949e]">Review 10K disclosure language and materiality assessment</p>
                  <button className="mt-3 w-full rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">
                    Assign Task
                  </button>
                </div>
                
                <div className="rounded-xl border border-[#30363d] bg-[#21262d] p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#3fb950] to-[#58a6ff]" />
                    <div>
                      <p className="text-sm font-medium text-[#f0f6fc]">Michael Torres</p>
                      <p className="text-xs text-[#6e7681]">CFO</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-[#8b949e]">Financial impact assessment and MD&A implications</p>
                  <button className="mt-3 w-full rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">
                    Assign Task
                  </button>
                </div>
                
                <div className="rounded-xl border border-[#30363d] bg-[#21262d] p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#f0883e] to-[#da3633]" />
                    <div>
                      <p className="text-sm font-medium text-[#f0f6fc]">Board Audit Committee</p>
                      <p className="text-xs text-[#6e7681]">3 members</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-[#8b949e]">Risk oversight and disclosure approval</p>
                  <button className="mt-3 w-full rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">
                    Schedule Briefing
                  </button>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Keep some of the original sections but update for the scenario */}
        {/* Future: Cross-Diligent Risk Signals - full on desktop/iPad - HIDDEN since we have new risk UI */}
        {false && vision === "future" && !isIphone && (
          <section className="mt-8">
            <Card className="p-0 overflow-hidden border-[#a371f7]/20">
              <div className="flex items-center justify-between border-b border-[#a371f7]/20 bg-gradient-to-r from-[#a371f7]/5 to-transparent px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#a371f7]/10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#a371f7" strokeWidth="2"/>
                      <path d="M12 16v-4M12 8h.01" stroke="#a371f7" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#f0f6fc]">Cross-Diligent risk signals awaiting your input</h3>
                    <p className="text-xs text-[#8b949e]">Your legal perspective is needed across the enterprise</p>
                  </div>
                </div>
                <span className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/10 px-2 py-0.5 text-xs font-medium text-[#a371f7]">
                  {riskSignals.length} requests
                </span>
              </div>
              <div className="divide-y divide-[#30363d]">
                {riskSignals.map((signal) => (
                  <div key={signal.title} className="px-5 py-4 hover:bg-[#a371f7]/5">
                    <div className={cn(
                      "flex items-start justify-between gap-4",
                      isIpad && "flex-col"
                    )}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full border border-[#58a6ff]/30 bg-[#58a6ff]/10 px-2 py-0.5 text-[10px] font-medium text-[#58a6ff]">
                            {signal.source}
                          </span>
                          <span className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                            signal.impact === "High" 
                              ? "border-[#da3633]/30 bg-[#da3633]/10 text-[#da3633]"
                              : "border-[#f0883e]/30 bg-[#f0883e]/10 text-[#f0883e]"
                          )}>
                            {signal.impact} Impact
                          </span>
                        </div>
                        <h4 className="mt-2 text-sm font-medium text-[#f0f6fc]">{signal.title}</h4>
                        <p className="mt-1 text-sm text-[#8b949e]">{signal.detail}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-[#6e7681]">
                          <span>Requested by {signal.requestedBy}</span>
                          <span>·</span>
                          <span>Due {signal.dueDate}</span>
                        </div>
                      </div>
                      <button className={cn(
                        "shrink-0 rounded-xl border border-[#a371f7] bg-[#a371f7]/10 px-3 py-2 text-sm font-medium text-[#a371f7] hover:bg-[#a371f7]/20",
                        isIpad && "w-full mt-3"
                      )}>
                        Contribute
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#a371f7]/20 bg-gradient-to-r from-[#a371f7]/5 to-transparent px-5 py-3">
                <p className="text-xs text-[#8b949e]">
                  <span className="text-[#a371f7]">AI Insight:</span> Your legal risk assessments will automatically propagate to Risk Manager, updating the enterprise risk register in real-time.
                </p>
              </div>
            </Card>
          </section>
        )}

        {/* Future: Compact risk signals for iPhone */}
        {vision === "future" && isIphone && (
          <section className="mt-6">
            <MobileRiskSignalsCard />
          </section>
        )}

        <section className="mt-10">
          <SectionHeader 
            title={vision === "future" 
              ? "Your AI workspace at a glance" 
              : "Pick up where you left off"
            }
            description={vision === "near-term" 
              ? "Continue working in your Diligent applications"
              : undefined
            }
          />
          <div className={cn(
            "mt-5 grid gap-3",
            device === "desktop" && "md:grid-cols-2",
            isIpad && "grid-cols-2"
          )}>
            {recentApps[vision].map((app) => (
              <a
                key={app.name}
                href="#"
                className={cn(
                  "group block rounded-2xl border px-4 py-3 shadow-sm transition hover:-translate-y-[1px]",
                  vision === "future"
                    ? "border-[#a371f7]/20 bg-[#161b22] hover:border-[#a371f7]/40 hover:bg-[#a371f7]/5"
                    : "border-[#30363d] bg-[#161b22] hover:border-[#58a6ff]/50 hover:bg-[#21262d]"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-[#f0f6fc]">{app.name}</h3>
                      {"tag" in app && (
                        <span className="rounded-full border border-[#a371f7]/40 bg-[#a371f7]/10 px-2 py-0.5 text-[10px] font-medium text-[#a371f7]">{app.tag}</span>
                      )}
                      <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-[11px] text-[#8b949e]">{app.lastUsed}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#8b949e]">{app.description}</p>
                  </div>
                  <span className={cn(
                    "text-xs uppercase tracking-[0.2em] opacity-0 transition group-hover:opacity-100",
                    vision === "future" ? "text-[#a371f7]" : "text-[#6e7681]"
                  )}>
                    {vision === "future" ? "Review" : "Open"}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Chat Thread - appears when user submits a prompt */}
        {showChat && chatMessages.length > 0 && (
          <section className={cn(
            "mt-10 border-t border-[#30363d] pt-6 px-5",
            isIphone && "mt-6 px-4 pt-4"
          )}>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white flex-shrink-0 p-0.5">
                <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
                  <path d="M20.1006 15.6877C20.0186 15.8056 19.9338 15.9211 19.8467 16.0364C19.5697 16.4006 19.2675 16.7474 18.9443 17.0706C17.5077 18.5072 15.6393 19.5107 13.5459 19.8596L6.03223 12.345L8.3877 9.98755H8.38965L8.39258 9.98462L20.1006 15.6877Z" fill="#D3222A"/>
                  <path d="M20.0259 4.21263C21.1905 5.84672 21.8735 7.84495 21.8735 9.99974C21.8735 12.116 21.2194 14.0737 20.1011 15.6872L8.39209 9.98412L20.0259 4.21263Z" fill="#EE312E"/>
                  <path d="M13.5454 19.8581C13.0018 19.9504 12.4428 19.9997 11.8735 19.9997H3.69971L4.89307 13.4802L6.03174 12.3445L13.5454 19.8581Z" fill="#AF292E"/>
                  <path d="M7.40379 10.0005L4.93727 11.2296L3.69979 13.7003L2.46653 11.2296L0 10.0005L2.46653 8.76302L3.69979 6.29649L3.71242 6.31754L4.93727 8.76302L7.40379 10.0005Z" fill="#1E1E1E"/>
                  <path d="M13.5435 0.141312C16.0395 0.559546 18.2228 1.90387 19.7261 3.80733C19.8311 3.94057 19.9311 4.07423 20.0259 4.2126L8.39209 9.98409H8.38623L6.04443 7.63936L13.5435 0.141312Z" fill="#D3222A"/>
                  <path d="M11.8735 0C12.4429 2.15682e-05 12.9997 0.0482901 13.5435 0.140625L6.04443 7.63965L4.88232 6.47754L3.69971 0H11.8735Z" fill="#AF292E"/>
                  <path d="M9.65975 9.99958L4.55273 4.89256V6.5949L7.53183 9.99958L4.55273 12.9787V15.1066L9.65975 9.99958Z" fill="#F8F8FA"/>
                  <path d="M9.65975 9.99958L4.55273 4.89256V6.5949L7.53183 9.99958L4.55273 12.9787V15.1066L9.65975 9.99958Z" fill="#F8F8FA"/>
                  <path d="M9.65975 9.99958L4.55273 4.89256V6.5949L7.53183 9.99958L4.55273 12.9787V15.1066L9.65975 9.99958Z" fill="#F8F8FA"/>
                  <path d="M9.65975 9.99958L4.55273 4.89256V6.5949L7.53183 9.99958L4.55273 12.9787V15.1066L9.65975 9.99958Z" fill="#F8F8FA"/>
                  <path d="M9.66016 9.99998L4.55273 15.1064V12.9785L7.53223 9.99998L4.55273 6.59471V4.89256L9.66016 9.99998Z" fill="#F8F8FA"/>
                </svg>
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-[#6e7681]">AI Assistant</span>
            </div>
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <React.Fragment key={message.id}>
                  <ChatMessageBubble message={message} />
                </React.Fragment>
              ))}
              <div ref={chatEndRef} />
            </div>
            {/* Inline prompt box - attached to chat when active */}
            {onPromptSubmit && (
              <PinnedPromptBox
                onSubmit={onPromptSubmit}
                isLoading={promptLoading ?? false}
                suggestions={promptSuggestions ?? []}
                inline
              />
            )}
          </section>
        )}

        {/* Footer - System log (hidden when chat is active) */}
        {!showChat && (
          <footer className={cn(
            "mt-14 border-t border-[#30363d] bg-[#0d1117] px-5 py-5",
            isIphone && "mt-8 px-4 py-4"
          )}>
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#6e7681]">System log</p>
                {!isIphone && (
                  <p className="mt-1 text-sm text-[#8b949e]">
                    {vision === "future" 
                      ? "AI agent activity (last 24 hours)"
                      : "Recent system activity (last 24 hours)"
                    }
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {/* Show only 3 entries on iPhone */}
              {(isIphone ? currentActivityLog.slice(0, 3) : currentActivityLog).map((entry) => (
                <div key={entry} className={cn(
                  "flex items-start gap-3 text-sm text-[#8b949e]",
                  isIphone && "text-xs"
                )}>
                  <span className={cn(
                    "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                    vision === "future" ? "bg-[#a371f7]" : "bg-[#3fb950]"
                  )} />
                  <span>{entry}</span>
                </div>
              ))}
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

// Main page content component
function PageContent({ hasTamboProvider = false }: { hasTamboProvider?: boolean }) {
  const [vision, setVision] = React.useState<Vision>("near-term");
  const [device, setDevice] = React.useState<DeviceType>("desktop");
  const [activityOpen, setActivityOpen] = React.useState(false);
  const [hoveredAgent, setHoveredAgent] = React.useState<AgentStatus | null>(null);
  const [popoverPos, setPopoverPos] = React.useState({ x: 0, y: 0 });
  const [popoverHovered, setPopoverHovered] = React.useState(false);
  const tickerRef = React.useRef<HTMLDivElement>(null);
  
  // Canvas state
  const [activeCanvas, setActiveCanvas] = React.useState<CanvasType>("none");
  const [canvasPrompt, setCanvasPrompt] = React.useState("");
  
  // Prompt box and chat state
  const [promptLoading, setPromptLoading] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = React.useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    "Assign risks to owners",
    "Draft 10-K disclosure updates",
    "Summarize for the board",
  ];

  // Generate assignment suggestions
  const generateAssignmentSuggestions = (): AssignmentSuggestion[] => [
    {
      riskId: "risk-taiwan",
      riskName: "Taiwan Strait Geopolitical Tensions",
      severity: "critical",
      primarySuggestion: PEOPLE_DATABASE.find(p => p.id === "diana-reyes")!,
      alternativeSuggestions: [
        PEOPLE_DATABASE.find(p => p.id === "tom-nguyen")!,
        PEOPLE_DATABASE.find(p => p.id === "michael-torres")!,
        PEOPLE_DATABASE.find(p => p.id === "rachel-green")!,
      ],
    },
    {
      riskId: "risk-vendor",
      riskName: "Critical Vendor Cybersecurity Breach",
      severity: "high",
      primarySuggestion: PEOPLE_DATABASE.find(p => p.id === "marcus-webb")!,
      alternativeSuggestions: [
        PEOPLE_DATABASE.find(p => p.id === "james-park")!,
        PEOPLE_DATABASE.find(p => p.id === "lisa-wang")!,
        PEOPLE_DATABASE.find(p => p.id === "sarah-chen")!,
      ],
    },
    {
      riskId: "risk-dma",
      riskName: "EU Digital Markets Act Enforcement",
      severity: "high",
      primarySuggestion: PEOPLE_DATABASE.find(p => p.id === "james-park")!,
      alternativeSuggestions: [
        PEOPLE_DATABASE.find(p => p.id === "sarah-chen")!,
        PEOPLE_DATABASE.find(p => p.id === "michael-torres")!,
        PEOPLE_DATABASE.find(p => p.id === "rachel-green")!,
      ],
    },
  ];

  const router = useRouter();

  const handleConfirmAssignments = (assignments: Record<string, string>) => {
    // Navigate to coordinator page to complete the assign-owners workflow
    router.push("/now/agentic-hero/superhero/coordinator");
  };

  const handlePromptSubmit = (message: string) => {
    // Show chat area
    setShowChat(true);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, userMessage]);
    setPromptLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const suggestions = generateAssignmentSuggestions();
      
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: "I've matched the 3 detected risks with owners based on expertise and recent activity. Click any risk to see alternatives:",
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        component: (
          <InlineAssignmentCard 
            suggestions={suggestions} 
            onConfirm={handleConfirmAssignments}
          />
        ),
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
      setPromptLoading(false);
      
      // Scroll to bottom
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 1200);
  };

  // Scroll chat when messages change
  React.useEffect(() => {
    if (chatMessages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleOpenCanvas = (canvas: CanvasType, prompt?: string) => {
    setActiveCanvas(canvas);
    setCanvasPrompt(prompt || "");
  };

  const handleCloseCanvas = () => {
    setActiveCanvas("none");
    setCanvasPrompt("");
  };

  const currentActivityLog = activityLog[vision];
  const currentNextActions = nextActions[vision];
  const currentWhatsNew = whatsNew[vision];

  const dashboardProps = {
    vision,
    activityOpen,
    setActivityOpen,
    currentActivityLog,
    currentNextActions,
    currentWhatsNew,
    hoveredAgent,
    setHoveredAgent,
    popoverPos,
    setPopoverPos,
    popoverHovered,
    setPopoverHovered,
    tickerRef,
    onOpenCanvas: handleOpenCanvas,
    hasTamboProvider,
    // Chat props
    showChat,
    chatMessages,
    chatEndRef,
    onPromptSubmit: handlePromptSubmit,
    promptLoading,
    promptSuggestions,
  };

  // Render active canvas
  const renderCanvas = () => {
    switch (activeCanvas) {
      case "workflow":
        return <WorkflowCanvas onClose={handleCloseCanvas} initialPrompt={canvasPrompt} />;
      case "document":
        return <DocumentCanvas onClose={handleCloseCanvas} initialPrompt={canvasPrompt} />;
      case "reporting":
        return <ReportingCanvas onClose={handleCloseCanvas} initialPrompt={canvasPrompt} />;
      case "search":
        return <SearchCanvas onClose={handleCloseCanvas} initialPrompt={canvasPrompt} />;
      case "meeting":
        return <MeetingCanvas onClose={handleCloseCanvas} initialPrompt={canvasPrompt} />;
      case "email":
        return <EmailCanvas onClose={handleCloseCanvas} initialPrompt={canvasPrompt} />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("min-h-screen bg-[#0d1117]", showChat ? "pb-6" : "pb-28")}>
      {/* Canvas overlay */}
      {activeCanvas !== "none" && renderCanvas()}
      
      {/* Main dashboard (hidden when canvas is active) */}
      {activeCanvas === "none" && (
        <>
          <PrototypeNav 
            vision={vision} 
            onVisionChange={setVision} 
            device={device}
            onDeviceChange={setDevice}
          />
          
          {device === "desktop" ? (
            <div className="mx-auto w-full max-w-6xl px-6 py-6">
              <DashboardContent {...dashboardProps} device="desktop" />
            </div>
          ) : device === "ipad" ? (
            <div className="flex justify-center overflow-x-auto bg-[#0d1117] px-4">
              <IPadFrame>
                <DashboardContent {...dashboardProps} device="ipad" />
              </IPadFrame>
            </div>
          ) : (
            <div className="flex justify-center overflow-x-auto bg-[#0d1117] px-4">
              <IPhoneFrame>
                <DashboardContent {...dashboardProps} device="iphone" />
              </IPhoneFrame>
            </div>
          )}
          
          {/* Pinned Prompt Box - fixed at bottom when no chat; inline when chat active */}
          {!showChat && (
            <PinnedPromptBox 
              onSubmit={handlePromptSubmit}
              isLoading={promptLoading}
              suggestions={promptSuggestions}
            />
          )}
        </>
      )}
    </div>
  );
}

// Main export (running in demo mode - Tambo not available in VibeSharing)
export default function Page() {
  return <PageContent hasTamboProvider={false} />;
}
