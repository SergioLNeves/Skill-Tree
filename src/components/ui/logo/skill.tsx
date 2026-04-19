import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

export const skillVariants = cva(
  "font-mono whitespace-pre leading-[1.1] tracking-tighter select-none",
  {
    variants: {
      size: {
        sm: "text-6",
        md: "text-9",
        lg: "text-12",
        xl: "text-16",
      },
      color: {
        default: "text-[var(--sea-ink)]",
        brand: "text-[var(--lagoon)]",
        muted: "text-[var(--sea-ink-soft)]",
      },
    },
    defaultVariants: {
      size: "lg",
      color: "default",
    },
  },
);

interface SkillWordmarkProps extends VariantProps<typeof skillVariants> {
  className?: string;
}

export function SkillWordmark({ size, color, className }: SkillWordmarkProps) {
  return (
    <div className={cn(skillVariants({ size, color }), className)}>
      {"███████╗██╗  ██╗██╗██╗      ██╗     "}
      <br />
      {"██╔════╝██║ ██╔╝██║██║      ██║     "}
      <br />
      {"███████╗█████╔╝ ██║██║      ██║     "}
      <br />
      {"╚════██║██╔═██╗ ██║██║      ██║     "}
      <br />
      {"███████║██║  ██╗██║███████╗███████╗"}
      <br />
      {"╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝"}
    </div>
  );
}
