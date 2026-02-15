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
    className="glass rounded-2xl p-5 hover-lift"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      {change && (
        <span className={`text-xs font-medium ${positive ? "text-accent" : "text-destructive"}`}>
          {change}
        </span>
      )}
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </motion.div>
);

export default StatCard;
