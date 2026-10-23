#!/usr/bin/env bash
# ==============================================================================
# ChronoOS - Autonomous Executive Chief of Staff
# One-Command Local Startup Script
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

HOST="${CHRONO_HOST:-127.0.0.1}"
PORT="${CHRONO_PORT:-8000}"

echo "=================================================================="
echo " ChronoOS :: Autonomous Executive Chief of Staff"
echo " Initializing Local Runtime Environment"
echo "=================================================================="

# 1. Environment Configuration Check
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "[INFO] No .env file found. Creating from .env.example..."
        cp .env.example .env
        echo "[INFO] Default .env created. Update with your AWS credentials if required."
    else
        echo "[WARN] Neither .env nor .env.example found. Running with default environment."
    fi
fi

# 2. Python Environment Setup
# Prefer uv if installed for lightning-fast execution; fallback to venv/python3
if command -v uv >/dev/null 2>&1; then
    echo "[INFO] Using uv runtime package manager."
    RUN_CMD="uv run --with-requirements requirements.txt uvicorn backend.api_gateway:app --host ${HOST} --port ${PORT} --reload"
elif [ -d ".venv" ] && [ -f ".venv/bin/uvicorn" ]; then
    echo "[INFO] Using existing virtual environment in .venv."
    RUN_CMD=".venv/bin/uvicorn backend.api_gateway:app --host ${HOST} --port ${PORT} --reload"
elif command -v python3 >/dev/null 2>&1; then
    if [ ! -d ".venv" ]; then
        echo "[INFO] Creating Python virtual environment in .venv..."
        python3 -m venv .venv
        .venv/bin/pip install --upgrade pip
        if [ -f "requirements.txt" ]; then
            echo "[INFO] Installing dependencies from requirements.txt..."
            .venv/bin/pip install -r requirements.txt
        fi
    fi
    RUN_CMD=".venv/bin/uvicorn backend.api_gateway:app --host ${HOST} --port ${PORT} --reload"
else
    echo "[ERROR] Python 3 or uv is required to run ChronoOS, but neither was found."
    exit 1
fi

# 3. Check Port Availability
if lsof -Pi :${PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "[WARN] Port ${PORT} is already occupied by another process."
    echo "[INFO] You can terminate the existing process or run on another port:"
    echo "       CHRONO_PORT=8001 ./start.sh"
    read -r -p "Terminate process on port ${PORT} and continue? [y/N]: " CONFIRM || true
    if [[ "${CONFIRM:-}" =~ ^[Yy]$ ]]; then
        PID=$(lsof -Pi :${PORT} -sTCP:LISTEN -t)
        echo "[INFO] Terminating PID ${PID}..."
        kill -9 "${PID}" || true
        sleep 1
    else
        echo "[INFO] Startup cancelled by user."
        exit 0
    fi
fi

# 4. Open Browser Helper (macOS / Linux)
(
    sleep 1.5
    TARGET_URL="http://${HOST}:${PORT}"
    if command -v open >/dev/null 2>&1; then
        open "${TARGET_URL}"
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open "${TARGET_URL}"
    fi
) &

# 5. Launch Service
echo "------------------------------------------------------------------"
echo " ChronoOS Gateway listening on: http://${HOST}:${PORT}"
echo " Echo Show 15 Simulator Mode:   Press [Cmd+E] in browser"
echo " Picture-in-Picture HUD Mode:   Press [Cmd+P] in browser"
echo " Press [Ctrl+C] to stop server"
echo "------------------------------------------------------------------"

exec ${RUN_CMD}
