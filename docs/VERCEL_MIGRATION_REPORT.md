# DyPortfolio — Vercel Deployment Migration Report

This report outlines the architectural differences, configuration updates, and workflow changes involved in migrating the deployment target from **GitHub Pages** to **Vercel**.

---

## 1. Executive Comparison

| Dimension | GitHub Pages (Previous Plan) | Vercel (New Target) | Impact & Advantages of Vercel |
| :--- | :--- | :--- | :--- |
| **Hosting Model** | Static file hosting (`username.github.io/DyPortfolio`) | Global Edge Network (`dyportfolio.vercel.app` or custom domain) | Faster global CDN, edge caching, zero base-path issues |
| **Routing / SPA** | Requires relative base path or `404.html` redirect hack | Native single-page routing via `vercel.json` rewrites | Clean URLs, no 404 reload issues on sub-routes |
| **Deployment Trigger**| Custom GitHub Actions workflow (`deploy.yml`) | Native Git Integration or Vercel GitHub Action | Automatic Preview Deployments for every Pull Request |
| **Preview Environments**| None (Single static build on `gh-pages` branch) | Unique live preview URL generated for every PR | You can test PRs live before merging to `development` or `staging` |
| **Environment Secrets**| GitHub Repo Secrets injected during build | Vercel Environment Variables dashboard | Encrypted per environment (Production, Preview, Development) |
| **Template Friendliness**| Manual repo settings configuration required | "Deploy with Vercel" 1-click clone button | Other developers can clone and launch in 1 click |
| **Cost** | 100% Free | 100% Free (Hobby Tier for personal projects) | Zero cost, generous bandwidth (100GB/mo) |

---

## 2. Technical Modifications Required

### 2.1. Routing & Configuration: `vercel.json` [NEW]
Vercel requires a simple rewrite rule to ensure client-side routing (HTML5 History API) redirects all route requests to `index.html`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2.2. Vite Configuration: `vite.config.ts` [UPDATE]
- **Previous**: `base: './'` (required by GitHub Pages subpath hosting).
- **Vercel**: `base: '/'` (Vercel hosts at domain root, simplifying asset paths and absolute routing).

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
```

### 2.3. CI/CD & GitHub Actions Workflow [UPDATE]
1. **Continuous Integration (`.github/workflows/ci.yml`)**:
   - Remains completely unchanged. Continues running type-checking, linting, and build validation on all PRs to `development`, `staging`, `production`, and `main`.
2. **Continuous Deployment (`.github/workflows/deploy.yml`)**:
   - **Option A (Native Vercel Git Integration - Recommended)**:
     - Connect your GitHub repository to Vercel via `vercel.com`.
     - Vercel automatically handles building and deploying.
     - Production branch set to `production` (or `main`).
     - Preview branches set to all PRs (creates live ephemeral preview URLs).
   - **Option B (GitHub Actions Vercel Action)**:
     - Uses `amondnet/vercel-action` in `.github/workflows/deploy.yml` with secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`.

### 2.4. Environment Variables Setup
Instead of (or in addition to) GitHub Actions secrets, variables are added in the **Vercel Project Settings**:
- `VITE_SUPABASE_URL`: Your Supabase Project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anonymous Public Key.
- `VITE_ADMIN_EMAIL`: `your-email@example.com` (or your personal email for your deployment).
- `VITE_TURNSTILE_SITE_KEY`: (Optional) Cloudflare Turnstile key.

---

## 3. Impact on Branch Governance & Protection Rules

The 4-tier branch hierarchy (`main`, `development`, `staging`, `production`) and `.github/CODEOWNERS` gating remain **100% active and enforced**:

```
feature/<category>/<description>
         │
         ▼ (PR triggers Vercel Ephemeral Preview + CI Checks)
   development  (Integration Branch -> Vercel Development Preview)
         │
         ▼ (Promotion PR + Owner Review)
     staging    (Pre-production -> Vercel Staging Environment)
         │
         ▼ (Promotion PR + Owner Review)
   production / main (Production -> Vercel Live Production URL)
```

1. **Feature PRs**: When someone opens a PR to `development`, Vercel automatically generates a temporary Preview URL (e.g. `dyportfolio-git-feat-ui-yourname.vercel.app`). You can click and test the UI in your browser before approving the merge.
2. **Production Deployment**: Only merges into `production` (or `main`) trigger the official production deployment (`dyportfolio.vercel.app`).
3. **Owner Protection**: Outside contributors still cannot push directly to any branch and cannot merge without your approval.

---

## 4. Module 3 Onwards: General Version Alignment

All upcoming modules are structured strictly for the **General Template Version**:
- **Module 3 (Dynamic Resume Engine & 1-Page PDF)**: Uses `portfolio.config.ts` and `starterData.json`. Any developer who forks this repo gets the complete interactive customizer with sample tech data and clean 1-page PDF exports.
- **Module 4 (Download Telemetry & Post-Download Modal)**: Instant download + optional post-download lead modal. Works offline or connects to Supabase if keys are provided.
- **Module 5 (Admin Vault: Certificates & Personal Details)**: Generic admin dashboard allowing CRUD on certificates, languages, and hobbies with `VITE_ADMIN_EMAIL=your-email@example.com`.
- **Module 6 (Template Release & Fork Guide)**: Documentation with "Deploy with Vercel" 1-click button, clone instructions, and MIT license.
- **Personal Version (Stage 2)**: Populated with Prince Amorsolo C. Remo's genuine career bullets, real credentials, and private Supabase keys after the template is complete.
