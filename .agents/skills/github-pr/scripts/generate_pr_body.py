import os
import sys
import json
import subprocess
from datetime import datetime

def run_git_log(base, head):
    cmd = ["git", "log", "--reverse", "--oneline", f"{base}..{head}"]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        lines = result.stdout.strip().split('\n')
        commits = []
        for line in lines:
            if line.strip():
                parts = line.split(' ', 1)
                if len(parts) == 2:
                    commits.append(f"- `{parts[0]}` {parts[1]}")
        return '\n'.join(commits)
    except subprocess.CalledProcessError as e:
        print(f"Error running git log: {e.stderr}", file=sys.stderr)
        sys.exit(1)

def main():
    if len(sys.argv) < 3:
        print("Usage: python generate_pr_body.py <path_to_config.json> <output_dir>")
        sys.exit(1)

    config_path = sys.argv[1]
    output_dir = sys.argv[2]

    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)

    title = config.get("title", "Update")
    overview = config.get("overview", "")
    notable_changes = config.get("notable_changes", [])
    related_backlogs = config.get("related_backlogs", [])
    tests_run = config.get("tests_run", [])
    base = config.get("base", "")
    head = config.get("head", "")
    notes = config.get("notes_for_reviewers", [])

    # Fetch commits
    commits_str = run_git_log(base, head) if base and head else ""

    # Build Markdown
    changes_str = '\n'.join([f"- {c}" for c in notable_changes])
    backlogs_str = '\n'.join([f"- {b}" for b in related_backlogs])
    tests_str = '\n'.join([f"- {t}" for t in tests_run])
    
    body = f"""## Overview

{overview}

## Notable Changes

{changes_str}

## Related Backlogs

{backlogs_str}

## Commits

{commits_str}

## Tests Run

{tests_str}
"""

    if notes:
        notes_str = '\n'.join([f"- {n}" for n in notes])
        body += f"\n## Notes For Reviewers\n\n{notes_str}\n"

    full_md = f"# {title}\n\n{body}"

    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y_%m_%d_%H%M%S")
    pr_file = os.path.join(output_dir, f"{timestamp}.md")
    body_file = os.path.join(output_dir, f"{timestamp}-body.md")

    with open(pr_file, 'w', encoding='utf-8') as f:
        f.write(full_md)
        
    with open(body_file, 'w', encoding='utf-8') as f:
        f.write(body)

    print(f"Generated PR files:\n- {pr_file}\n- {body_file}")

if __name__ == "__main__":
    main()
