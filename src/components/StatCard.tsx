import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

const StatCard = ({ icon: Icon, label, value, change, positive }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
    className="bg-card rounded-2xl p-5 border border-border hover:border-primary/20 hover:shadow-elevated transition-all duration-300 relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors duration-300">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg font-mono ${
            positive 
              ? "text-success bg-success/10" 
              : "text-destructive bg-destructive/10"
          }`}>
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-display font-bold mb-0.5 tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  </motion.div>
);

export default StatCard;
