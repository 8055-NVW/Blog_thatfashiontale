import assert from "node:assert/strict";
import test from "node:test";

const { normalizeHotspots } = await import(new URL("./hotspotNormalization.ts", import.meta.url).href);

test("normalizeHotspots drops malformed hotspots and keeps normalized valid entries", () => {
  const result = normalizeHotspots([
    null,
    {},
    { x: 0.25, y: 0.5, primary: null, related: [] },
    { x: "0.2", y: 0.4, primary: { link: "   ", title: "No link" }, related: [] },
    {
      x: "1.4",
      y: -0.2,
      primary: {
        link: " https://example.com/item ",
        title: "  Linen Shirt  ",
        image: " https://cdn.example.com/item.jpg ",
        price: " USD 120 ",
      },
      related: [
        { link: "https://example.com/related-1", title: " Related 1 " },
        { link: "   " },
        null,
      ],
    },
  ]);

  assert.deepEqual(result, [
    {
      x: 1,
      y: 0,
      primary: {
        link: "https://example.com/item",
        title: "Linen Shirt",
        image: "https://cdn.example.com/item.jpg",
        price: "USD 120",
      },
      related: [
        {
          link: "https://example.com/related-1",
          title: "Related 1",
        },
      ],
    },
  ]);
});

test("normalizeHotspots returns an empty array for non-array values", () => {
  assert.deepEqual(normalizeHotspots(undefined), []);
  assert.deepEqual(normalizeHotspots(null), []);
  assert.deepEqual(normalizeHotspots({ primary: { link: "https://example.com" } }), []);
});
