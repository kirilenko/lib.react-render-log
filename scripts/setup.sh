#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[info]${NC} $1"; }
warn()  { echo -e "${YELLOW}[warn]${NC} $1"; }
error() { echo -e "${RED}[error]${NC} $1"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

NODE_VERSION=$(cat "$PROJECT_ROOT/.nvmrc" | tr -d '[:space:]')
PNPM_VERSION=$(grep '"packageManager"' "$PROJECT_ROOT/package.json" | sed 's/.*pnpm@\([^"]*\).*/\1/')

info "Node.js: $NODE_VERSION"
info "pnpm:    $PNPM_VERSION"
echo ""

# Load nvm
export NVM_DIR="$HOME/.nvm"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
    source "$NVM_DIR/nvm.sh"
elif [[ -s "/opt/homebrew/opt/nvm/nvm.sh" ]]; then
    source "/opt/homebrew/opt/nvm/nvm.sh"
elif [[ -s "/usr/local/opt/nvm/nvm.sh" ]]; then
    source "/usr/local/opt/nvm/nvm.sh"
else
    error "nvm not found. Install it: https://github.com/nvm-sh/nvm"
    exit 1
fi

# Install and use the required Node version
info "Installing Node.js $NODE_VERSION..."
nvm install "$NODE_VERSION"
nvm use "$NODE_VERSION"
info "Node.js $(node --version) active"

# Activate the required pnpm version via corepack
info "Activating pnpm $PNPM_VERSION via corepack..."
corepack enable
corepack prepare "pnpm@$PNPM_VERSION" --activate
info "pnpm $(pnpm --version) active"

echo ""
info "Installing dependencies..."
cd "$PROJECT_ROOT" && pnpm install
