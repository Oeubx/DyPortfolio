# Module 0: Infrastructure, CI/CD & Governance

## 1. Overview
Module 0 establishes the operational backbone of DyPortfolio. It includes source code governance, branch protection rulesets, automated continuous integration and continuous deployment pipelines, developer agent skills, and base frontend tooling.

## 2. Specifications & Standards
- **Branch Strategy**: Strict 4-branch model (`main`, `development`, `staging`, `production`).
  - Outside contributors cannot push to any branch and must submit PRs.
  - Prince Amorsolo C. Remo can merge directly to `development`.
  - Promotions to `staging`, `production`, and `main` require a PR with passing CI checks and owner approval.
- **Continuous Integration (`.github/workflows/ci.yml`)**:
  - Triggers on PRs to `development`, `staging`, `production`, and `main`, plus direct pushes to `development`.
  - Runs Node.js 20, dependency checks, type validation (`tsc --noEmit`), linting, and production build checks.
- **Continuous Deployment (`.github/workflows/deploy.yml`)**:
  - Triggers on push/merge to `main` (or `production`).
  - Security check verifying `github.actor == github.repository_owner`.
  - Bundles static assets and publishes directly to GitHub Pages.
- **Code Ownership (`.github/CODEOWNERS`)**:
  - All paths mapped to Prince Amorsolo C. Remo (`oeubxwaa@gmail.com`).
- **License**:
  - MIT License for open-source reuse.

## 3. Feature Breakdown
- `DP-M0-F0`: Repository Foundations & Governance (`.gitignore`, `LICENSE`, `CODEOWNERS`, `docs/BRANCH_GOVERNANCE.md`).
- `DP-M0-F1`: Canonical Backlogs & Commit Grammar (`docs/backlogs/*`).
- `DP-M0-F2`: Local Agent Skills (`.agents/skills/git-commits`, `.agents/skills/github-pr`).
- `DP-M0-F3`: GitHub Actions CI/CD Workflows (`ci.yml`, `deploy.yml`).
- `DP-M0-F4`: Base Frontend Tooling & Scaffold (Vite + React + TypeScript + Tailwind CSS).
- `DP-M0-F5`: Portfolio & Resume Coverage Report (`docs/PORTFOLIO_RESUME_COVERAGE_REPORT.md`).
