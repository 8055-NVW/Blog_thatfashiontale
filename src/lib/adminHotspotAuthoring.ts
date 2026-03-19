import type { HotspotItem, HotspotType } from "../types/HotspotType";

function hasValidLink(item: HotspotItem | null | undefined) {
  return Boolean(item?.link?.trim());
}

function normalizeString(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeItem(item: HotspotItem) {
  const link = normalizeString(item.link);

  if (!link) {
    return null;
  }

  return {
    link,
    ...(normalizeString(item.title) ? { title: normalizeString(item.title) } : {}),
    ...(normalizeString(item.image) ? { image: normalizeString(item.image) } : {}),
    ...(normalizeString(item.price) ? { price: normalizeString(item.price) } : {}),
  } satisfies HotspotItem;
}

export function getHotspotValidation(hotspot: HotspotType) {
  const hasPrimary = Boolean(hotspot.primary);
  const hasPrimaryLink = hasValidLink(hotspot.primary);
  const invalidRelatedItemCount = hotspot.related.filter((item) => !hasValidLink(item)).length;

  return {
    hasPrimary,
    hasPrimaryLink,
    invalidRelatedItemCount,
    isSavable: hasPrimaryLink,
  };
}

export function prepareHotspotsForSave(hotspots: HotspotType[]) {
  return {
    hotspots: hotspots.flatMap((hotspot) => {
      const primary = hotspot.primary ? normalizeItem(hotspot.primary) : null;

      if (!primary) {
        return [];
      }

      return [{
        x: hotspot.x,
        y: hotspot.y,
        primary,
        related: hotspot.related.flatMap((item) => {
          const normalizedItem = normalizeItem(item);
          return normalizedItem ? [normalizedItem] : [];
        }),
      } satisfies HotspotType];
    }),
    invalidHotspotCount: hotspots.filter((hotspot) => !getHotspotValidation(hotspot).isSavable).length,
    invalidRelatedItemCount: hotspots.reduce(
      (count, hotspot) => count + getHotspotValidation(hotspot).invalidRelatedItemCount,
      0
    ),
  };
}
