# DyPortfolio Sprint Backlogs — Commit Reference & Feature Catalog

This document is the canonical commit and backlog reference for the **DyPortfolio** ecosystem across documentation, infrastructure, frontend presentation, dynamic resume generation, telemetry, and BaaS integration.

---

## 1. Commit Code Grammar

All commits touching DyPortfolio must adhere to Conventional Commits grammar and include the specialized system backlog code:

```text
<type>(<scope>): <concise description in past-tense> [DP-M#-F#]
```

### Examples:
- `chore(infra): initialize repository structure, governance, and ci workflows [DP-M0-F0]`
- `feat(ui): implement monochrome dark and light mode theme engine [DP-M2-F1]`
- `feat(resume): build checklist customizer with dynamic live preview [DP-M3-F2]`
- `feat(telemetry): record immediate download event and trigger post-download modal [DP-M4-F1]`
- `feat(admin): enable dynamic personal details crud for languages and hobbies [DP-M5-F3]`
- `docs(backlog): compile module specifications and coverage report [DP-M0-F1]`

### Valid Commit Types:
- `feat`: A new feature, page, or user-facing capability.
- `fix`: A bug fix or patch for unexpected behavior.
- `docs`: Documentation-only updates.
- `refactor`: Code restructuring that neither fixes a bug nor adds a feature.
- `test`: Adding or modifying automated unit/integration tests.
- `chore`: Routine maintenance, updating dependencies, or `.gitignore` tweaks.
- `ci`: Changes to CI/CD workflows (`.github/workflows/*`).
- `perf`: Performance optimizations (e.g., rendering speed, bundle reduction).
- `style`: Formatting, whitespace, or linting adjustments with no logic changes.
- `revert`: Reverting a previous commit.

---

## 2. Module Legend

| Module Code | Module / Area | Primary Scope | Directory Link |
| :--- | :--- | :--- | :--- |
| **M0** | Infrastructure, CI/CD & Governance | GitHub Pages workflows, branch gating, CODEOWNERS, `.gitignore`, MIT license | [module-0-infrastructure/](module-0-infrastructure/README.md) |
| **M1** | Auth, Database Schema & Security | Supabase PostgreSQL schema, RLS policies, Admin Google OAuth, offline fallback | [module-1-auth-db/](module-1-auth-db/README.md) |
| **M2** | Design System & Presentation Pages | Minimalist B&W theme (light/dark), Home, Projects, Experiences, Certs, About | [module-2-core-ui-pages/](module-2-core-ui-pages/README.md) |
| **M3** | Dynamic Resume Engine & 1-Page PDF | Interactive checklist, role presets, live preview, `@react-pdf/renderer` single-page | [module-3-resume-engine/](module-3-resume-engine/README.md) |
| **M4** | Download Telemetry & Post-Download Modal | Instant download trigger, timestamp logging, optional post-download lead modal | [module-4-download-telemetry/](module-4-download-telemetry/README.md) |
| **M5** | Certificate Vault, Personal Details & Admin | Certificate uploads, personal attributes CRUD (languages/hobbies), analytics | [module-5-admin-certs/](module-5-admin-certs/README.md) |
| **M6** | Template Generalization & Open Distribution | Generic config abstraction (`portfolio.config.ts`), README starter guide | [module-6-template-distribution/](module-6-template-distribution/README.md) |

---

## 3. Feature Code Index

### MODULE 0: Infrastructure, CI/CD & Governance (`DP-M0-F#`)
- Specification: [module-0-infrastructure/README.md](module-0-infrastructure/README.md)

| Commit Code | Feature Name | Description | Specification Link |
| :--- | :--- | :--- | :--- |
| `DP-M0-F0` | Repository Foundations & Governance | Setup `.gitignore`, `LICENSE` (MIT), `.github/CODEOWNERS`, and branch protection rules | [module-0-infrastructure/README.md](module-0-infrastructure/README.md) |
| `DP-M0-F1` | Canonical Backlog & Commit Grammar | Establish module backlogs and `DP_Sprint_Backlogs_Commit_Reference.md` | [module-0-infrastructure/README.md](module-0-infrastructure/README.md) |
| `DP-M0-F2` | Agent Skills Integration | Integrate `.agents/skills/git-commits` and `.agents/skills/github-pr` | [module-0-infrastructure/README.md](module-0-infrastructure/README.md) |
| `DP-M0-F3` | CI/CD Workflows Pipeline | Implement `.github/workflows/ci.yml` and `.github/workflows/deploy.yml` with actor gating | [module-0-infrastructure/README.md](module-0-infrastructure/README.md) |
| `DP-M0-F4` | Base Frontend Scaffold & Tooling | Initialize Vite + React + TypeScript + Tailwind CSS with B&W theme tokens | [module-0-infrastructure/README.md](module-0-infrastructure/README.md) |
| `DP-M0-F5` | Portfolio & Resume Coverage Report | Audit and track field-level schema coverage in `docs/PORTFOLIO_RESUME_COVERAGE_REPORT.md` | [module-0-infrastructure/README.md](module-0-infrastructure/README.md) |

### MODULE 1: Auth, Database Schema & Security (`DP-M1-F#`)
- Specification: [module-1-auth-db/README.md](module-1-auth-db/README.md)

| Commit Code | Feature Name | Description | Specification Link |
| :--- | :--- | :--- | :--- |
| `DP-M1-F1` | PostgreSQL Schema & DDL | Bootstrap tables: `profiles`, `resume_items`, `certificates`, `personal_details`, `download_logs` | [module-1-auth-db/README.md](module-1-auth-db/README.md) |
| `DP-M1-F2` | Row Level Security (RLS) Policies | Public read-only policies and strict Admin write/update/delete gating | [module-1-auth-db/README.md](module-1-auth-db/README.md) |
| `DP-M1-F3` | Supabase Client & Offline Resilience | Resilient client fallback to `starterData.json` when DB is disconnected or asleep | [module-1-auth-db/README.md](module-1-auth-db/README.md) |
| `DP-M1-F4` | Google OAuth Authentication Flow | Google Sign-In integration for Admin dashboard and optional visitor identification | [module-1-auth-db/README.md](module-1-auth-db/README.md) |

### MODULE 2: Core Design System & Presentation Pages (`DP-M2-F#`)
- Specification: [module-2-core-ui-pages/README.md](module-2-core-ui-pages/README.md)

| Commit Code | Feature Name | Description | Specification Link |
| :--- | :--- | :--- | :--- |
| `DP-M2-F1` | B&W Monochrome Design System | Tailwind palette, contrast tokens, and Dark/Light mode theme provider | [module-2-core-ui-pages/README.md](module-2-core-ui-pages/README.md) |
| `DP-M2-F2` | Navigation & Global Layout Shell | Responsive Navbar, active route indicators, ThemeToggle, and protected route wrapper | [module-2-core-ui-pages/README.md](module-2-core-ui-pages/README.md) |
| `DP-M2-F3` | Omnipresent Footer & Contact Bar | Personal Gmail, Professional Gmail, LinkedIn, X, Facebook links, and quick CV action | [module-2-core-ui-pages/README.md](module-2-core-ui-pages/README.md) |
| `DP-M2-F4` | Home & Hero Page | Hero introduction, key specialties, and highlight cards | [module-2-core-ui-pages/README.md](module-2-core-ui-pages/README.md) |
| `DP-M2-F5` | Projects Showcase View | Tag-filtered gallery with live links, source repositories, and technology badges | [module-2-core-ui-pages/README.md](module-2-core-ui-pages/README.md) |
| `DP-M2-F6` | Experiences & Career Timeline | Interactive career, leadership, and education timeline | [module-2-core-ui-pages/README.md](module-2-core-ui-pages/README.md) |
| `DP-M2-F7` | Certificates Showcase View | Credential cards with issuer details, verification URLs, and preview modal | [module-2-core-ui-pages/README.md](module-2-core-ui-pages/README.md) |
| `DP-M2-F8` | About Me & Dynamic Details View | Bio narrative, dynamic spoken languages, hobbies, and interests chips | [module-2-core-ui-pages/README.md](module-2-core-ui-pages/README.md) |

### MODULE 3: Dynamic Resume Engine & 1-Page PDF (`DP-M3-F#`)
- Specification: [module-3-resume-engine/README.md](module-3-resume-engine/README.md)

| Commit Code | Feature Name | Description | Specification Link |
| :--- | :--- | :--- | :--- |
| `DP-M3-F1` | Role Presets Engine | Pre-configured filters (Developer, Systems, Fullstack, Custom) | [module-3-resume-engine/README.md](module-3-resume-engine/README.md) |
| `DP-M3-F2` | Interactive Category Checklists | Real-time toggle checkboxes for skills, experiences, projects, and personal details | [module-3-resume-engine/README.md](module-3-resume-engine/README.md) |
| `DP-M3-F3` | Live 1-Page Visual Preview | Responsive container matching A4/Letter dimensions with density controls | [module-3-resume-engine/README.md](module-3-resume-engine/README.md) |
| `DP-M3-F4` | Single-Page ATS PDF Generation | `@react-pdf/renderer` document template formatted strictly for one page | [module-3-resume-engine/README.md](module-3-resume-engine/README.md) |

### MODULE 4: Download Telemetry & Post-Download Modal (`DP-M4-F#`)
- Specification: [module-4-download-telemetry/README.md](module-4-download-telemetry/README.md)

| Commit Code | Feature Name | Description | Specification Link |
| :--- | :--- | :--- | :--- |
| `DP-M4-F1` | Immediate Download Dispatcher | Trigger instant browser PDF download and record initial timestamp to Supabase | [module-4-download-telemetry/README.md](module-4-download-telemetry/README.md) |
| `DP-M4-F2` | Post-Download Feedback Modal | Optional lead modal: Name, Contact, "Why", validation text, and Thank You banner | [module-4-download-telemetry/README.md](module-4-download-telemetry/README.md) |
| `DP-M4-F3` | Telemetry Logging & Bot Protection | Cloudflare Turnstile token validation and rate-limited database writes | [module-4-download-telemetry/README.md](module-4-download-telemetry/README.md) |

### MODULE 5: Dynamic Certificates, Personal Details & Admin Management (`DP-M5-F#`)
- Specification: [module-5-admin-certs/README.md](module-5-admin-certs/README.md)

| Commit Code | Feature Name | Description | Specification Link |
| :--- | :--- | :--- | :--- |
| `DP-M5-F1` | Admin Authentication Guard | Route protection verifying authenticated Google email against `VITE_ADMIN_EMAIL` | [module-5-admin-certs/README.md](module-5-admin-certs/README.md) |
| `DP-M5-F2` | Certificate Upload & Storage | Upload images/PDFs to Supabase Storage and manage visibility flags | [module-5-admin-certs/README.md](module-5-admin-certs/README.md) |
| `DP-M5-F3` | Dynamic Personal Details Manager | CRUD for spoken languages, hobbies, volunteer activities, and custom attributes | [module-5-admin-certs/README.md](module-5-admin-certs/README.md) |
| `DP-M5-F4` | Download Analytics Dashboard | Tabular audit view of download timestamps, visitor leads, presets, and reasons | [module-5-admin-certs/README.md](module-5-admin-certs/README.md) |

### MODULE 6: Template Generalization & Open-Source Distribution (`DP-M6-F#`)
- Specification: [module-6-template-distribution/README.md](module-6-template-distribution/README.md)

| Commit Code | Feature Name | Description | Specification Link |
| :--- | :--- | :--- | :--- |
| `DP-M6-F1` | Configuration Abstraction | `portfolio.config.ts` providing centralized personalization parameters | [module-6-template-distribution/README.md](module-6-template-distribution/README.md) |
| `DP-M6-F2` | Generic Starter Dataset | `starterData.json` with structured placeholder items for immediate use | [module-6-template-distribution/README.md](module-6-template-distribution/README.md) |
| `DP-M6-F3` | Template Documentation & Fork Guide | Exhaustive guide for developers to fork, customize, and deploy under MIT License | [module-6-template-distribution/README.md](module-6-template-distribution/README.md) |
