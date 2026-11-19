# DyPortfolio Branch Governance & Protection Rules

This document details the branch lifecycle, gating rules, and repository configurations ensuring that **Prince Amorsolo C. Remo** retains sole ownership and release authority across `main`, `development`, `staging`, and `production`.

---

## 1. Branch Hierarchy & Version Mapping

DyPortfolio separates the open-source **Generalized Template** from **Prince's Personal Production Deployment**:

```
[Generalized Template Version]
feature/<category>/<description>
         │
         ▼ (PR with CI checks OR Direct merge by Prince)
   development  (Open-Source Generalized Template Branch)
         │
         ▼ (Merged into main when finalized as template reference)
      main      (Official Open-Source Repository Template)

[Prince's Personal Version]
personal/<category>/<description>
         │
         ▼ (Promotion PR with Prince's authentic data)
     staging    (Pre-production Verification - Personal Version)
         │
         ▼ (Promotion PR + CI Checks + Owner Review)
   production   (Live Personal Deployment on Vercel)
```

1. **`development` Branch**:
   - Houses the complete, open-source **Generalized Version**.
   - Contains generic configuration (`portfolio.config.ts`), placeholder datasets (`starterData.json`), and fork guides for the public.
2. **`main` Branch**:
   - The canonical public GitHub branch where developers land to fork and clone the Generalized Template.
3. **`staging` Branch**:
   - Reserved strictly for testing **Prince's Personal Version** (populated with authentic career achievements, real credentials, and private Supabase keys).
4. **`production` Branch**:
   - The live production source targeting Vercel (`dyportfolio.vercel.app`) for **Prince's Personal Deployment**.

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
