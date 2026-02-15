import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AtlanticLogo from "@/components/AtlanticLogo";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      <div className="absolute inset-0 noise" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10"
      >
        <div className="flex justify-center mb-8">
          <AtlanticLogo size="md" />
        </div>
        <h1 className="mb-3 text-8xl font-display font-bold gradient-text">404</h1>
        <p className="mb-8 text-lg text-muted-foreground">Страница не найдена</p>
        <Link to="/">
          <Button variant="outline" className="rounded-xl h-11 px-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> На главную
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
