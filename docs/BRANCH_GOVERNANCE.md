# DyPortfolio Branch Governance & Protection Rules

This document details the branch lifecycle, gating rules, and repository configurations ensuring that **Prince Amorsolo C. Remo** retains sole ownership and release authority across `main`, `development`, `staging`, and `production`.

---

## 1. Branch Hierarchy

DyPortfolio follows a strict 4-branch multi-stage promotion pipeline:

```
feature/<category>/<description>
         │
         ▼ (Outside contributor PR OR Direct merge by Prince)
   development  (Active Integration Branch)
         │
         ▼ (Promotion PR + CI Checks + Prince's Approval)
     staging    (Pre-production Verification)
         │
         ▼ (Promotion PR + CI Checks + Prince's Approval)
   production / main (Production Source -> Automated GitHub Pages CD)
```

1. **Feature Branches (`feat/*`, `fix/*`, `chore/*`)**:
   - Short-lived branches created off `development`.
   - Work is submitted to `development` exclusively via Pull Request.
2. **`development` Branch**:
   - Central integration area for active feature builds.
   - Triggers automated CI checks on every PR and push.
   - **Prince Amorsolo C. Remo** can push or merge directly.
   - **Outside contributors** must open a PR.
3. **`staging` Branch**:
   - Pre-production staging environment.
   - **Everyone (including Prince)** must undergo a Pull Request with passing CI status checks.
4. **`production` / `main` Branch**:
   - Production source of truth.
   - Pushes/merges trigger the automated GitHub Pages CD workflow (`.github/workflows/deploy.yml`).
   - **Everyone (including Prince)** must undergo a Pull Request with passing CI status checks and owner authorization.

---

## 2. Gating Matrix

| Branch | Outside Contributors | Prince Amorsolo C. Remo | Required Checks |
| :--- | :--- | :--- | :--- |
| **`development`** | PR Required, Direct Push **Blocked** | Direct Push / Merge **Allowed** | CI (`Build & Type Check`) |
| **`staging`** | PR Required, Direct Push **Blocked** | PR Required, Direct Push **Blocked** | CI (`Build & Type Check`) + Owner Review |
| **`production`** | PR Required, Direct Push **Blocked** | PR Required, Direct Push **Blocked** | CI (`Build & Type Check`) + Owner Review |
| **`main`** | PR Required, Direct Push **Blocked** | PR Required, Direct Push **Blocked** | CI (`Build & Type Check`) + Owner Review |

---

## 3. GitHub Configuration Instructions

### Step 1: CODEOWNERS Configuration
In `.github/CODEOWNERS`:
```text
* oeubxwaa@gmail.com # Prince Amorsolo C. Remo
```
Enforces that no PR can merge into protected branches without Prince's explicit sign-off.

### Step 2: GitHub Repository Ruleset
1. In your GitHub repository, open **Settings** > **Rules** > **Rulesets**.
2. Create a ruleset named **Protected Branches**:
   - **Target Branches**: `development`, `staging`, `production`, `main`.
   - **Restrict Deletions**: Checked.
   - **Require a pull request before merging**: Checked.
     - Required approvals: 1.
     - Dismiss stale reviews on new pushes: Checked.
     - Require review from Code Owners: Checked.
   - **Require status checks to pass**: Checked.
     - Status check: `Build & Type Check` (from `.github/workflows/ci.yml`).
   - **Restrict pushes**: Checked.
     - Add bypass list: For `development`, allow **Prince Amorsolo C. Remo**. For `staging`, `production`, and `main`, leave empty (so everyone must PR).
   - **Block force pushes**: Checked.

---

## 4. Promotion Flow Checklist

When moving changes forward:
1. **Feature to Development**:
   - Run local validation: `npm run type-check && npm run build`
   - Open PR: `feat/...` -> `development`
   - Review CI results -> Merge into `development`.
2. **Development to Staging**:
   - Open PR: `development` -> `staging`
   - Confirm CI passes -> Approve and merge into `staging`.
3. **Staging to Production / Main (Release)**:
   - Open PR: `staging` -> `production` (or `main`)
   - Approve and merge -> GitHub Actions automatically builds and publishes your new site to GitHub Pages!
