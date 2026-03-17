type DiscussionHeaderProps = {
  count: number;
};

export default function DiscussionHeader({ count }: DiscussionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Comments</p>
        <h2 className="mt-1 text-2xl font-semibold text-gray-900">Reader conversation</h2>
      </div>
      <p className="text-sm text-gray-500">{count} total</p>
    </div>
  );
}
