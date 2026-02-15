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
      <motion.div
        className="relative"
        style={{ width: s.icon, height: s.icon }}
      >
        {/* Outer ring with gradient */}
        <motion.svg
          viewBox="0 0 48 48"
          fill="none"
          className="w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(168 60% 40%)" />
              <stop offset="100%" stopColor="hsl(195 80% 46%)" />
            </linearGradient>
          </defs>
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke="url(#logoGrad)"
            strokeWidth="2"
            strokeDasharray="6 4"
            fill="none"
          />
        </motion.svg>

        {/* Inner wave icon */}
        <motion.svg
          viewBox="0 0 48 48"
          fill="none"
          className="absolute inset-0 w-full h-full"
          animate={{ y: [0, -1.5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(168 60% 40%)" />
              <stop offset="50%" stopColor="hsl(180 65% 44%)" />
              <stop offset="100%" stopColor="hsl(195 80% 46%)" />
            </linearGradient>
          </defs>
          {/* Letter A stylized as waves */}
          <path
            d="M14 32L20.5 14C21 12.5 22 12 24 12C26 12 27 12.5 27.5 14L34 32"
            stroke="url(#waveGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M17 26C19 24 21 25 24 24C27 23 29 24 31 26"
            stroke="url(#waveGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </motion.svg>

        {/* Subtle glow */}
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-lg -z-10" />
      </motion.div>

      {showText && (
        <motion.span
          className={cn(
            "font-display font-bold tracking-tight",
            s.text,
            dark ? "text-white" : "gradient-text"
          )}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Atlantic
        </motion.span>
      )}
    </div>
  );
};

export default AtlanticLogo;
