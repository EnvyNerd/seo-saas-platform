#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
"$SCRIPT_DIR/backend/venv/bin/python" "$SCRIPT_DIR/backend/cli.py" "$@"
