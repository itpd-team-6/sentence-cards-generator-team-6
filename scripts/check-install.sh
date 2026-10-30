#!/usr/bin/env bash
#
# check-install.sh is the scripted test of QR-03: a person outside the team
# installs and runs the product by following only docs/setup.md.
# docs/setup.md is the source of truth; when a step here differs from that page,
# the page is right and this script is changed in the same pull request.
#
# The script clones a clean checkout of the repository into a new temporary
# folder, follows the Install, Configuration and Run steps of docs/setup.md,
# opens the start page and /api/health, and then stops the backend and removes
# the temporary folder. It runs on a development machine or on the VM, never in
# the product CI.
#
# Usage: bash scripts/check-install.sh
# It exits 0 when the product installs, starts and answers; on a failed step it
# names the step and exits with a non-zero code. It holds no address, key or
# secret: the repository URL is read from this checkout's git remote, and the
# .env it writes is the committed .env.example with its empty placeholders.

set -euo pipefail

# ---- helpers ---------------------------------------------------------------

step() {
  printf '\n==> %s\n' "$1"
  CURRENT_STEP="$1"
}

# On any error, name the step that failed. The EXIT trap below does the cleanup.
on_error() {
  printf '\nFAILED at step: %s\n' "${CURRENT_STEP:-unknown}" >&2
}
trap on_error ERR

BACKEND_PID=""
WORKDIR=""

cleanup() {
  # Stop the backend if it is still running, so no process is left behind.
  if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true
  fi
  # Remove the temporary checkout, so no file is left outside it.
  if [ -n "$WORKDIR" ] && [ -d "$WORKDIR" ]; then
    rm -rf "$WORKDIR"
  fi
}
trap cleanup EXIT

# A free TCP port, asked from the operating system so the script needs no fixed
# address and does not clash with a product already running on the default port.
free_port() {
  python3 - <<'PY'
import socket
s = socket.socket()
s.bind(("127.0.0.1", 0))
print(s.getsockname()[1])
s.close()
PY
}

# ---- locate the repository to clone ----------------------------------------

step "Find the repository URL from this checkout"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_URL="$(git -C "$REPO_ROOT" config --get remote.origin.url)"
if [ -z "$REPO_URL" ]; then
  echo "No git remote 'origin' found in $REPO_ROOT" >&2
  exit 1
fi

# ---- docs/setup.md: Install ------------------------------------------------

step "Clone the repository into a new temporary folder"
WORKDIR="$(mktemp -d)"
git clone --depth 1 "$REPO_URL" "$WORKDIR/sentence-cards-generator-team-6"
REPO="$WORKDIR/sentence-cards-generator-team-6"

step "Install the backend in a virtual environment"
cd "$REPO/backend"
python3 -m venv .venv
# shellcheck disable=SC1091
source .venv/bin/activate
pip install -r requirements.txt
cd "$REPO"

step "Install the front end and build it"
cd "$REPO/frontend"
npm ci
npm run build
cd "$REPO"

# ---- docs/setup.md: Configuration ------------------------------------------

step "Copy .env from .env.example"
cp .env.example .env

# ---- docs/setup.md: Run ----------------------------------------------------

step "Start the backend on a free port"
PORT="$(free_port)"
cd "$REPO/backend"
python -m uvicorn app.main:app --port "$PORT" >"$WORKDIR/uvicorn.log" 2>&1 &
BACKEND_PID=$!
cd "$REPO"

step "Wait for the backend to answer"
BASE="http://127.0.0.1:$PORT"
ready=""
for _ in $(seq 1 30); do
  if curl -fsS "$BASE/api/health" >/dev/null 2>&1; then
    ready="yes"
    break
  fi
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "The backend stopped before it answered; its log follows:" >&2
    cat "$WORKDIR/uvicorn.log" >&2
    exit 1
  fi
  sleep 1
done
if [ -z "$ready" ]; then
  echo "The backend did not answer on $BASE within the time allowed; its log follows:" >&2
  cat "$WORKDIR/uvicorn.log" >&2
  exit 1
fi

step "Open the health route /api/health"
health="$(curl -fsS "$BASE/api/health")"
case "$health" in
*'"status"'*'"ok"'*) : ;;
*)
  echo "Unexpected answer from /api/health: $health" >&2
  exit 1
  ;;
esac

step "Open the start page /"
curl -fsS "$BASE/" >/dev/null

# ---- done ------------------------------------------------------------------

printf '\nThe product installed, started and answered. QR-03 install check passed.\n'
