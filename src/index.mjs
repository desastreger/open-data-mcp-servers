#!/usr/bin/env node
/**
 * Open Data B2B & Compliance MCP Router (STDIO <-> Streamable HTTP)
 *
 * Security & Trust Invariants:
 * - Zero external npm dependencies (0 supply-chain CVEs).
 * - Zero filesystem (fs) or shell/process (child_process) imports.
 * - Strict frozen endpoint allowlist (TOOL_ROUTES) preventing SSRF.
 * - All 22 tools carry readOnlyHint: true, destructiveHint: false, idempotentHint: true.
 * - Boots cleanly without credentials so security sandboxes can inspect initialize & tools/list;
 *   APIFY_TOKEN is only required when invoking live remote tools/call requests.
 */

import { MCP_TOOLS, SERVER_INFO, TOOL_ROUTES } from "./tools_catalog.mjs";

const SUPPORTED_PROTOCOL_VERSION = "2025-03-26";
const REQUEST_TIMEOUT_MS = 30_000;

function sanitizeErrorMessage(raw, token) {
  const msg = String(raw || "Unexpected upstream error");
  if (token && token.length >= 6) {
    return msg.split(token).join("[REDACTED_TOKEN]");
  }
  return msg;
}

export async function forwardToolCall(toolName, args, token, fetchImpl = globalThis.fetch) {
  if (!Object.hasOwn(TOOL_ROUTES, toolName)) {
    return {
      isError: true,
      content: [{ type: "text", text: `Unknown tool "${toolName}". Call tools/list to inspect the 22 supported read-only tools.` }],
    };
  }
  if (args !== undefined && (typeof args !== "object" || args === null || Array.isArray(args))) {
    return {
      isError: true,
      content: [{ type: "text", text: "Invalid tool arguments: expected a JSON object matching inputSchema." }],
    };
  }

  const cleanToken = String(token || "").trim();
  if (!cleanToken) {
    const { slug } = TOOL_ROUTES[toolName];
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Missing APIFY_TOKEN environment variable. Set APIFY_TOKEN (free $5/mo tier at https://console.apify.com/settings/integrations) to invoke "${toolName}" on https://desastreger--${slug}.apify.actor/mcp.`,
        },
      ],
    };
  }

  const { endpoint } = TOOL_ROUTES[toolName];
  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: toolName,
          arguments: args || {},
        },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const rawBody = await response.text();
    if (!response.ok) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Upstream MCP HTTP ${response.status}: ${sanitizeErrorMessage(rawBody.slice(0, 500), cleanToken)}`,
          },
        ],
      };
    }

    const sseLine = rawBody
      .split("\n")
      .filter((line) => line.startsWith("data: "))
      .map((line) => line.slice(6).trim())
      .pop();

    const parsed = JSON.parse(sseLine || rawBody);
    if (parsed.error) {
      return {
        isError: true,
        content: [{ type: "text", text: `Upstream MCP error: ${sanitizeErrorMessage(parsed.error.message || JSON.stringify(parsed.error), cleanToken)}` }],
      };
    }
    if (parsed.result && Array.isArray(parsed.result.content)) {
      return parsed.result;
    }
    return {
      content: [{ type: "text", text: JSON.stringify(parsed.result ?? parsed, null, 2) }],
    };
  } catch (err) {
    return {
      isError: true,
      content: [{ type: "text", text: `Remote MCP request failed: ${sanitizeErrorMessage(err?.message || err, cleanToken)}` }],
    };
  }
}

export async function handleJsonRpcMessage(msg, options = {}) {
  if (!msg || typeof msg !== "object" || msg.jsonrpc !== "2.0") {
    return {
      jsonrpc: "2.0",
      id: msg?.id ?? null,
      error: { code: -32600, message: "Invalid JSON-RPC 2.0 request." },
    };
  }

  const { id, method, params } = msg;
  if (id === undefined || (typeof method === "string" && method.startsWith("notifications/"))) {
    return null;
  }

  if (method === "initialize") {
    const requestedVersion = typeof params?.protocolVersion === "string" ? params.protocolVersion : SUPPORTED_PROTOCOL_VERSION;
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: requestedVersion,
        capabilities: {
          tools: { listChanged: false },
        },
        serverInfo: SERVER_INFO,
      },
    };
  }

  if (method === "ping") {
    return { jsonrpc: "2.0", id, result: {} };
  }

  if (method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        tools: MCP_TOOLS,
      },
    };
  }

  if (method === "resources/list") {
    return { jsonrpc: "2.0", id, result: { resources: [] } };
  }

  if (method === "prompts/list") {
    return { jsonrpc: "2.0", id, result: { prompts: [] } };
  }

  if (method === "tools/call") {
    const toolName = params?.name;
    if (!toolName || typeof toolName !== "string") {
      return {
        jsonrpc: "2.0",
        id,
        error: { code: -32602, message: "Missing required string parameter: params.name" },
      };
    }
    const token = options.token ?? process.env.APIFY_TOKEN ?? "";
    const result = await forwardToolCall(toolName, params?.arguments ?? {}, token, options.fetchImpl);
    return { jsonrpc: "2.0", id, result };
  }

  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${String(method)}` },
  };
}

export function startStdioServer() {
  let buffer = Buffer.alloc(0);

  const sendResponse = ( framing, payload ) => {
    if (!payload) return;
    const json = JSON.stringify(payload);
    if (framing === "lsp") {
      const byteLen = Buffer.byteLength(json, "utf8");
      process.stdout.write(`Content-Length: ${byteLen}\r\n\r\n${json}`);
    } else {
      process.stdout.write(`${json}\n`);
    }
  };

  const dispatchRaw = (rawText, framing) => {
    const trimmed = rawText.trim();
    if (!trimmed) return;
    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      sendResponse(framing, {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error" },
      });
      return;
    }

    if (Array.isArray(parsed)) {
      Promise.all(parsed.map((item) => handleJsonRpcMessage(item)))
        .then((results) => {
          const filtered = results.filter(Boolean);
          if (filtered.length > 0) sendResponse(framing, filtered);
        })
        .catch(() => {});
      return;
    }

    handleJsonRpcMessage(parsed)
      .then((res) => sendResponse(framing, res))
      .catch((err) => {
        sendResponse(framing, {
          jsonrpc: "2.0",
          id: parsed?.id ?? null,
          error: { code: -32603, message: sanitizeErrorMessage(err?.message, process.env.APIFY_TOKEN) },
        });
      });
  };

  process.stdin.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)]);

    while (buffer.length > 0) {
      const headerMatch = buffer.subarray(0, Math.min(buffer.length, 128)).toString("utf8").match(/^Content-Length:\s*(\d+)\r?\n\r?\n/i);
      if (headerMatch) {
        const headerBytes = Buffer.byteLength(headerMatch[0], "utf8");
        const bodyBytes = Number(headerMatch[1]);
        if (buffer.length < headerBytes + bodyBytes) break;
        const body = buffer.subarray(headerBytes, headerBytes + bodyBytes).toString("utf8");
        buffer = buffer.subarray(headerBytes + bodyBytes);
        dispatchRaw(body, "lsp");
        continue;
      }

      const nlIdx = buffer.indexOf(0x0a);
      if (nlIdx === -1) break;
      const line = buffer.subarray(0, nlIdx).toString("utf8");
      buffer = buffer.subarray(nlIdx + 1);
      dispatchRaw(line, "ndjson");
    }
  });
}

const isDirectRun =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  process.argv[1] &&
  (process.argv[1].endsWith("/src/index.mjs") ||
    process.argv[1].endsWith("\\src\\index.mjs") ||
    process.argv[1].endsWith("open-data-mcp-servers"));

if (isDirectRun) {
  startStdioServer();
}
