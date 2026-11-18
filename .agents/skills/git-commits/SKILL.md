---
name: git-commits
description: Drafts or executes backlog-linked DyPortfolio commit messages using the canonical DP backlog reference.
---

# DyPortfolio Git Commit Skill

Use this skill when asked to draft, generate, review, or execute a commit for `DyPortfolio`.

## Required References

1. Read `README.md` and `docs/BRANCH_GOVERNANCE.md` in this repository.
2. Read or search `docs/backlogs/DP_Sprint_Backlogs_Commit_Reference.md`.

The backlog reference is the source of truth for the backlog code. Translate changes to the specialized system prefix `DP-` for commits (e.g., `DP-M0-F1` or `DP-M3-F2`).

## Workflow

1. Inspect changed files with `git status --short` and `git diff --stat`.
2. Map the implemented changes to the corresponding sprint feature code `[DP-M#-F#]`.
3. Draft one message using:

   ```text
   <type>(<scope>): <concise description in past-tense> [DP-M#-F#]

   - <Past-tense change bullet>
   - <Past-tense change bullet>
   ```

   Valid types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`, `perf`, `style`, `revert`.
   Common scopes: `infra`, `auth`, `db`, `ui`, `resume`, `certs`, `telemetry`, `template`.
4. Keep all file paths relative (`./src/...` or `./docs/...`). Do not use absolute paths.
5. Provide a short, human-readable summary of the commit.

## Output And Commit Execution

- You MUST NOT execute `git commit`, `git push`, or open a pull request automatically unless the user has explicitly requested it in the chat.
- Always present the draft message/command and wait for confirmation.
- **UTF-8 Without BOM**: Always write commit files strictly as UTF-8 without BOM to prevent BOM corruption.
- Never commit private secrets, `.env`, `.env.local`, or sensitive credentials.
