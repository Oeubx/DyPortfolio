# DyPortfolio — Version History & Changelog

All notable changes, milestones, and release specifications for **DyPortfolio** are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.0.0] — 2026-11-19 (Generalized Open-Source Release)

> **Milestone**: Initial production-ready release of the **DyPortfolio Generalized Template**.  
> Distributed as an open-source template under the MIT License, ready for any developer to fork, customize, and deploy to Vercel in under 60 seconds with zero hosting costs.

### 🌟 Key Highlights & Capabilities
- **Dynamic Resume Customization Engine**: Select role presets or toggle individual checklist items (skills, achievements, bullet points) with live side-by-side preview and single-page ATS-friendly PDF export.
- **Strict 1-Page ATS PDF Generation**: Client-side vector rendering via `@react-pdf/renderer` with on-demand chunk splitting (`manualChunks`) keeping initial landing page bundle ultra-lightweight (~430 kB).
- **Dynamic Certificate Vault**: Upload and toggle visibility (`is_visible`) of certificates in real time via an Admin panel without code modifications or Git commits.
- **Dynamic Personal Details Section**: Extensible manager for spoken languages (with proficiency tags), hobbies, and personal highlights.
- **Immediate Download Flow**: Clicking "Download CV" downloads the PDF immediately in the browser without gating or delay, while automatically recording an initial timestamp to telemetry.
- **Post-Download Feedback Modal**: An optional follow-up modal appears right after download starts, warmly thanking the visitor, clarifying that details are 100% optional for personal networking, and providing fields for Name, Contact, and "Why / Purpose of Download".
- **Minimalist Monochrome B&W Aesthetic**: High-contrast black and white visual design supporting seamless Dark Mode and Light Mode with system preference detection and `localStorage` persistence.
- **Self-Contained Offline Resilience**: Runs 100% standalone out of the box using `portfolio.config.ts` and `public/data/starterData.json`, with optional live Supabase BaaS connection.
- **Vercel Edge Deployment**: Native SPA routing rewrites configured via `vercel.json` and 1-click "Deploy with Vercel" integration.

---

### 📦 Detailed Module Deliverables

#### Module 0: Infrastructure, Governance & CI/CD (`DP-M0-F#`)
- `.gitignore`: Configured for Node dependencies, Vite build outputs (`dist/`), and `.env*` secrets.
- `.github/CODEOWNERS`: Enforced review authority for Prince Amorsolo C. Remo (`oeubxwaa@gmail.com`).
- `.github/workflows/ci.yml`: Continuous Integration workflow running linting, type-checking, and build validation on pull requests to `development`, `staging`, `production`, and `main`.
- `.github/workflows/deploy.yml`: Continuous Deployment workflow targeting Vercel / GitHub Pages with owner authorization security gate.
- `docs/BRANCH_GOVERNANCE.md`: 4-tier branch hierarchy separating the open-source Generalized Template (`development`, `main`) from Prince's Personal Deployment (`staging`, `production`).
- `docs/backlogs/DP_Sprint_Backlogs_Commit_Reference.md`: Canonical commit grammar reference (`<type>(<scope>): <description> [DP-M#-F#]`).
- `docs/PORTFOLIO_RESUME_COVERAGE_REPORT.md`: Comprehensive audit matrix across personal branding, career roles, projects, skills taxonomy, certificates, dynamic personal details, and 1-page ATS constraints.
- `vercel.json`: Clean SPA catch-all rewrites routing all traffic to `/index.html`.
- `.agents/skills/`: Integrated local repository agent skills for `git-commits` and `github-pr`.

#### Module 1: Auth, Database Schema & Security (`DP-M1-F#`)
- `supabase/migrations/20261119_initial_schema_and_rls.sql`: Idempotent PostgreSQL schema defining:
  - `profiles`: User account mapping with role-based access (`admin` vs `visitor`).
  - `resume_items`: Master experience, projects, skills, and education taxonomy.
  - `certificates`: Credentials vault with issuer, verification links, and file URLs.
  - `personal_details`: Extensible attributes for spoken languages and hobbies.
  - `download_logs`: Telemetry tracking download timestamps, visitor leads, and reasons.
  - Storage bucket `certificates` for direct image and PDF uploads.
  - Strict Row Level Security (RLS) policies: public read-only for active/visible records, admin-only write gating.
- `src/lib/supabaseClient.ts`: Resilient `dataService` with transparent offline fallback to `starterData.json`.
- `src/context/AuthContext.tsx`: Google OAuth authentication provider with admin email detection.
- `.env.example`: Parameterized environment variables template.

#### Module 2: Core Design System & Presentation Pages (`DP-M2-F#`)
- `src/context/ThemeContext.tsx` & `src/components/common/ThemeToggle.tsx`: High-contrast monochrome theme engine with smooth CSS transitions.
- `src/components/common/Navbar.tsx`: Sticky backdrop-blur navigation with mobile drawer.
- `src/components/common/Footer.tsx`: Omnipresent contact footer with Professional Gmail, Personal Gmail, LinkedIn, X, Facebook, and GitHub links.
- `src/pages/HomePage.tsx`: Hero introduction with dynamic title rotation, bio, and highlight cards.
- `src/pages/ProjectsPage.tsx`: Categorized project showcase with tag filtering and repository/demo links.
- `src/pages/ExperiencesPage.tsx`: Chronological career and leadership timeline.
- `src/pages/CertificatesPage.tsx`: Credential gallery with interactive certificate viewer modal.
- `src/pages/AboutPage.tsx`: Personal story and dynamic personal details section (spoken languages & hobbies).

#### Module 3: Dynamic Resume Engine & 1-Page ATS PDF (`DP-M3-F#`)
- `src/components/resume/ResumePDF.tsx`: ATS-compliant single-page PDF definition using `@react-pdf/renderer`.
- `src/components/resume/ResumePreview.tsx`: Scaled A4 live visual preview container with density adjustments (`compact`, `standard`, `relaxed`).
- `src/components/resume/ResumeBuilder.tsx`: Role presets switcher (*"Software Developer"*, *"Systems & Architecture"*, *"Custom Selection"*), category checklists, search filtering, and client-side PDF export.
- `src/pages/DynamicResumePage.tsx`: Responsive 2-column workspace layout.

#### Module 4: Download Telemetry & Post-Download Feedback Modal (`DP-M4-F#`)
- Immediate browser download trigger upon clicking "Download CV" or "Download Tailored Resume".
- Initial telemetry logger recording timestamp, preset name, and device summary.
- `src/components/resume/PostDownloadModal.tsx`: Post-download feedback modal with warm thank you greeting, validation notice explaining optional personal tracking purpose, lead capture inputs (Name, Contact, "Why / Purpose"), and "Skip / Close" action.

#### Module 5: Dynamic Certificates, Personal Details & Admin Management (`DP-M5-F#`)
- `src/components/admin/CertManager.tsx`: Direct upload and 1-click show/hide visibility toggles (`Eye` / `EyeOff`) without git commits.
- `src/components/admin/PersonalDetailsManager.tsx`: Dynamic CRUD for spoken languages (with proficiency tags) and hobbies/interests.
- `src/components/admin/AnalyticsViewer.tsx`: Real-time tabular audit of resume downloads, visitor names, contacts, and stated purposes ("Why").
- `src/components/admin/AdminModal.tsx`: Tabbed management dashboard with Google OAuth barrier and Template Demo Mode unlock.
- `Footer.tsx`: Added subtle Admin Portal shield button.

#### Module 6: Template Generalization & Open-Source Distribution (`DP-M6-F#`)
- `portfolio.config.ts`: Centralized template configuration for easy personalization.
- `public/data/starterData.json`: Structured starter dataset with sample items.
- `README.md`: Complete open-source guide with "Deploy with Vercel" 1-click button, customization steps, and MIT license.

---

### 🛡️ Quality & Verification Sign-Off
- **TypeScript Type Checking (`npm run type-check`)**: **0 Errors**.
- **Production Build (`npm run build`)**: **Passed** cleanly.
- **Bundle Optimization**: Code-split `@react-pdf/renderer` into an on-demand bundle (`431 kB` main bundle, `pdf` chunk loaded on demand).
- **Code Ownership**: Enforced by Prince Amorsolo C. Remo in `.github/CODEOWNERS`.
- **License**: MIT License.
