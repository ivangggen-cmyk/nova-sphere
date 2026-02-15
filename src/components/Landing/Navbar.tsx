import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AtlanticLogo from "@/components/AtlanticLogo";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-2xl border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/">
          <AtlanticLogo size="sm" dark={!scrolled} />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "#how", label: "Как это работает" },
            { href: "#benefits", label: "Преимущества" },
            { href: "#faq", label: "FAQ" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-300 ${
                scrolled
                  ? "text-foreground/70 hover:text-foreground"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/auth">
            <Button
              variant="ghost"
              size="sm"
              className={scrolled ? "" : "text-white/80 hover:text-white hover:bg-white/10"}
            >
              Войти
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="gradient-accent text-accent-foreground border-0 shadow-glow">
              Начать <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? (
            <X className={`h-5 w-5 ${scrolled ? "text-foreground" : "text-white"}`} />
          ) : (
            <Menu className={`h-5 w-5 ${scrolled ? "text-foreground" : "text-white"}`} />
          )}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-2xl border-t border-border overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <a href="#how" className="block text-sm text-foreground/70 font-medium py-2" onClick={() => setOpen(false)}>Как это работает</a>
              <a href="#benefits" className="block text-sm text-foreground/70 font-medium py-2" onClick={() => setOpen(false)}>Преимущества</a>
              <a href="#faq" className="block text-sm text-foreground/70 font-medium py-2" onClick={() => setOpen(false)}>FAQ</a>
              <Link to="/auth" className="block pt-2" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full gradient-accent text-accent-foreground border-0">
                  Начать <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
