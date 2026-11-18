# {{PR_TITLE}}

## Overview

{{2-3 sentence paragraph explaining the high-level intent and impact shown by the diff. State what changed and why it matters. Do not summarize an entire backlog feature as newly built when this PR only modifies, overhauls, or links existing behavior.}}

## Notable Changes

- {{Specific technical bullet based on inspected diff evidence. Reference the file, module, route, or contract that changed. Past tense. Use "added/created" only for newly added files or truly new behavior.}}
- {{Bullet 2}}
- {{Bullet 3}}
- {{...add more as needed. 3-15 bullets total.}}

## Related Backlogs

- `{{UHSE-M#-F#}}` — {{Short feature label. Pull from docs/backlogs/UHSE_Sprint_Backlogs_Commit_Reference.md. Use the explicit unified counterpart for workbook features, including M8. For service-local features without a workbook counterpart, use the qualified local code and name its catalog; do not convert independent namespaces by prefix replacement.}}
- {{...one bullet per backlog code that this PR completes or materially advances. Use `None identified` only when the backlog file was checked and no code reasonably matches.}}

## Commits

{{Paste the verbatim output of `git log --reverse --oneline <base>..<head>`, one commit per bullet, including merge commits. Format each line as:}}

- `{{short-sha}}` {{commit subject}}
- {{...}}

## Tests Run

- {{Concrete verification step. Name the test file, the command, or the manual check.}}
- {{...one bullet per check. Use `No automated tests were run for this release PR.` when the PR is a pure promotion with no code execution.}}

## Notes For Reviewers

{{Optional. Include this section ONLY when there is something repo-specific to flag: a paired PR in another repo, a skipped check, a known follow-up, a deployment-order constraint, etc. If there is nothing to add, omit the entire section.}}

- {{Bullet}}
