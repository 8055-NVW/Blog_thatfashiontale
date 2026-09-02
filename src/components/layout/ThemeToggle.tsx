"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "theme-preference";

type ThemeMode = "light" | "dark";

function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const nextTheme = savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : getSystemTheme();

    applyTheme(nextTheme);
    setTheme(nextTheme);

    if (savedTheme === "light" || savedTheme === "dark") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      const systemTheme = event.matches ? "dark" : "light";
      applyTheme(systemTheme);
      setTheme(systemTheme);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  function handleToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  }

  const isDark = theme === "dark";
  const nextThemeLabel = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-sm font-medium text-fg-muted transition hover:border-border-strong hover:bg-accent-soft hover:text-fg"
      aria-label={`Switch to ${nextThemeLabel} mode`}
      aria-pressed={isDark}
      title={`Switch to ${nextThemeLabel} mode`}
    >
      <span aria-hidden="true" className="hidden sm:inline text-fg-subtle">Theme</span>
      <span aria-hidden="true" className="hidden md:inline text-fg">{nextThemeLabel}</span>
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 rounded-full ${isDark ? "bg-accent" : "bg-warning"}`}
      />
    </button>
  );
}
