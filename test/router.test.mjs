import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";
import { handleJsonRpcMessage } from "../src/index.mjs";
import { MCP_TOOLS, TOOL_ROUTES } from "../src/tools_catalog.mjs";

test("1. catalog exposes all 28 read-only tools with strict annotations and frozen routes", () => {
  assert.equal(MCP_TOOLS.length, 28);
  for (const tool of MCP_TOOLS) {
    assert.equal(tool.annotations.readOnlyHint, true);
    assert.equal(tool.annotations.destructiveHint, false);
    assert.equal(tool.annotations.idempotentHint, true);
    assert.equal(tool.inputSchema.additionalProperties, false);
    assert.ok(TOOL_ROUTES[tool.name]?.endpoint.startsWith("https://desastreger--"));
  }
});

test("2. STDIO process handles initialize, tools/list, and unauthenticated tools/call safely", async () => {
  const child = spawn(process.execPath, ["src/index.mjs"], {
    cwd: new URL("..", import.meta.url),
    env: { PATH: process.env.PATH },
    stdio: ["pipe", "pipe", "pipe"],
  });

  const lines = [];
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    for (const line of chunk.split("\n").filter(Boolean)) {
      lines.push(JSON.parse(line));
    }
  });

  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26" } }) + "\n");
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }) + "\n");
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "screen_company_kyb", arguments: { companyName: "Apple Inc" } } }) + "\n");
  child.stdin.end();

  await new Promise((resolve) => child.on("close", resolve));
  assert.equal(lines.length, 3);
  assert.equal(lines[0].result.serverInfo.name, "open-data-mcp-servers");
  assert.equal(lines[1].result.tools.length, 28);
  assert.equal(lines[2].result.isError, true);
  assert.match(lines[2].result.content[0].text, /Missing APIFY_TOKEN/);
});

test("3. handleJsonRpcMessage forwards SSE/JSON responses and redacts token on upstream error", async () => {
  const secret = "test_secret_token_value";
  const errRes = await handleJsonRpcMessage(
    {
      jsonrpc: "2.0",
      id: 9,
      method: "tools/call",
      params: { name: "audit_domain_posture", arguments: { domain: "example.com" } },
    },
    {
      token: secret,
      fetchImpl: async () => new Response(`Unauthorized ${secret}`, { status: 401 }),
    }
  );
  assert.equal(errRes.result.isError, true);
  assert.ok(!errRes.result.content[0].text.includes(secret));
  assert.match(errRes.result.content[0].text, /REDACTED_TOKEN/);
});
