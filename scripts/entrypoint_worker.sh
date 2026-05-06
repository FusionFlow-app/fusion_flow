#!/bin/bash
# entrypoint_worker.sh — entrypoint for the fusion_flow_worker release

set -e

echo "Waiting for database..."
while ! /app/bin/fusion_flow_worker eval "FusionFlowCore.Repo.__adapter__().storage_status(FusionFlowCore.Repo.config())" > /dev/null 2>&1; do
  echo "Database not ready, retrying in 2s..."
  sleep 2
done

echo "Database ready!"

echo "Starting worker application..."
exec /app/bin/fusion_flow_worker start
