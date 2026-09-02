import assert from "node:assert/strict";
import test from "node:test";

const { sanitizeCallbackUrl } = await import(new URL("./authRedirect.ts", import.meta.url).href);

test("sanitizeCallbackUrl allows safe internal paths", () => {
  assert.equal(sanitizeCallbackUrl("/posts/travels"), "/posts/travels");
  assert.equal(sanitizeCallbackUrl("/admin"), "/admin");
});

test("sanitizeCallbackUrl falls back for unsafe values", () => {
  assert.equal(sanitizeCallbackUrl(undefined), "/");
  assert.equal(sanitizeCallbackUrl(""), "/");
  assert.equal(sanitizeCallbackUrl("https://evil.com"), "/");
  assert.equal(sanitizeCallbackUrl("//evil.com"), "/");
  assert.equal(sanitizeCallbackUrl("posts/travels"), "/");
});
