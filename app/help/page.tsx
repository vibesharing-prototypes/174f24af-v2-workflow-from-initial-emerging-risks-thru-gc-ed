import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Troubleshooting & Help — GC Command Center",
  description:
    "Common issues and how to fix them. Paste any section into Claude or ChatGPT along with your error for guided help.",
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface HelpItem {
  problem: string;
  solution: string;
}

interface HelpSection {
  category: string;
  icon: string;
  items: HelpItem[];
}

const sections: HelpSection[] = [
  {
    category: "Deploy Tokens",
    icon: "🔑",
    items: [
      {
        problem: "What is a deploy token and where do I find it?",
        solution:
          "A deploy token authenticates your CLI or CI pipeline with VibeSharing. Find it in your project's Dashboard → Settings → Deploy Tokens. Each token is scoped to one prototype.",
      },
      {
        problem: '"Invalid deploy token" / "Unauthorized" errors',
        solution:
          "Make sure your token starts with vs_. Tokens that don't match this format are either expired or copied incorrectly. Regenerate from Dashboard → Settings → Deploy Tokens.",
      },
      {
        problem: "Token format — must start with vs_",
        solution:
          "All valid deploy tokens begin with the prefix vs_. If yours doesn't, you may be using an older token or a different credential (e.g. a Vercel token). Generate a fresh one from the dashboard.",
      },
      {
        problem: "CLI can't find token",
        solution:
          "The CLI resolves tokens in this priority order: --token flag → VIBESHARING_TOKEN environment variable → ~/.vibesharing/token file. Verify the value at the highest-priority source you're using.",
      },
    ],
  },
  {
    category: "Vercel & Deployment",
    icon: "▲",
    items: [
      {
        problem: '"No Vercel token configured"',
        solution:
          "An admin needs to set the VERCEL_TOKEN environment variable in the VibeSharing server environment (or .env). This is a Vercel personal access token with deploy permissions.",
      },
      {
        problem: "Prototype deploys but URL doesn't load",
        solution:
          "Vercel Deployment Protection (SSO) may still be enabled on the project. Go to Vercel → Project Settings → Deployment Protection and disable it, or allowlist the public.",
      },
      {
        problem: "URL looks wrong / truncated",
        solution:
          "Vercel truncates long project names when generating aliases. VibeSharing polls for the actual alias but this can time out. Check the Vercel dashboard for the real URL, or shorten the prototype name.",
      },
      {
        problem: "Webhook not triggering redeployment",
        solution:
          "Redeployment webhooks must be configured manually in Vercel Project Settings → Git → Deploy Hooks. Create a hook and paste the URL into VibeSharing's prototype settings.",
      },
    ],
  },
  {
    category: "GitHub & Git",
    icon: "🐙",
    items: [
      {
        problem: '"GitHub not connected"',
        solution:
          "Authorize VibeSharing via OAuth: go to Dashboard → Settings → Integrations → GitHub and click Connect. You'll be redirected to GitHub to grant access.",
      },
      {
        problem: '"Service account not configured"',
        solution:
          "The GITHUB_SERVICE_TOKEN environment variable is missing from the server. An admin needs to create a GitHub personal access token (with repo scope) and set it in the environment.",
      },
      {
        problem: '"API rate limit exceeded"',
        solution:
          "Without authentication GitHub allows only 60 requests/hour. Set the GITHUB_TOKEN environment variable to a personal access token to increase the limit to 5,000 requests/hour.",
      },
      {
        problem: '"No source code available" when initializing Git',
        solution:
          "This prototype was added via URL — no source code was uploaded. Upload your code first (ZIP or paste), then initialize the Git repo.",
      },
    ],
  },
  {
    category: "CLI",
    icon: "⌨️",
    items: [
      {
        problem: '"No prototype ID provided"',
        solution:
          "Run: vibesharing init --prototype <id>. You can find the prototype ID in the dashboard URL or in the prototype's settings page.",
      },
      {
        problem: '"No files found to deploy"',
        solution:
          "The CLI looks for *.tsx, *.ts, *.css, *.json files in the ./app directory by default. If your files are elsewhere, use the --dir flag: vibesharing deploy --dir ./src.",
      },
      {
        problem: "Deploy succeeds but nothing changes",
        solution:
          "Verify the prototype ID in your config matches the one in the dashboard. You may be deploying to a different prototype. Check .vibesharing/config.json or run vibesharing status.",
      },
    ],
  },
  {
    category: "Auth & Permissions",
    icon: "🔒",
    items: [
      {
        problem: "Can't see projects or folders",
        solution:
          "You must be a member of the organization. Access is enforced via Supabase Row Level Security (RLS). Ask your org admin to add your account.",
      },
      {
        problem: '"Session expired" during GitHub OAuth',
        solution:
          "Your VibeSharing session timed out while you were on GitHub. Log in again to VibeSharing, then retry the GitHub authorization flow.",
      },
      {
        problem: "Uploaded source not appearing",
        solution:
          "The server may be missing the SUPABASE_SERVICE_ROLE_KEY environment variable. Without it, server-side writes to the source table silently fail. An admin needs to set this key.",
      },
    ],
  },
  {
    category: "Corporate & Network",
    icon: "🏢",
    items: [
      {
        problem: "ZIP upload blocked by corporate firewall",
        solution:
          "Deploy via GitHub integration instead, or add the prototype using the External URL feature which only requires the URL itself to be reachable.",
      },
      {
        problem: "Can't access vibesharing.app",
        solution:
          "Ask your IT department to allowlist vibesharing.app and *.vercel.app domains. Both are needed for the dashboard and deployed prototypes.",
      },
      {
        problem: "Using internal / on-prem hosting",
        solution:
          "If your prototype is hosted internally, use the External URL feature to add it to VibeSharing. VibeSharing will link to it without requiring deployment.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc]">
      {/* Header */}
      <header className="border-b border-[#30363d] bg-[#161b22]">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold">
                Troubleshooting &amp; Help
              </h1>
              <p className="text-sm text-[#8b949e]">
                Common issues and how to fix them
              </p>
            </div>
          </div>
          <p className="text-[#8b949e] leading-relaxed">
            Paste any section into Claude, ChatGPT, or your AI assistant along
            with your error message for guided help.
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="text-sm text-[#58a6ff] hover:underline"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </header>

      {/* Sections */}
      <main className="mx-auto max-w-4xl px-6 py-8 space-y-10">
        {sections.map((section) => (
          <section key={section.category}>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <span>{section.icon}</span>
              <span>{section.category}</span>
            </h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div
                  key={item.problem}
                  className="rounded-lg border border-[#30363d] bg-[#161b22] p-5"
                >
                  <h3 className="font-medium text-[#f0f6fc] mb-2">
                    {item.problem}
                  </h3>
                  <p className="text-sm text-[#8b949e] leading-relaxed">
                    {item.solution}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Paste into Claude tip box */}
        <div className="rounded-lg border border-[#58a6ff]/30 bg-[#58a6ff]/5 p-5">
          <h3 className="font-medium text-[#58a6ff] mb-2">
            💡 Tip: Paste into Claude
          </h3>
          <p className="text-sm text-[#8b949e] leading-relaxed">
            Copy any section above and paste it into Claude, ChatGPT, or your AI
            assistant along with your error message. The structured
            problem/solution format helps AI give you a specific fix.
          </p>
        </div>

        {/* Still stuck? CTA */}
        <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-6 text-center">
          <h3 className="text-lg font-medium mb-2">Still stuck?</h3>
          <p className="text-sm text-[#8b949e] mb-4">
            Reach out and we&apos;ll help you get unblocked.
          </p>
          <a
            href="mailto:chris@vibesharing.app"
            className="inline-flex items-center gap-2 rounded-lg bg-[#238636] px-4 py-2 text-sm font-medium text-white hover:bg-[#2ea043] transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Contact Support
          </a>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[#30363d] text-center">
          <p className="text-sm text-[#484f58]">
            Prototype built with Next.js • Hosted on VibeSharing •{" "}
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            {" · "}
            <Link href="/help" className="hover:text-white transition-colors">
              Help
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
