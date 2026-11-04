#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

export PATH="${HOME}/.local/bin:/opt/homebrew/bin:/usr/local/bin:${PATH}"
unset GIT_ASKPASS
unset SSH_ASKPASS
export GIT_TERMINAL_PROMPT=1

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) not found. Run first:"
  echo "  bash scripts/install-gh.sh"
  echo '  export PATH="$HOME/.local/bin:$PATH"'
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Log in to GitHub (browser or device code):"
  gh auth login --hostname github.com --git-protocol https --web
  gh auth setup-git
fi

git push -u origin feature-about
echo "Pushed: origin/feature-about"
