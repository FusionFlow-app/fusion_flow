#!/bin/bash

set -euo pipefail

MODE="${FUSION_FLOW_MODE:-${1:-all}}"

if [ $# -gt 0 ] && [ "$1" = "$MODE" ]; then
  shift
fi

if [ -z "${SECRET_KEY_BASE:-}" ]; then
  echo "SECRET_KEY_BASE is empty. Generating a random one..."
  export SECRET_KEY_BASE
  SECRET_KEY_BASE="$(openssl rand -base64 48)"
fi

run_seeds="${FUSION_FLOW_RUN_SEEDS:-true}"

wait_for_worker_db() {
  echo "Waiting for database..."
  while ! /app/worker/bin/fusion_flow_worker eval "FusionFlowCore.Repo.__adapter__().storage_status(FusionFlowCore.Repo.config())" > /dev/null 2>&1; do
    echo "Database not ready, retrying in 2s..."
    sleep 2
  done

  echo "Database ready!"
}

prepare_ui() {
  echo "Waiting for database and running migrations..."
  while ! /app/ui/bin/fusion_flow_ui eval "FusionFlowCore.Release.migrate" > /dev/null 2>&1; do
    echo "Migration failed, retrying in 2s..."
    sleep 2
  done

  echo "Migrations successful!"

  if [ "$run_seeds" = "true" ]; then
    echo "Running seeds..."
    /app/ui/bin/fusion_flow_ui eval "FusionFlowCore.Release.seed"
  fi
}

start_ui() {
  echo "Starting UI application in ${FUSION_FLOW_UI_MODE:-full} mode..."
  exec /app/ui/bin/fusion_flow_ui start "$@"
}

start_worker() {
  echo "Starting worker application..."
  exec /app/worker/bin/fusion_flow_worker start "$@"
}

start_all() {
  echo "Starting worker application in background..."
  /app/worker/bin/fusion_flow_worker start &
  worker_pid=$!

  cleanup() {
    kill -TERM "$worker_pid" 2>/dev/null || true
    wait "$worker_pid" 2>/dev/null || true
  }

  trap cleanup INT TERM EXIT

  echo "Starting UI application..."
  /app/ui/bin/fusion_flow_ui start &
  ui_pid=$!

  set +e
  wait -n "$ui_pid" "$worker_pid"
  status=$?
  set -e

  kill -TERM "$ui_pid" "$worker_pid" 2>/dev/null || true
  wait "$ui_pid" 2>/dev/null || true
  wait "$worker_pid" 2>/dev/null || true

  exit "$status"
}

case "$MODE" in
  ui)
    prepare_ui
    start_ui "$@"
    ;;
  worker)
    wait_for_worker_db
    start_worker "$@"
    ;;
  all|"")
    prepare_ui
    start_all
    ;;
  *)
    echo "Invalid mode: $MODE"
    echo "Use one of: ui, worker, all"
    exit 1
    ;;
esac
