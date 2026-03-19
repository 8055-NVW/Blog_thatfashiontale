import assert from "node:assert/strict";
import test from "node:test";

const { getTrapWrapTarget } = await import(new URL("./hotspotDialogFocus.ts", import.meta.url).href);

test("getTrapWrapTarget wraps focus from last to first on forward tab", () => {
  const first = { id: "first" };
  const middle = { id: "middle" };
  const last = { id: "last" };

  assert.equal(getTrapWrapTarget([first, middle, last], last, false), first);
  assert.equal(getTrapWrapTarget([first, middle, last], middle, false), null);
});

test("getTrapWrapTarget wraps focus from first to last on shift tab", () => {
  const first = { id: "first" };
  const middle = { id: "middle" };
  const last = { id: "last" };

  assert.equal(getTrapWrapTarget([first, middle, last], first, true), last);
  assert.equal(getTrapWrapTarget([first, middle, last], middle, true), null);
});

test("getTrapWrapTarget returns null when there are no focusable elements", () => {
  assert.equal(getTrapWrapTarget([], null, false), null);
});
