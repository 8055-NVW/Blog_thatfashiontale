import assert from "node:assert/strict";
import test from "node:test";

const { extractApiMessage } = await import(new URL("./adminFeedback.ts", import.meta.url).href);

test("extractApiMessage returns message from object payloads", () => {
  assert.equal(extractApiMessage({ message: "Failed to save" }, "Fallback"), "Failed to save");
});

test("extractApiMessage strips error prefixes from string payloads", () => {
  assert.equal(extractApiMessage("Error: Failed to scrape", "Fallback"), "Failed to scrape");
});

test("extractApiMessage falls back when payload has no usable message", () => {
  assert.equal(extractApiMessage({ ok: true }, "Fallback"), "Fallback");
  assert.equal(extractApiMessage(null, "Fallback"), "Fallback");
});
