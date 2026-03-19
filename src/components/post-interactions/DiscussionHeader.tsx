type DiscussionHeaderProps = {
  count: number;
};

export default function DiscussionHeader({ count }: DiscussionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="meta-label">Postscript</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-fg">Reader conversation</h2>
      </div>
      <p className="meta-count">{count} total</p>
    </div>
  );
}
