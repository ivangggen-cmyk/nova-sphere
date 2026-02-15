import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AtlanticLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  dark?: boolean;
}

const sizes = {
  sm: { icon: 28, text: "text-lg", gap: "gap-2" },
  md: { icon: 34, text: "text-xl", gap: "gap-2.5" },
  lg: { icon: 42, text: "text-2xl", gap: "gap-3" },
  xl: { icon: 56, text: "text-4xl", gap: "gap-4" },
};

const AtlanticLogo = ({ size = "md", showText = true, className, dark }: AtlanticLogoProps) => {
  const s = sizes[size];

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      <div className="relative" style={{ width: s.icon, height: s.icon }}>
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(252 85% 60%)" />
              <stop offset="100%" stopColor="hsl(195 90% 50%)" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="44" height="44" rx="14" stroke="url(#logoGrad)" strokeWidth="2.5" fill="none" />
          <path
            d="M14 32L20.5 14C21 12.5 22 12 24 12C26 12 27 12.5 27.5 14L34 32"
            stroke="url(#logoGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M17 26C19 24 21 25 24 24C27 23 29 24 31 26"
            stroke="url(#logoGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={cn(
            "font-display font-bold tracking-tight",
            s.text,
            dark ? "text-white" : "gradient-text"
          )}
        >
          Atlantic
        </span>
      )}
    </div>
  );
};

export default AtlanticLogo;
