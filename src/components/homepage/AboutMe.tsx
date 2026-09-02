export default function AboutMe() {
  return (
    <section className="rounded-xl border border-border bg-surface px-6 py-8 shadow-[var(--shadow-soft)] md:px-8 md:py-10">
      <p className="text-[11px] uppercase tracking-[0.28em] text-fg-subtle">About</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-fg">A personal archive with an editorial pace</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-fg-muted md:text-base md:leading-8">
        This blog gathers notes on style, travel, and everyday inspiration in one calm reading space. It is designed to feel collected rather than crowded, with enough room for images, stories, and slower browsing.
      </p>
    </section>
  );
}
