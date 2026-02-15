import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Shield, Zap, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const [stats, setStats] = useState({ totalPaid: 0, usersCount: 0, tasksCount: 0, approvedRate: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [profilesR, tasksR, paymentsR, reportsR] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("tasks").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("amount").in("status", ["approved", "completed"]),
        supabase.from("reports").select("status"),
      ]);
      const totalPaid = (paymentsR.data || []).reduce((s, p) => s + Number(p.amount), 0);
      const allReports = reportsR.data || [];
      const approved = allReports.filter(r => r.status === "approved").length;
      const rate = allReports.length > 0 ? Math.round((approved / allReports.length) * 100) : 0;
      setStats({
        totalPaid,
        usersCount: profilesR.count || 0,
        tasksCount: tasksR.count || 0,
        approvedRate: rate,
      });
    };
    fetchStats();
  }, []);

  const formatAmount = (n: number) => {
    if (n >= 1_000_000) return `₽${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `₽${(n / 1_000).toFixed(0)}K`;
    return `₽${n}`;
  };

  const formatCount = (n: number) => {
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K+`;
    return String(n);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute inset-0 gradient-mesh opacity-60" />
      <div className="absolute inset-0 noise" />

      <motion.div
        className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(252 85% 60% / 0.06), transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(38 95% 60% / 0.04), transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], x: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Rings */}
      {[500, 700, 900].map((size, i) => (
        <motion.div
          key={size}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/30"
          style={{ width: size, height: size }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 80 + i * 20, repeat: Infinity, ease: "linear" }}
        />
      ))}

      <div className="relative container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm mb-10"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">Платформа нового поколения</span>
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-8 text-balance leading-[0.95]"
          >
            <span className="gradient-text">Зарабатывай</span>
            <br />
            <span className="text-foreground/85">без границ</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Выполняй задания от ведущих компаний, получай мгновенные выплаты и развивай карьеру в цифровой экономике.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link to="/auth">
              <Button
                size="lg"
                className="gradient-primary text-primary-foreground border-0 text-base px-10 h-14 rounded-2xl shadow-glow animate-pulse-glow font-semibold"
              >
                Начать зарабатывать <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#how">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-14 rounded-2xl border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Узнать больше
              </Button>
            </a>
          </motion.div>

          {/* Stats - Real data */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto"
          >
            {[
              { icon: TrendingUp, label: "Выплачено", value: formatAmount(stats.totalPaid) },
              { icon: Users, label: "Исполнителей", value: formatCount(stats.usersCount) },
              { icon: Zap, label: "Заданий", value: formatCount(stats.tasksCount) },
              { icon: CheckCircle, label: "Одобрено", value: `${stats.approvedRate}%` },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="bg-card border border-border rounded-2xl p-4 text-center hover:shadow-elevated transition-all duration-500"
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <stat.icon className="h-4 w-4 text-primary mx-auto mb-2" />
                <div className="text-xl md:text-2xl font-display font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
