#!/usr/bin/env node
/**
 * Render.com Model Context Protocol (MCP) Server
 * Implements JSON-RPC 2.0 stdio transport for Render Cloud Management
 */

import readline from 'readline';

const RENDER_API_BASE = 'https://api.render.com/v1';

function getApiKey() {
  return process.env.RENDER_API_KEY || '';
}

async function renderRequest(endpoint, options = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('RENDER_API_KEY is not configured. Please set your Render API key (from https://dashboard.render.com/u/settings#api-keys).');
  }

  const url = `${RENDER_API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    ...(options.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    const errorMsg = json.message || json.error || text || `HTTP ${res.status}`;
    throw new Error(`Render API Error (${res.status}): ${errorMsg}`);
  }

  return json;
}

const TOOLS = [
  {
    name: 'render_list_owners',
    description: 'List owners/workspaces accessible by the authenticated Render account',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'render_list_services',
    description: 'List all web services, static sites, databases and cron jobs on Render',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum number of services to return (default 20)' },
      },
    },
  },
  {
    name: 'render_get_service',
    description: 'Get details, deployment status, and live URL of a specific Render service',
    inputSchema: {
      type: 'object',
      required: ['serviceId'],
      properties: {
        serviceId: { type: 'string', description: 'The unique ID of the Render service (e.g. srv-c...)' },
      },
    },
  },
  {
    name: 'render_create_free_web_service',
    description: 'Create and deploy a new free-tier Web Service on Render directly from a GitHub repository',
    inputSchema: {
      type: 'object',
      required: ['name', 'repo', 'ownerId'],
      properties: {
        name: { type: 'string', description: 'The name of the service (e.g. love-connection)' },
        repo: { type: 'string', description: 'GitHub repo URL (e.g. https://github.com/Aman0stack/love-connection)' },
        branch: { type: 'string', description: 'Branch to deploy (default: main)' },
        ownerId: { type: 'string', description: 'The Render owner ID (obtain via render_list_owners)' },
        buildCommand: { type: 'string', description: 'Build command (default: npm install && npm run build)' },
        startCommand: { type: 'string', description: 'Start command (default: npm start)' },
        healthCheckPath: { type: 'string', description: 'Health check path (default: /api/health)' },
        envVars: {
          type: 'array',
          description: 'Key-value environment variables to inject',
          items: {
            type: 'object',
            properties: {
              key: { type: 'string' },
              value: { type: 'string' },
            },
          },
        },
      },
    },
  },
  {
    name: 'render_trigger_deploy',
    description: 'Trigger a new manual deployment for an existing Render service',
    inputSchema: {
      type: 'object',
      required: ['serviceId'],
      properties: {
        serviceId: { type: 'string', description: 'The unique ID of the Render service' },
        clearCache: { type: 'boolean', description: 'Whether to clear build cache (default: false)' },
      },
    },
  },
  {
    name: 'render_get_deploys',
    description: 'List recent deployments and build logs status for a service',
    inputSchema: {
      type: 'object',
      required: ['serviceId'],
      properties: {
        serviceId: { type: 'string', description: 'The unique ID of the Render service' },
        limit: { type: 'number', description: 'Maximum deploys to list (default: 5)' },
      },
    },
  },
];

async function handleToolCall(name, args) {
  switch (name) {
    case 'render_list_owners': {
      const owners = await renderRequest('/owners');
      return owners;
    }
    case 'render_list_services': {
      const limit = args.limit || 20;
      const services = await renderRequest(`/services?limit=${limit}`);
      return services;
    }
    case 'render_get_service': {
      const service = await renderRequest(`/services/${args.serviceId}`);
      return service;
    }
    case 'render_create_free_web_service': {
      const payload = {
        type: 'web_service',
        name: args.name,
        ownerId: args.ownerId,
        repo: args.repo,
        branch: args.branch || 'main',
        autoDeploy: 'yes',
        serviceDetails: {
          env: 'node',
          plan: 'free',
          region: 'oregon',
          buildCommand: args.buildCommand || 'npm install && npm run build',
          startCommand: args.startCommand || 'npm start',
          healthCheckPath: args.healthCheckPath || '/api/health',
          envVars: [
            { key: 'NODE_ENV', value: 'production' },
            ...(args.envVars || []),
          ],
        },
      };
      const created = await renderRequest('/services', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return created;
    }
    case 'render_trigger_deploy': {
      const deploy = await renderRequest(`/services/${args.serviceId}/deploys`, {
        method: 'POST',
        body: JSON.stringify({
          clearCache: args.clearCache ? 'clear' : 'do_not_clear',
        }),
      });
      return deploy;
    }
    case 'render_get_deploys': {
      const limit = args.limit || 5;
      const deploys = await renderRequest(`/services/${args.serviceId}/deploys?limit=${limit}`);
      return deploys;
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// JSON-RPC 2.0 stdio handler
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', async (line) => {
  if (!line.trim()) return;

  let request;
  try {
    request = JSON.parse(line);
  } catch (err) {
    sendResponse(null, { code: -32700, message: 'Parse error' }, null);
    return;
  }

  const { id, method, params } = request;

  try {
    if (method === 'initialize') {
      sendResult(id, {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: 'render-mcp-server',
          version: '1.0.0',
        },
      });
    } else if (method === 'notifications/initialized') {
      // No response needed for notification
    } else if (method === 'ping') {
      sendResult(id, {});
    } else if (method === 'tools/list') {
      sendResult(id, { tools: TOOLS });
    } else if (method === 'tools/call') {
      const { name, arguments: args } = params || {};
      const result = await handleToolCall(name, args || {});
      sendResult(id, {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      });
    } else {
      sendResponse(id, { code: -32601, message: `Method not found: ${method}` }, null);
    }
  } catch (err) {
    sendResult(id, {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Error: ${err.message}`,
        },
      ],
    });
  }
});

function sendResult(id, result) {
  if (id === undefined || id === null) return;
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n');
}

function sendResponse(id, error, result) {
  const res = { jsonrpc: '2.0', id };
  if (error) res.error = error;
  else res.result = result;
  process.stdout.write(JSON.stringify(res) + '\n');
}
