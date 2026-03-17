export function formatSaveCount(count: number) {
  return `${count} save${count === 1 ? "" : "s"}`;
}

export function getSaveLabel(hasLiked: boolean) {
  return hasLiked ? "Saved" : "Save";
}
