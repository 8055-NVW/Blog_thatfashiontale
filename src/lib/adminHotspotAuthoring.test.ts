import assert from "node:assert/strict";
import test from "node:test";

const { getHotspotValidation, prepareHotspotsForSave } = await import(new URL("./adminHotspotAuthoring.ts", import.meta.url).href);

test("getHotspotValidation reports when a hotspot is missing a required primary link", () => {
  const result = getHotspotValidation({
    x: 0.4,
    y: 0.6,
    primary: { title: "Bag", link: "   " },
    related: [],
  });

  assert.equal(result.isSavable, false);
  assert.equal(result.hasPrimary, true);
  assert.equal(result.hasPrimaryLink, false);
});

test("prepareHotspotsForSave keeps valid hotspots and counts invalid hotspots and related items", () => {
  const result = prepareHotspotsForSave([
    {
      x: 0.2,
      y: 0.3,
      primary: { title: "Coat", link: " https://example.com/coat " },
      related: [
        { title: "Scarf", link: "https://example.com/scarf" },
        { title: "Bad item", link: "   " },
      ],
    },
    {
      x: 0.5,
      y: 0.5,
      primary: null,
      related: [],
    },
  ]);

  assert.equal(result.invalidHotspotCount, 1);
  assert.equal(result.invalidRelatedItemCount, 1);
  assert.deepEqual(result.hotspots, [
    {
      x: 0.2,
      y: 0.3,
      primary: { title: "Coat", link: "https://example.com/coat" },
      related: [{ title: "Scarf", link: "https://example.com/scarf" }],
    },
  ]);
});
