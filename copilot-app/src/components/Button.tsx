import type {
  ButtonHTMLAttributes,
  PropsWithChildren,
} from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg" | "sm";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-strong shadow-sm focus-visible:ring-accent/40",
  secondary:
    "bg-white text-ink border border-border hover:bg-canvas focus-visible:ring-accent/30",
  ghost: "bg-transparent text-muted hover:text-ink hover:bg-canvas",
  danger:
    "bg-flagged text-white hover:bg-flagged/90 focus-visible:ring-flagged/40",
};

const sizes: Record<Size, string> = {
  lg: "h-12 px-6 text-[15px] rounded-[10px]",
  md: "h-10 px-5 text-sm rounded-[10px]",
  sm: "h-8 px-3 text-xs rounded-[8px]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
