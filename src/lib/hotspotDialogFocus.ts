export const HOTSPOT_DIALOG_FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function getTrapWrapTarget<T>(focusableElements: T[], activeElement: T | null, isShiftKey: boolean) {
  if (focusableElements.length === 0) {
    return null;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (isShiftKey) {
    return activeElement === firstElement ? lastElement : null;
  }

  return activeElement === lastElement ? firstElement : null;
}
