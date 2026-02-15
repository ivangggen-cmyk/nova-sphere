import Navbar from "@/components/Landing/Navbar";
import Hero from "@/components/Landing/Hero";
import HowItWorks from "@/components/Landing/HowItWorks";
import Benefits from "@/components/Landing/Benefits";
import Partners from "@/components/Landing/Partners";
import FAQ from "@/components/Landing/FAQ";
import Footer from "@/components/Landing/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTABanner = () => (
  <section className="py-28 bg-background relative overflow-hidden">
    <div className="absolute inset-0 gradient-mesh opacity-50" />
    <div className="container mx-auto px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-balance">
          Готовы начать{" "}
          <span className="gradient-text">зарабатывать?</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
          Присоединяйтесь к 12 000+ исполнителей и получите доступ к тысячам оплачиваемых заданий уже сегодня
        </p>
        <Link to="/auth">
          <Button size="lg" className="gradient-accent text-accent-foreground border-0 text-base px-10 h-14 rounded-2xl shadow-glow animate-pulse-glow font-semibold">
            Создать аккаунт бесплатно <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <Hero />
    <Partners />
    <HowItWorks />
    <Benefits />
    <CTABanner />
    <FAQ />
    <Footer />
  </div>
);

export default Index;
