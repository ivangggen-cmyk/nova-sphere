import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AtlanticLogo from "@/components/AtlanticLogo";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Добро пожаловать!" });
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } },
        });
        if (error) throw error;
        toast({ title: "Регистрация успешна!", description: "Добро пожаловать в Atlantic!" });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(240_20%_6%)]" />
      <div className="absolute inset-0 gradient-mesh opacity-10" />

      <motion.div
        className="absolute top-[20%] left-[15%] w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(252 85% 60% / 0.1), transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(38 95% 60% / 0.06), transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-4 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <AtlanticLogo size="lg" dark />
          </div>
          <p className="text-white/60 text-sm">
            {isLogin ? "Войдите в свой аккаунт" : "Создайте аккаунт"}
          </p>
        </div>

        <div className="glass-dark rounded-3xl p-8 shadow-2xl border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <Label className="text-xs mb-2 block text-white/50">Полное имя</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Иван Петров"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-11 bg-white/5 border-white/8 text-white placeholder:text-white/20 rounded-xl h-12 focus:border-primary/50 focus:ring-primary/20"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <Label className="text-xs mb-2 block text-white/50">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 bg-white/5 border-white/8 text-white placeholder:text-white/20 rounded-xl h-12 focus:border-primary/50 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-xs mb-2 block text-white/50">Пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 bg-white/5 border-white/8 text-white placeholder:text-white/20 rounded-xl h-12 focus:border-primary/50 focus:ring-primary/20"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary text-primary-foreground border-0 h-12 rounded-xl font-semibold shadow-glow"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Загрузка...
                </div>
              ) : (
                <>
                  {isLogin ? "Войти" : "Зарегистрироваться"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-white/35 hover:text-primary transition-colors duration-300"
            >
              {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
