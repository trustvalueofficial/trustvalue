#!/usr/bin/env bash
# Install GitHub CLI to ~/.local/bin (no Homebrew required).
set -euo pipefail

BIN_DIR="${HOME}/.local/bin"
mkdir -p "${BIN_DIR}"

case "$(uname -m)" in
  arm64) ARCH="arm64" ;;
  x86_64) ARCH="amd64" ;;
  *) echo "Unsupported CPU: $(uname -m)"; exit 1 ;;
esac

VERSION="2.63.2"
ZIP="gh_${VERSION}_macOS_${ARCH}.zip"
URL="https://github.com/cli/cli/releases/download/v${VERSION}/${ZIP}"
TMP="$(mktemp -d)"

echo "Downloading GitHub CLI ${VERSION} (${ARCH})..."
curl -fsSL "${URL}" -o "${TMP}/${ZIP}"
unzip -q -o "${TMP}/${ZIP}" -d "${TMP}"
install -m 755 "${TMP}/gh_${VERSION}_macOS_${ARCH}/bin/gh" "${BIN_DIR}/gh"
rm -rf "${TMP}"

echo ""
echo "Installed: ${BIN_DIR}/gh"
"${BIN_DIR}/gh" version
echo ""
echo "Add to your shell (one time), then open a new terminal tab:"
echo '  echo '\''export PATH="$HOME/.local/bin:$PATH"'\'' >> ~/.zshrc'
echo "  source ~/.zshrc"
