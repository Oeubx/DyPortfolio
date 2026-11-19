# DyPortfolio ⚡ (Dynamic + Portfolio)

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![Framework](https://img.shields.io/badge/Vite-React%20%2B%20TypeScript-000000.svg)](https://vitejs.dev/)
[![Styling](https://img.shields.io/badge/TailwindCSS-Minimalist%20B%26W-000000.svg)](https://tailwindcss.com/)
[![Backend](https://img.shields.io/badge/Backend-Supabase-3ECF8E.svg)](https://supabase.com/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/DyPortfolio&env=VITE_ADMIN_EMAIL&envDescription=Your%20Google%20account%20email%20to%20access%20the%20Admin%20Dashboard)

> **A high-performance personal portfolio and dynamic resume customization engine.**  
> Designed to let you assemble and download tailored, ATS-friendly single-page resumes on the fly, manage certificates and personal details dynamically without repository commits, and track verified download telemetry with zero hosting costs on Vercel.

---

## 🌟 Why "DyPortfolio"?

**DyPortfolio = Dynamic + Portfolio**

Static resumes and portfolios quickly become outdated and lack the flexibility required when applying for diverse engineering roles. DyPortfolio solves this:
- **Instant Customization**: Applying for a backend role? Highlight systems architecture, databases, and microservices while collapsing unrelated experiences.
- **Granular Checklist Control**: Toggle specific skills, bullet points, projects, and personal details (languages & hobbies) with real-time preview.
- **Strict 1-Page ATS PDF Export**: Client-side vector rendering guarantees an ATS-compliant, single-page PDF ready for recruiters in seconds.
- **Dynamic Certificate Vault**: Upload and toggle visibility (`is_visible`) of certificates via a secured Admin panel in real time without git commits.
- **Dynamic Personal Details**: Extensible manager for spoken languages, hobbies, and personal highlights.
- **Audited Download Telemetry**: Immediate resume download followed by an optional, non-intrusive visitor feedback modal (*"Why / Purpose of Download"*).
- **Offline / Template Ready**: Runs 100% standalone out of the box using `portfolio.config.ts` and `public/data/starterData.json`.

---

## 🚀 1-Click Deployment on Vercel

You can deploy your own copy of DyPortfolio in under 60 seconds:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/DyPortfolio&env=VITE_ADMIN_EMAIL&envDescription=Your%20Google%20account%20email%20to%20access%20the%20Admin%20Dashboard)

---

## 🛠️ Quickstart & Local Development

### Prerequisites
- Node.js (v18 or v20+)
- npm or pnpm
- Git

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-username/DyPortfolio.git
cd DyPortfolio

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:5173` to explore the live dynamic portfolio.

---

## ⚙️ Customization Guide

DyPortfolio is engineered as a clean template. You can personalize the entire site by editing two files:

### 1. `portfolio.config.ts` (Personal Branding & Presets)
Edit your name, titles, bio, contact emails, and social links:
```typescript
export const portfolioConfig = {
  personal: {
    name: "Your Full Name",
    titles: ["Fullstack Engineer", "System Architect"],
    bio: "Passionate developer focused on building scalable systems...",
    location: "City, Country",
    emailPersonal: "your.personal@example.com",
    emailProfessional: "your.pro@example.com",
    socials: {
      linkedin: "https://linkedin.com/in/yourhandle",
      github: "https://github.com/yourhandle",
      x: "https://x.com/yourhandle",
    }
  },
  roles: {
    presets: [
      { id: "developer", label: "Software Developer", defaultTags: ["developer", "frontend", "backend"] },
      { id: "systems", label: "Systems & Architecture", defaultTags: ["systems", "database", "devops"] },
      { id: "custom", label: "Custom Selection", defaultTags: [] },
    ]
  }
};
```

### 2. `public/data/starterData.json` (Resume Items & Credentials)
Update your experiences, featured projects, technical skills, certificates, and personal details (languages & hobbies).

---

## 🗄️ Optional: Connecting Supabase (Cloud BaaS)

DyPortfolio works completely offline by default. To enable dynamic cloud certificate uploads, real-time show/hide toggling, and live download telemetry:

1. Create a free project on [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run the migration script:
   [`supabase/migrations/20261119_initial_schema_and_rls.sql`](supabase/migrations/20261119_initial_schema_and_rls.sql)
3. Copy your project URL and public Anon key.
4. Create a `.env.local` file (or set environment variables on Vercel):
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   VITE_ADMIN_EMAIL=your-google-email@example.com
   ```
5. Click the **Shield Icon** in the website footer to access the **Admin Portal**!

---

## 🔒 Branch Governance & Delivery Lifecycle

DyPortfolio follows a strict 4-tier promotion pipeline:

```
feature/<category>/<description>
         │
         ▼ (PR with CI checks + Vercel Preview)
   development  (Active Integration Branch)
         │
         ▼ (Promotion PR + Owner Review)
     staging    (Pre-production Verification)
         │
         ▼ (Promotion PR + Owner Review)
   production / main (Production Source -> Vercel Live Deployment)
```

- **Branch Governance**: See [`docs/BRANCH_GOVERNANCE.md`](docs/BRANCH_GOVERNANCE.md) for GitHub Ruleset setup instructions.
- **Coverage Report**: See [`docs/PORTFOLIO_RESUME_COVERAGE_REPORT.md`](docs/PORTFOLIO_RESUME_COVERAGE_REPORT.md) for the complete field-level audit matrix.
- **Vercel Migration Report**: See [`docs/VERCEL_MIGRATION_REPORT.md`](docs/VERCEL_MIGRATION_REPORT.md).

---

## 📄 License & Open-Source Rights

DyPortfolio is licensed under the **[MIT License](LICENSE)**. You are free to fork, customize, distribute, and deploy this project for your own portfolio and resume needs.
