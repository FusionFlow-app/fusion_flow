# FusionFlow Public API Guide

This guide will help you get started with the FusionFlow Public API.

## Authentication

All API requests require authentication using an API key. You can pass the API key in the `Authorization` header.

```bash
curl -H "Authorization: Bearer ff_live_ab12cd34_xxxxxxxxxxxxxxxxxxxxxxxx" \
  https://api.fusionflow.com/api/v1/workflows
```

Alternatively, you can use the `X-FusionFlow-API-Key` header:

```bash
curl -H "X-FusionFlow-API-Key: ff_live_ab12cd34_xxxxxxxxxxxxxxxxxxxxxxxx" \
  https://api.fusionflow.com/api/v1/workflows
```

## Examples

### 1. Create Workflow

```bash
curl -X POST https://api.fusionflow.com/api/v1/workflows \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": {
      "name": "Customer onboarding",
      "nodes": [
        {
          "id": "start",
          "type": "Start",
          "label": "Start",
          "controls": {},
          "position": { "x": 0, "y": 0 }
        },
        {
          "id": "output",
          "type": "Output",
          "label": "Output",
          "controls": {},
          "position": { "x": 200, "y": 0 }
        }
      ],
      "connections": [
        {
          "source": "start",
          "sourceOutput": "exec",
          "target": "output",
          "targetInput": "exec"
        }
      ]
    }
  }'
```

### 2. List Nodes

```bash
curl -X GET https://api.fusionflow.com/api/v1/nodes \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 3. Create Execution

```bash
curl -X POST https://api.fusionflow.com/api/v1/workflows/123/executions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "trigger": "api",
      "variables": {
        "user_id": 42
      }
    }
  }'
```

### 4. Consult Execution

```bash
curl -X GET https://api.fusionflow.com/api/v1/workflows/123/executions/blue-orbit-route \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Rate Limits

The API is rate limited to 100 requests per minute per API key. If you exceed this limit, you will receive a `429 Too Many Requests` response.

## OpenAPI Documentation

For a full list of endpoints and schemas, refer to the [openapi.yaml](./openapi.yaml) file.
