import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border shadow-sm"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
          <span className="gradient-text">Atlantic</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how" className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium">Как это работает</a>
          <a href="#benefits" className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium">Преимущества</a>
          <a href="#faq" className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium">FAQ</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">Войти</Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm" className="gradient-accent text-accent-foreground border-0">
              Начать
            </Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card border-t border-border p-4 space-y-3"
        >
          <a href="#how" className="block text-sm text-foreground/70 font-medium" onClick={() => setOpen(false)}>Как это работает</a>
          <a href="#benefits" className="block text-sm text-foreground/70 font-medium" onClick={() => setOpen(false)}>Преимущества</a>
          <a href="#faq" className="block text-sm text-foreground/70 font-medium" onClick={() => setOpen(false)}>FAQ</a>
          <Link to="/dashboard" className="block">
            <Button size="sm" className="w-full gradient-accent text-accent-foreground border-0">Начать</Button>
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
