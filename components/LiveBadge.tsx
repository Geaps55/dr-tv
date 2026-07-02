type Props = {
  size?: "sm" | "md";
  label?: string;
};

export function LiveBadge({ size = "sm", label = "EN VIVO" }: Props) {
  const box = size === "sm"
    ? "text-[10px] px-2 py-0.5 gap-1.5"
    : "text-xs px-2.5 py-1 gap-2";
  const dot = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";
  return (
    <span
      className={`inline-flex items-center rounded-full bg-live font-semibold uppercase tracking-wider text-white ${box}`}
    >
      <span className={`inline-block rounded-full bg-white ${dot} animate-livePulse`} aria-hidden />
      {label}
    </span>
  );
}
