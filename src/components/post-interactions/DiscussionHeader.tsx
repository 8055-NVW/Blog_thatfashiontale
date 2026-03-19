type DiscussionHeaderProps = {
  count: number;
};

export default function DiscussionHeader({ count }: DiscussionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-fg-subtle">Postscript</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-fg">Reader conversation</h2>
      </div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-fg-subtle">{count} total</p>
    </div>
  );
}
