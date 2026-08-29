export function Waveform({ bars = 5 }: { bars?: number }) {
  return (
    <span className="inline-flex items-end gap-[3px]" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="animate-pulse-dot w-[3px] rounded-full bg-accent"
          style={{
            height: `${[6, 12, 9, 14, 7][i % 5]}px`,
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </span>
  );
}

export function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5" aria-hidden>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
    </span>
  );
}
