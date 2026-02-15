import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Shield, Zap, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AtlanticLogo from "@/components/AtlanticLogo";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero noise">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(168 60% 40% / 0.12), transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(195 80% 46% / 0.08), transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-[50%] left-[50%] w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(180 60% 45% / 0.06), transparent 70%)" }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(195 80% 46%) 1px, transparent 1px), linear-gradient(90deg, hsl(195 80% 46%) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Concentric rings */}
        {[600, 800, 1000].map((size, i) => (
          <motion.div
            key={size}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{
              width: size,
              height: size,
              borderColor: `hsl(168 60% 40% / ${0.06 - i * 0.015})`,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 60 + i * 20, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-dark text-sm mb-10"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-white/70">Платформа нового поколения для заработка</span>
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-white mb-8 text-balance leading-[0.95]"
          >
            <span className="gradient-text">Зарабатывай</span>
            <br />
            <span className="text-white/90">без границ</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Выполняй задания от ведущих компаний, получай мгновенные выплаты и развивай карьеру в цифровой экономике. Всё в одном месте.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/auth">
              <Button
                size="lg"
                className="gradient-accent text-accent-foreground border-0 text-base px-10 h-14 rounded-2xl shadow-glow animate-pulse-glow font-semibold"
              >
                Начать зарабатывать <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#how">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-14 rounded-2xl border-white/15 text-white/70 hover:bg-white/5 bg-transparent hover:text-white"
              >
                Узнать больше
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { icon: TrendingUp, label: "Выплачено", value: "₽48M+" },
              { icon: Users, label: "Исполнителей", value: "12K+" },
              { icon: Zap, label: "Заданий", value: "5K+" },
              { icon: CheckCircle, label: "Одобрено", value: "98%" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-dark rounded-2xl p-4 text-center"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <stat.icon className="h-4 w-4 text-primary mx-auto mb-2" />
                <div className="text-xl md:text-2xl font-display font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
