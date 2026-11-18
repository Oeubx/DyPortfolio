---
name: github-pr
description: Create GitHub branches, direct pushes, and pull requests from selected Capstone_BGH root or nested service Git repositories. Use when the user asks to create a branch, push to development, create, open, make, prepare, push, promote, release, or generate pull requests for this workspace. Supports feature-to-development delivery, development-to-staging promotion, and staging-to-main/master promotion.
---

# DyPortfolio GitHub Delivery

Use this repository-local skill to create GitHub branches, direct pushes, and pull requests inside this repository.

## Allowed Delivery Flows

Only these delivery flows are allowed:

1. Feature work to `development`
   - Create or use a feature branch named `<type>/<system>/<feature>`.
   - Example: `feat/auth/system-roles`.
   - Supported actions:
     - Create branch only.
     - Push directly to `development` when the user explicitly asks for direct push.
     - Create a PR from the current branch into `development`.
     - Create the branch, then create a PR into `development`.

2. `development` to `staging`
   - Use the cloud repository's `development` branch as the PR head.
   - Open the PR with `--base staging`.
   - Do not rely on local branch contents; fetch and compare remote refs first.
   - Do not create a feature branch for this promotion flow.

3. `staging` to `main` or `master`
   - Use the cloud repository's `staging` branch as the PR head.
   - Use `main` as the base when the remote has `main`.
   - Use `master` as the base when the remote has `master` and no `main`.
   - Before creating the PR, confirm remote `staging` is ahead of the selected remote base.
   - Do not rely on local branch contents; fetch and compare remote refs first.
   - Do not create a feature branch for this promotion flow.

Treat "developmental" as a typo for `development` only when the user is clearly asking for the feature-to-`development` flow.

Default to PR creation for feature delivery when the user's wording is ambiguous. Direct push to `development` is allowed only when the user explicitly asks to push directly, skip PR, or push to `development`.

Refuse release requests where `staging` is not the PR head. Refuse arbitrary release branches or any flow other than feature delivery to `development`, `development`-to-`staging`, and `staging`-to-`main`/`master`.

## Preflight

Before creating branches, staging, committing, pushing, or opening a pull request:

1. Detect the GitHub operation path for PR actions.
   - Prefer the Codex GitHub plugin or MCP GitHub tools when they are available in the current agent session.
   - Fall back to GitHub CLI (`gh`) when the plugin or MCP tools are unavailable.
   - If the user asked for a PR and neither the plugin nor `gh` is available, stop and report the blocker.

2. Confirm GitHub CLI is available for CLI fallback PR actions.
   If `gh --version` fails, check the fallback path from `AGENTS.md`:
   ```powershell
   & "C:\Program Files\GitHub CLI\gh.exe" --version
   ```
   If found, use the full path for all subsequent `gh` commands. If missing and the user asked for a PR, use the GitHub plugin or MCP path when available; otherwise stop and tell the user to install GitHub CLI and rerun the request. Branch-only and direct-push actions do not require `gh`.

3. Confirm GitHub CLI is authenticated for CLI fallback PR actions:
   ```powershell
   gh auth status -h github.com
   # OR use the full path resolved in step 1
   ```
   If unauthenticated and the user asked for a PR, prefer the GitHub plugin or MCP path when available; otherwise stop and tell the user to run `gh auth login`.
   Avoid echoing token or credential metadata in user-facing summaries.

4. Identify the active Git repository:
   ```powershell
   git rev-parse --show-toplevel
   git status --short --branch
   git branch --show-current
   ```

5. Read applicable instructions before Git operations:
   - Root `AGENTS.md`.
   - Service-local `AGENTS.md`, `README.md`, `docs/README.md`, and relevant `.agents/skills/*` when operating inside a service repo.
   - Service-local git commit skill when present.

6. Resolve backlog tracking before commit or PR drafting.
   - Use `docs/backlogs/UHSE_Sprint_Backlogs_Commit_Reference.md` at the workspace root. It covers Sprint 0–8 and M0–M8; `M#` is a module, not a sprint number.
   - Match the inspected diff's behavior to an explicit Unified PR code / Commit code pair in the feature index. Do not select a merely similar title or prefer a source `Done` row over the actual behavior.
   - For commits, use the listed specialized code, such as `EHR-M7-F13`, `GATEWAY-M2-F3`, or `ANALYTICS-M8-F2`. For PR metadata, use its explicit unified counterpart, such as `UHSE-M7-F13`, `UHSE-M2-F3`, or `UHSE-M8-F2`.
   - Source conflicts are recorded in `docs/backlogs/UHSE_Sprint_Source_Conflicts.md`. Notification dispatch is M3-F4; biometric storage/consent is M3-F5 despite the source's duplicate ID-04 label. EHR clinical access may also map to M7-F7 when the diff supports it.
   - TRACE and Notifications use their service-owned catalogs with independent module numbering. Retain qualified TRACE-/NOTIF- codes in PR metadata for local-only work. Add a unified workbook code only for an explicit behavioral relationship; never blindly replace the prefix.
   - AIMS and VITAL retain approved local operational codes. Use an applicable owning-module F0 for work without a product-feature match; cross-module governance uses ROOT-M0-F0 / UHSE-M0-F0. Do not invent a feature or default all feature work to F0.
   - Retired predictive-sprint/EDA engineering codes are not current aliases. Existing commit subjects in the PR's verbatim Git log remain unchanged.
   - For test fixes, read the existing test's assertions and current registry mapping. Sheet TC-001–TC-061 and executable UHSE-M#-TC-### IDs are independent namespaces; see `docs/backlogs/UHSE_Sheet_QA_Test_Cases.md`. A partial source match, source Done/PASSED cell, or developer test absent from the sheet does not change executed outcomes.

7. Detect the push remote. Prefer the current branch upstream remote. If unavailable, use the remote that has a push URL. Do not assume the remote is named `origin`; some service repos use names such as `UHSE_AUTH` or `BGH_API_GATEWAY`.

8. Verify the required remote branch exists for the selected action:
   ```powershell
   git ls-remote --heads <remote> development
   git ls-remote --heads <remote> staging
   git ls-remote --heads <remote> main
   git ls-remote --heads <remote> master
   ```
   For feature delivery to `development`, `development` must exist before direct push or PR creation. For `development`-to-`staging`, both `development` and `staging` must exist. For `staging`-to-`main`/`master`, `staging` must exist and either `main` or `master` must exist. If a required branch is missing, do not push or create a PR for that repo. Branch-only actions do not require remote branch verification unless the user also asks to push.

9. Resolve the cloud repository coordinates used by GitHub transport:
   - When using the GitHub plugin or MCP tools, resolve and retain `<owner>/<repo>` from the repository remote or tool metadata.
   - When using `gh`, resolve the cloud repository coordinates with:
   ```powershell
   $repoCoords = gh repo view --json nameWithOwner --jq .nameWithOwner
   $owner = $repoCoords.Split('/')[0]
   ```
   Capture `<owner>/<repo>` for repository targeting, and `<owner>` for owner-qualified promotion heads.
   **CRITICAL PowerShell Warning**: When building the head branch string using a variable (e.g. `$owner:development`), PowerShell will parse `owner:` as a variable scope (like `global:`), resulting in a null value. You MUST use `${owner}:development` or string concatenation to prevent silent PR creation failures.

## GitHub Transport Preference

When GitHub operations are needed, prefer the Codex GitHub plugin or MCP GitHub tools when available in the current session.

Fallback order:

1. GitHub plugin or MCP GitHub tools
2. GitHub CLI (`gh`)
3. If neither is available for a PR flow, stop and report the blocker

Do not make plugin availability a requirement for this skill. Many contributors and automation paths will only have `gh`.

## Repository Boundaries

For single-repo changes, operate only inside the active Git root from `git rev-parse --show-toplevel`.

For multi-repo changes:

- If the user explicitly names repositories, operate only on those repositories.
- Resolve repository names to workspace Git roots, for example `UHSE_AUTH`, `BGH_API_GATEWAY`, `UHSE_Frontend`, `AIMS`, `BGH_ANALYTICS`, or root `Capstone_BGH`.
- If a named repository cannot be resolved unambiguously, stop for that repository and ask for clarification.
- If the user does not name repositories, infer repositories from changed files grouped by nearest Git root.
- For promotion flows (`development`-to-`staging` and `staging`-to-`main`/`master`), do not rely only on changed files. If the workspace has multiple Git roots and the target repo is unclear, ask the user to name the repository before creating any PR.
- Group changed files by their nearest Git root.
- Use one selected delivery action per Git repository: branch-only, direct push to `development`, feature PR to `development`, promotion PR from `development` to `staging`, or release PR from `staging` to `main`/`master`.
- Never create one combined PR or push for changes spanning nested service repositories.
- If one repo is blocked, report that repo separately and continue only with other repos that are ready and allowed.

Supported workspace repositories include the root `Capstone_BGH` repo and nested service repos such as `AIMS`, `BGH_ANALYTICS`, `BGH_API_GATEWAY`, `BGH_AUDIT_LOGS`, `TRACE_Backend`, `TRACE_Frontend`, `UHSE_AUTH`, `UHSE_Backend`, `UHSE_Frontend`, `VITAL_Services`, and `VITAL_WEB`.

`AIMS_Advanced_Backend` and `VITAL_AI` are retired recovery/provenance
snapshots, not supported delivery repositories. Do not create branches, pushes,
or pull requests for them as part of active ecosystem work.

## Branching

For feature-to-`development`:

- Use the commit type as the first segment: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`, `ci`, or `revert`.
- Use the owning system or domain as the second segment, such as `auth`, `gateway`, `frontend`, `backend`, `audit`, `aims`, `appointment`, or `telemedicine`.
- Use a short hyphenated feature name as the third segment.
- **Mandate:** The feature segment must be descriptive and focus on the actual work or capability (e.g., `soft-delete-metrics`, `session-bootstrap`, `user-accounts-ui`).
- **Strictly Prohibited:** Do not use generic or process-only words like `sync`, `update`, `fix`, `changes`, or `work` as the feature segment if a more specific feature name can be derived from the changes.

If the current branch is `development`:

- Ask the user to choose between direct push to `development` and creating a new feature branch.
- Do not choose direct push by default.
- If the user chooses direct push, keep working on `development`.
- If the user chooses branch-based delivery, create a new branch named `<type>/<system>/<feature>` for the requested work.

If the current branch is not `development`:

- Check whether the current branch follows `<type>/<system>/<feature>`.
- If it follows the pattern and matches the requested work, keep using it.
- If it does not follow the pattern, rename it before continuing. This is common for placeholder names such as `new-branch`.
- Rename with:

```powershell
git branch -m <type>/<system>/<feature>
```

- If the old branch was already pushed, push the renamed branch and set upstream. Do not delete the old remote branch unless the user explicitly asks.

- For "create branch only", create or switch to the feature branch, then stop. Do not stage, commit, push, or open a PR unless the user also asks for those actions.
- For "direct push to development", switch to `development`, update it from the remote with a non-destructive fast-forward pull, stage only relevant files, commit only if local rules allow it, and push `development` to the detected remote.
- For "create PR from current branch", do not create a new branch unless the branch name is invalid. Verify the current branch is not `development` or `staging`, follows `<type>/<system>/<feature>` after any rename, and is pushed or can be pushed.
- For "do both", create the feature branch first, then continue with commit, push, and PR creation if local repo rules allow those Git operations.

For `development`-to-`staging`:

- Do not create a feature branch.
- Use the cloud repository branches, not local branch contents.
- Fetch `development` and `staging` from the selected remote before comparing or building the PR body. Do not guess the remote name; detect it dynamically:

```powershell
$remote = (git remote | Select-Object -First 1); if (!$remote) { $remote = "origin" }
git fetch $remote development staging
```

- Confirm remote `development` is ahead of remote `staging` before creating a PR:

```powershell
git log --reverse --oneline $remote/staging..$remote/development
```

- If the range is empty, do not create a PR. Report that cloud `development` has no commits ahead of cloud `staging`.
- Before creating a new PR, check for an existing open PR with the same base and head. If one exists, return its URL and do not create a duplicate.
- Create the PR from the cloud `development` branch to the cloud `staging` branch.

For `staging`-to-`main`/`master`:

- Do not create a feature branch.
- Use the cloud repository branches, not local branch contents.
- Select the release base branch by checking the remote: prefer `main`; otherwise use `master`.
- Fetch the selected base branch and `staging`.
- Confirm `staging` is ahead of the selected base before creating a PR:

```powershell
$remote = (git remote | Select-Object -First 1); if (!$remote) { $remote = "origin" }
git log --reverse --oneline $remote/<base>..$remote/staging
```

- If the range is empty, do not create a PR. Report that cloud `staging` has no commits ahead of cloud `<base>`.
- Before creating a new PR, check for an existing open PR with the same base and head. If one exists, return its URL and do not create a duplicate.
- Create the PR from the cloud `staging` branch to the selected cloud base branch.

## Commit Rules

You MUST NOT execute `git commit`, `git push`, or open a pull request automatically unless the user has explicitly requested it in the chat (e.g. "please execute the commit", "push and open the PR"). Proactive or automated committing is strictly prohibited. Always present the draft message/command and wait for confirmation first.

- **Explicit User Gating**: You must obtain explicit user confirmation before running any git commands that mutate remote repositories (e.g., git commit, git push, gh pr create).
- **Structural Compliance**: Always build the commit message according to the repository's local `AGENTS.md` and git commit skill when present.
- **Commit Subject Format**: Commit subjects MUST use Conventional Commit grammar with no extra spaces around the colon:
  ```text
  <type>(<scope>): <specific imperative summary> [<SYSTEM>-M#-F#]
  ```
  Valid types are `feat`, `fix`, `test`, `docs`, `ci`, `chore`, `refactor`, `perf`, `style`, and `revert`. The scope must be the owning system or bounded area, for example `root`, `gateway`, `auth`, `audit`, `backend`, `ehr`, `frontend`, `vital`, `aims`, or a narrower local module when the service guidance already uses one. Do not write free-form sentence subjects such as `Fix linting errors`, `Updated files`, `Address comments`, or `Changes for PR`.
- **PR Repair Commits**: When committing a follow-up that exists mainly to repair a failing PR check, prefer `fix(<scope>): <check-specific repair> [<SYSTEM>-M#-F#]` unless a narrower type is clearly more accurate:
  - Use `fix(<scope>)` for lint, formatting, import, type-check, test-failure, or CI-red repair commits, even when the touched file is a test, because the commit repairs the PR branch.
  - Use `ci(<scope>)` only when the actual CI/workflow configuration changed.
  - Use `docs(<scope>)` only for documentation-only repair commits.
  - Keep the summary specific to the failing check or behavior, for example `fix(ehr): satisfy media service Ruff naming rules [EHR-M7-F8]`, not `fix(ehr): fix lint`.
- **Backlog Compliance**: Use the explicit Commit code paired with the selected unified feature in `docs/backlogs/UHSE_Sprint_Backlogs_Commit_Reference.md`, or the service-owned catalog code (e.g., `GATEWAY-M2-F1`, `EHR-M7-F1`, `AUTH-M3-F2`, `AUDIT_LOGS-M4-F1`, `UHSE-M5-F2`) in the commit subject as `[<SYSTEM>-M#-F#]`. If multiple codes apply, use the primary specialized code in the subject and list the others in a body bullet.
- **UTF-8 Without BOM**: To prevent encoding artifacts (weird characters like `â€"` appearing in commits/PRs), ALWAYS use UTF-8 without BOM for all file operations:
  - When writing files in PowerShell: Use `$encoding = [System.Text.UTF8Encoding]::new($false)` and pass it to `[System.IO.File]::WriteAllText($path, $content, $encoding)`
  - When reading files in PowerShell: Use `$encoding = [System.Text.UTF8Encoding]::new($false)` and use `[System.IO.File]::ReadAllText($path, $encoding)` instead of `Get-Content`
  - When executing `git commit -m` directly, pass the message as a command argument, not via file
  - **PowerShell backtick escaping**: Inside PowerShell double-quoted strings and `@"..."@` here-strings, backtick (`` ` ``) is the escape character. Sequences like `` `b `` (backspace), `` `f `` (form feed), `` `n `` (newline), `` `r `` (carriage return), `` `t `` (tab), and `` `v `` (vertical tab) are silently replaced with control characters. Markdown code spans in PR bodies (e.g., `` `versioning.md` ``) will be corrupted if the body is constructed via a double-quoted string. **Mandate to prevent markdown corruption: NEVER construct the PR body Markdown using PowerShell double-quoted strings (`"..."` or `@"..."@`). Always use a dedicated tool like `write_to_file` to create the markdown directly. Alternatively, if relying on terminal commands, use the provided utility script `.agents/skills/github-pr/scripts/generate_pr_body.py` by first writing a simple JSON config file and passing it to the script. Do not write temporary automation scripts.** This prevents PowerShell from swallowing the backticks.
- **Safety**: Never stage secrets, tokens, credentials, `.env` files, or unrelated user changes. Verify the staged files with `git status` or `git diff --cached` before committing.
- **Local Overrides**: If a repository's local guidance explicitly and recently forbids automated commits (e.g., for sensitive modules), respect that override and generate the commands for the user instead.

## Direct Push

Use direct push only when the user explicitly asks for it. Before pushing:

- Confirm the selected remote has `development`.
- Ensure the local `development` branch is checked out and fast-forwarded from the remote.
- Stage only relevant files and avoid unrelated user changes.
- Commit only if local repo rules allow it (after explicit user confirmation).
- Push with:

```powershell
git push <remote> development
```

## Pull Request Creation

PR titles must be change-aware, not placeholders.

- Do not use generic titles such as `Promote development to staging` or `Promote staging to master`.
- Promotion PR titles must include both the branch direction and a short change theme derived from commits in range.
- Build the change theme by identifying the main feature (`feat`) introduced in the promotion range. Do not blindly use the newest non-merge commit if it is merely a follow-up `fix` or `chore` to a larger feature. Instead, synthesize the primary intent of the commits or use the subject of the most prominent feature commit.
- **Mandate:** Persist the PR title and body together in a single timestamped history markdown file under `.artifacts/tmp/pull-request/<repository-name>/` before creation. This provides a durable local audit trail without a disposable temp pair or timestamped subfolder.
- **Artifact Path:** Use `.artifacts/tmp/pull-request/<repository-name>/YYYY_MM_DD_HHMMSS.md`, where the timestamp is the local run time for that PR. The file MUST be produced by copying `.agents/skills/github-pr/templates/pr-body.md` verbatim and filling its `{{PLACEHOLDER}}` markers. The file therefore begins with `# {{PR_TITLE}}` on line 1 (filled with the actual PR title), a blank line, then the `## Overview` section. Create `.artifacts/tmp/pull-request/<repository-name>/` if it does not exist, and do not delete the file after the PR is created.
- **Temporary Files:** Ensure all temporary files (JSON, logs, txt, etc.) created during your execution are saved in `D:\repos\Capstone_BGH\.artifacts\tmp` so they are gitignored and not accidentally pushed.

## Evidence-Based PR Drafting

PR descriptions must describe the actual diff, not the apparent feature area inferred from filenames, component names, backlog labels, or old commit messages.

Before drafting the PR title or body:

1. Build an evidence set from Git:
   ```powershell
   git diff --name-status <base>..<head>
   git diff --stat <base>..<head>
   git diff --find-renames --find-copies --summary <base>..<head>
   git log --reverse --oneline <base>..<head>
   ```
   For promotion PRs, use the validated remote refs, for example `<remote>/staging..<remote>/development`.
2. Inspect the actual hunks for changed files that will be mentioned:
   ```powershell
   git diff --find-renames --find-copies <base>..<head> -- <path>
   ```
3. Classify each mentioned path by Git status:
   - `A`: newly added file. It is acceptable to say "added" or "created".
   - `M`: existing file modified. Say "updated", "reworked", "overhauled", "wired", "changed", or a more precise behavior verb. Do not say "created", "implemented", or "introduced" unless the hunk truly adds a new capability.
   - `R`: renamed file. Say "renamed" or "moved"; mention behavior changes separately only if hunks show them.
   - `D`: removed file. Say "removed".
4. Write the Overview around the primary user-visible or contract-level change that the diff actually shows. If the main work is an overhaul, navigation link wiring, route change, or refinement of existing components, say that directly. Do not summarize the entire backlog feature as newly built.
5. Write Notable Changes only from inspected evidence. Each bullet should be supportable by a changed path, hunk, route, test, config key, or command output.

Wording constraints:

- Do not claim a file, component, endpoint, page, or workflow was "created", "added", "implemented", or "introduced" unless Git shows it as new (`A`) or the hunk clearly adds that exact behavior.
- Do not generalize from a directory name. For example, touching `src/components/staff/NurseDashboardView.tsx` does not by itself mean the PR implemented the Nurse Dashboard.
- Do not describe old capabilities as part of this PR just because the touched files contain them.
- Prefer precise change verbs: "overhauled", "linked", "routed", "made clickable", "preserved", "validated", "tightened", "aligned", "renamed", "removed", "documented".
- If the PR mainly changes navigation, say which identifiers or routes changed, for example "linked case IDs and MRNs to their detail routes" instead of "implemented case management".
- If uncertainty remains after inspecting the diff, use a narrower statement and add a reviewer note rather than inventing scope.

Calibration example:

- Wrong: "Implemented the Nurse Dashboard and Case Management features, including OPD/ER/inpatient registration forms, items & services recording, room & bed management, and transaction UI."
- Better, when supported by the diff: "Overhauled existing nurse case-management views and linked case IDs and MRNs to their corresponding case and patient-record routes."

## Mandatory Detailed Metadata

Every pull request body MUST be produced by copying `.agents/skills/github-pr/templates/pr-body.md` verbatim and filling the `{{PLACEHOLDER}}` markers. Do not invent new headings, do not reword existing headings, and do not change the section order. This template is the single source of truth for PR body shape across all repos in this workspace; deviating reintroduces the per-agent style drift this skill exists to eliminate.

### Locked body contract

- **Heading style:** ATX (`## Overview`, `## Notable Changes`, ...). Do NOT use bold-paragraph headings (`**Overview**`). Do NOT use `###` or any other level for these section names.
- **Section order (fixed):**
  1. `## Overview` — 2-3 sentence paragraph explaining the high-level intent and impact shown by the diff. Never a placeholder and never a backlog-level summary of work that already existed.
  2. `## Notable Changes` — 3-15 bullets. Past tense. Prefer file/module/contract references over vague verbs. Every bullet must be traceable to an inspected changed file, hunk, route, test, config key, or command output.
  3. `## Related Backlogs` — one bullet per backlog code from `docs/backlogs/UHSE_Sprint_Backlogs_Commit_Reference.md`. Use the explicit unified `UHSE-M#-F#` pair for workbook features, including M8. For service-local work without a workbook counterpart, retain its qualified TRACE-/NOTIF-/approved AIMS-/VITAL- code and identify the local catalog; never fabricate a unified mapping. Use `None identified` only when the backlog file was checked and nothing matched.
  4. `## Commits` — paste the verbatim output of `git log --reverse --oneline <base>..<head>`, oldest first, one commit per bullet as `` - `<short-sha>` <subject> ``. Include merge commits in the range. Do not filter, summarize, or reorder.
  5. `## Tests Run` — bulleted list of concrete verification steps. Use `- No automated tests were run for this release PR.` for pure promotions.
- **Notes For Reviewers is optional.** Include `## Notes For Reviewers` ONLY when there is something repo-specific to flag (paired PR in another repo, skipped check, deployment-order constraint, known follow-up). When there is nothing to add, omit the section entirely. Do not write `None.` under it.
- **No additional sections.** If reviewers need something not covered above, put it under `Notes For Reviewers`. Do not invent new top-level headings.

Failure to copy the template or to follow this contract is a violation of the delivery standard.

Title format for `development`-to-`staging`:

```text
release(root): development -> staging | <change-theme>
```

- Title format for `staging`-to-`main`/`master`:

```text
release(root): staging -> <main-or-master> | <change-theme>
```

- For feature PRs into `development`, keep repository commit conventions and ensure the title reflects actual scope.

After a successful push for feature work, create the PR into `development` using the persisted artifacts.

Transport guidance:

- Prefer the GitHub plugin or MCP GitHub tools to create the PR, reusing the persisted title and body files as the content source.
- Use `gh pr create` as the CLI fallback.

CLI fallback example:

```powershell
# Example workflow
$timestamp = Get-Date -Format "yyyy_MM_dd_HHmmss"
$artifactDir = ".artifacts/tmp/pull-request/<repository-name>"
if (!(Test-Path $artifactDir)) { New-Item -ItemType Directory -Path $artifactDir -Force }
$prFile = "$artifactDir/$timestamp.md"
# Write standard UTF-8 without BOM using .NET API to prevent character encoding issues
$encoding = [System.Text.UTF8Encoding]::new($false)  # false = no BOM
[System.IO.File]::WriteAllText($prFile, "# $title`n`n$body", $encoding)

# Read title and write body to a separate file — NEVER pass body as --body $variable.
# PowerShell interprets backticks in strings (e.g. `b=backspace, `f=form-feed),
# which corrupts markdown code spans. Use --body-file so gh reads bytes directly.
$encoding = [System.Text.UTF8Encoding]::new($false)
$allContent = [System.IO.File]::ReadAllText($prFile, $encoding)
$lines = $allContent -split "`n"
$prTitle = $lines[0].TrimStart('#').Trim()
$bodyContent = ($lines | Select-Object -Skip 2) -join "`n"
$bodyFile = $prFile -replace '\.md$', '-body.md'
[System.IO.File]::WriteAllText($bodyFile, $bodyContent, $encoding)
gh pr create --repo <owner>/<repo> --base development --head <branch> --title $prTitle --body-file $bodyFile
```

For promotion from `development` to `staging`, create the PR from the cloud branch references after the idempotency check.

Transport guidance:

- Prefer the GitHub plugin or MCP GitHub tools for the open-PR lookup and creation.
- Use `gh pr list` and `gh pr create` as the CLI fallback.

CLI fallback:

```powershell
$timestamp = Get-Date -Format "yyyy_MM_dd_HHmmss"
$artifactDir = ".artifacts/tmp/pull-request/<repository-name>"
if (!(Test-Path $artifactDir)) { New-Item -ItemType Directory -Path $artifactDir -Force }
# write the single PR file into $artifactDir before running gh pr create
$prFile = "$artifactDir/$timestamp.md"
# Read title and write body to a separate file — NEVER pass body as --body $variable.
# PowerShell interprets backticks in strings (e.g. `b=backspace, `f=form-feed),
# which corrupts markdown code spans. Use --body-file so gh reads bytes directly.
$encoding = [System.Text.UTF8Encoding]::new($false)
$allContent = [System.IO.File]::ReadAllText($prFile, $encoding)
$lines = $allContent -split "`n"
$prTitle = $lines[0].TrimStart('#').Trim()
$bodyContent = ($lines | Select-Object -Skip 2) -join "`n"
$bodyFile = $prFile -replace '\.md$', '-body.md'
[System.IO.File]::WriteAllText($bodyFile, $bodyContent, $encoding)
gh pr create --repo $repoCoords --base staging --head "${owner}:development" --title $prTitle --body-file $bodyFile
```

This command must be run only after fetching and validating `<remote>/staging..<remote>/development`.
First run an idempotency check and reuse the existing PR when present:

```powershell
gh pr list --repo $repoCoords --state open --base staging --head "${owner}:development" --json number,url,title
```

For promotion from `staging` to `main` or `master`, create the PR from the cloud branch references after the idempotency check.

Transport guidance:

- Prefer the GitHub plugin or MCP GitHub tools for the open-PR lookup and creation.
- Use `gh pr list` and `gh pr create` as the CLI fallback.

CLI fallback:

```powershell
$timestamp = Get-Date -Format "yyyy_MM_dd_HHmmss"
$artifactDir = ".artifacts/tmp/pull-request/<repository-name>"
if (!(Test-Path $artifactDir)) { New-Item -ItemType Directory -Path $artifactDir -Force }
# write the single PR file into $artifactDir before running gh pr create
$prFile = "$artifactDir/$timestamp.md"
# Read title and write body to a separate file — NEVER pass body as --body $variable.
# PowerShell interprets backticks in strings (e.g. `b=backspace, `f=form-feed),
# which corrupts markdown code spans. Use --body-file so gh reads bytes directly.
$encoding = [System.Text.UTF8Encoding]::new($false)
$allContent = [System.IO.File]::ReadAllText($prFile, $encoding)
$lines = $allContent -split "`n"
$prTitle = $lines[0].TrimStart('#').Trim()
$bodyContent = ($lines | Select-Object -Skip 2) -join "`n"
$bodyFile = $prFile -replace '\.md$', '-body.md'
[System.IO.File]::WriteAllText($bodyFile, $bodyContent, $encoding)
gh pr create --repo $repoCoords --base <main-or-master> --head "${owner}:staging" --title $prTitle --body-file $bodyFile
```

This command must be run only after fetching and validating `<remote>/<main-or-master>..<remote>/staging`.
First run an idempotency check and reuse the existing PR when present:

```powershell
gh pr list --repo $repoCoords --state open --base <main-or-master> --head "${owner}:staging" --json number,url,title
```

The PR body for every flow (feature-to-`development`, `development`-to-`staging`, and `staging`-to-`main`/`master`) MUST follow the locked body contract in the `## Mandatory Detailed Metadata` section above, produced by copying `.agents/skills/github-pr/templates/pr-body.md`.

Promotion-PR-specific body requirements (on top of the locked contract):

- Do not use placeholder or truncated content.
- Ensure the `## Overview` and `## Notable Changes` sections explicitly reflect the commits being promoted (not the feature work in the abstract).
- If the promotion range contains a recently merged feature PR, mention that merge by PR number in `## Notable Changes`.
- The `## Commits` section MUST be the verbatim output of `git log --reverse --oneline <remote>/<base>..<remote>/<head>` for promotion flows, including merge commits.

Build the commit list from the selected PR range:

```powershell
git log --reverse --oneline <base>..<head>
```

For promotion PRs, build this list from remote refs such as `<remote>/staging..<remote>/development` or `<remote>/<main-or-master>..<remote>/staging`.

Do not include secrets, `.env` values, tokens, credentials, or sensitive local paths in the PR body.

## Completion

Return the PR URL for each successfully created PR, or the pushed branch/commit when direct push succeeds. If an existing open PR was reused, return that existing PR URL and clearly state no new PR was created. If a repo was skipped or blocked, state the repo name and the exact reason, such as missing `development`, missing `staging`, missing `gh` for PR creation, unauthenticated `gh`, no push remote, unsupported delivery flow, ambiguous repo selection, or local rules forbidding automated commits.
