import assert from "node:assert/strict";
import test from "node:test";

const { createRunOnce } = await import(new URL("./runOnce.ts", import.meta.url).href);

test("createRunOnce only runs the sync work a single time", async () => {
  let calls = 0;
  const runOnce = createRunOnce(async () => {
    calls += 1;
  });

  await Promise.all([runOnce(), runOnce(), runOnce()]);
  await runOnce();

  assert.equal(calls, 1);
});
