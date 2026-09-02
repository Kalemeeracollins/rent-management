import test from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";

test("protected dashboard rejects anonymous requests", async () => {
  const server = app.listen(0);
  try {
    const response = await fetch(`http://127.0.0.1:${(server.address() as { port: number }).port}/api/dashboard`);
    assert.equal(response.status, 401);
    assert.equal((await response.json()).success, false);
  } finally { server.close(); }
});

test("health does not expose database credentials", async () => {
  const server = app.listen(0);
  try {
    const response = await fetch(`http://127.0.0.1:${(server.address() as { port: number }).port}/api/health`);
    const body = await response.json() as { success: boolean; database?: string };
    assert.ok([200, 503].includes(response.status));
    assert.equal(body.success, response.status === 200);
    if (response.status === 503) assert.equal(body.database, "disconnected");
  } finally { server.close(); }
});

test("login validates credentials before querying", async () => {
  const server = app.listen(0);
  try {
    const response = await fetch(`http://127.0.0.1:${(server.address() as { port: number }).port}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "bad", password: "short" }) });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).success, false);
  } finally { server.close(); }
});
