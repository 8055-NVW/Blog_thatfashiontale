type AdminNoticeProps = {
  tone?: "error" | "success" | "info";
  message: string;
};

const toneClasses: Record<NonNullable<AdminNoticeProps["tone"]>, string> = {
  error: "border-danger/35 bg-danger/8 text-danger",
  success: "border-success/35 bg-success/10 text-success",
  info: "border-border-strong bg-subtle text-fg-muted",
};

export default function AdminNotice({ tone = "info", message }: AdminNoticeProps) {
  return (
    <p className={`rounded-lg border px-3 py-2 text-sm leading-6 ${toneClasses[tone]}`}>
      {message}
    </p>
  );
}
