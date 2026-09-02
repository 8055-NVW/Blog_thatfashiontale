import type { HotspotItem, HotspotType } from "../types/HotspotType";

function normalizeString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeCoordinate(value: unknown) {
  const numericValue = typeof value === "number"
    ? value
    : typeof value === "string"
      ? Number(value)
      : Number.NaN;

  if (!Number.isFinite(numericValue)) {
    return undefined;
  }

  return Math.min(1, Math.max(0, numericValue));
}

function normalizeHotspotItem(value: unknown): HotspotItem | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const link = normalizeString(candidate.link);

  if (!link) {
    return null;
  }

  const item: HotspotItem = { link };
  const title = normalizeString(candidate.title);
  const image = normalizeString(candidate.image);
  const price = normalizeString(candidate.price);

  if (title) {
    item.title = title;
  }

  if (image) {
    item.image = image;
  }

  if (price) {
    item.price = price;
  }

  return item;
}

export function normalizeHotspots(value: unknown): HotspotType[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") {
      return [];
    }

    const candidate = entry as Record<string, unknown>;
    const x = normalizeCoordinate(candidate.x);
    const y = normalizeCoordinate(candidate.y);
    const primary = normalizeHotspotItem(candidate.primary);

    if (x === undefined || y === undefined || !primary) {
      return [];
    }

    const related = Array.isArray(candidate.related)
      ? candidate.related.flatMap((item) => normalizeHotspotItem(item) ?? [])
      : [];

    return [{ x, y, primary, related }];
  });
}
