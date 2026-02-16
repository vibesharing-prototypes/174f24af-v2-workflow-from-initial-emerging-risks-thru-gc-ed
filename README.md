# GC Emerging Risk Response Prototype

Multi-step workflow prototype demonstrating how a General Counsel responds when AI agents detect emerging risks that need to be addressed in Board materials and regulatory filings.

## Live URL

**Production:** https://vs-step-1-general-counsel-alerted-mljple8d.vercel.app

## Workflow Steps

| Step | Title | Status | Route |
|------|-------|--------|-------|
| 1 | GC Alerted to Emerging Risks | ✅ Ready | `/step-1` |
| 2 | Review Detection Sources | 🔜 Coming | `/step-2` |
| 3 | Assign Risk Owners | 🔜 Coming | `/step-3` |
| 4 | Risk Owner Investigation | 🔜 Coming | `/step-4` |
| 5 | Update 10K Risk Disclosure | 🔜 Coming | `/step-5` |
| 6 | Notify Board | 🔜 Coming | `/step-6` |

## Project Structure

```
app/
  page.tsx              # Index page (lists all steps)
  shared/
    canvases.tsx        # Shared components for all steps
  step-1/
    page.tsx            # Step 1: GC Command Center
  step-2/               # Create folder when ready
  step-3/               # Create folder when ready
  ...
```

## For Team Members: Safe Development Workflow

⚠️ **Never push directly to `main`** — Vercel auto-deploys main, so broken code goes live immediately.

### Adding a New Feature or Step

1. **Create a branch:**
   ```bash
   git checkout main
   git pull
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** (e.g., create `app/step-2/page.tsx`)

3. **Test locally:**
   ```bash
   npm install
   npm run dev
   # Visit http://localhost:3000
   ```

4. **Push your branch:**
   ```bash
   git add .
   git commit -m "Add step 2: review detection sources"
   git push -u origin feature/your-feature-name
   ```

5. **Open a Pull Request on GitHub**
   - Go to: https://github.com/vibesharing-prototypes/174f24af-step-1-general-counsel-alerted-to-emerging-risks
   - Click "Compare & pull request"
   - Add description of your changes

6. **Test on Vercel preview**
   - Vercel automatically creates a preview URL for your PR
   - URL format: `https://174f24af-...-git-[branch-name].vercel.app`
   - Test thoroughly before merging

7. **Merge when ready**
   - Once preview looks good, merge the PR
   - Production updates automatically

### Adding a New Step

1. Create folder: `app/step-N/`
2. Create `page.tsx` inside it
3. Import shared components: `import { ... } from "../shared/canvases"`
4. Update `app/page.tsx` to change the step's status from `"upcoming"` to `"complete"`

### Shared Components

All shared components live in `app/shared/canvases.tsx`. If you need to add new shared components:

1. Add them to `canvases.tsx`
2. Export them
3. Import in your step: `import { YourComponent } from "../shared/canvases"`

## Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (auto-deploys from `main`)

## Local Development

```bash
# Clone the repo
git clone https://github.com/vibesharing-prototypes/174f24af-step-1-general-counsel-alerted-to-emerging-risks.git

# Install dependencies
cd 174f24af-step-1-general-counsel-alerted-to-emerging-risks
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

## Questions?

Contact Chris Avore for questions about the prototype or workflow.
# Trigger rebuild Thu Feb 12 12:41:17 EST 2026
