import assert from "node:assert/strict";
import test from "node:test";

const { formatSaveCount, getSaveLabel } = await import(
  new URL("./postSaveState.ts", import.meta.url).href
);

test("formatSaveCount returns quiet singular and plural labels", () => {
  assert.equal(formatSaveCount(0), "0 saves");
  assert.equal(formatSaveCount(1), "1 save");
  assert.equal(formatSaveCount(2), "2 saves");
});

test("getSaveLabel reflects whether the post is already saved", () => {
  assert.equal(getSaveLabel(false), "Save");
  assert.equal(getSaveLabel(true), "Saved");
});
