export default function GetInTouch() {
  return (
    <section className="rounded-xl border border-border bg-subtle px-6 py-8 shadow-[var(--shadow-soft)] md:px-8 md:py-10">
      <p className="text-[11px] uppercase tracking-[0.28em] text-fg-subtle">Contact</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-fg">Get in touch</h2>
      <p className="mt-4 max-w-xl text-sm leading-7 text-fg-muted md:text-base md:leading-8">
        I&apos;d love to hear from you, whether it&apos;s feedback, a collaboration idea, or a simple hello.
      </p>
      <a
        href="mailto:?subject=That%20Fashion%20Tale"
        className="mt-6 inline-flex items-center rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-fg transition hover:border-border-strong hover:bg-accent-soft"
      >
        Start an email
      </a>
    </section>
  );
}
