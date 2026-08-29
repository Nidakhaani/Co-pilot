export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
    >
      <rect width="32" height="32" rx="9" fill="#0F6E5B" />
      <path
        d="M9 15.5 13.2 19.5 23 11.5"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandHeader({
  subtitle = true,
}: {
  subtitle?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark />
      <div className="leading-tight">
        <div className="text-[15px] font-semibold text-ink">Copilot</div>
        {subtitle && (
          <div className="text-xs text-muted">Ambient knowledge companion</div>
        )}
      </div>
    </div>
  );
}
