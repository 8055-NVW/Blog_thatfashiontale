"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminShellHeaderProps = {
  userName?: string | null;
};

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/posts/create", label: "New Post" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShellHeader({ userName }: AdminShellHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="admin-card sticky top-3 z-10 mb-6 px-4 py-4 backdrop-blur md:px-5 md:py-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p className="meta-label">Content management</p>
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-fg md:text-[2rem]">Admin workspace</h1>
            <p className="text-sm leading-6 text-fg-muted">
              Manage posts, categories, and hotspot-rich editorial content from one utilitarian shell.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            {userName ? <span className="admin-subcard px-3 py-2 text-sm text-fg-muted">Signed in as {userName}</span> : null}
            <Link href="/" className="btn-secondary">
              View Site
            </Link>
          </div>
        </div>

        <nav aria-label="Admin navigation" className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={active ? "btn-primary" : "btn-secondary"}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
