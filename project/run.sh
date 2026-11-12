#!/bin/sh
# Serves the folder as static files. Nothing to install.
cd "$(dirname "$0")" || exit 1
exec python3 -m http.server "${PORT:-8000}" --bind "${HOST:-127.0.0.1}"
