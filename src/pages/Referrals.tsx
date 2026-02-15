import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Users, TrendingUp, Gift, Share2, Hash } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Referrals = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    if (!user) return;
    const f = async () => {
      const { data: r } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });
      const refs = r || [];
      setReferrals(refs);
      const ids = refs.map((r) => r.referred_id);
      if (ids.length) {
        const { data: p } = await supabase
          .from("profiles")
          .select("user_id, full_name, created_at")
          .in("user_id", ids);
        setProfiles(new Map((p || []).map((p) => [p.user_id, p])));
      }
    };
    f();
  }, [user]);

  const referralCode = profile?.referral_code || "";
  const link = `${window.location.origin}/auth?ref=${referralCode}`;
  const totalEarned = referrals.reduce((s, r) => s + Number(r.bonus_amount), 0);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold mb-1">Рефералы</h1>
        <p className="text-sm text-muted-foreground">Приглашайте друзей и зарабатывайте</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard icon={Users} label="Приглашено" value={String(referrals.length)} positive />
        <StatCard icon={TrendingUp} label="Заработок" value={`${totalEarned.toLocaleString("ru-RU")} ₽`} positive />
        <StatCard icon={Gift} label="Бонусы" value={`${totalEarned.toLocaleString("ru-RU")} ₽`} />
        <StatCard icon={Share2} label="Уровней" value="3" />
      </div>

      {/* Referral Code */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6 mb-6"
      >
        <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2">
          <Hash className="h-4 w-4 text-primary" /> Ваш реферальный код
        </h3>
        <div className="flex gap-2 items-center">
          <div className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-border font-mono text-lg font-bold tracking-wider text-primary">
            {referralCode || "—"}
          </div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(referralCode);
              toast({ title: "Код скопирован!" });
            }}
            variant="outline"
            className="rounded-xl h-12 px-4"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Поделитесь этим кодом — друг введёт его при регистрации
        </p>
      </motion.div>

      {/* Referral Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-2xl p-6 mb-6"
      >
        <h3 className="font-display font-semibold text-sm mb-3">Реферальная ссылка</h3>
        <div className="flex gap-2">
          <Input value={link} readOnly className="flex-1 rounded-xl font-mono text-xs" />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(link);
              toast({ title: "Ссылка скопирована!" });
            }}
            className="gradient-primary text-primary-foreground border-0 rounded-xl"
          >
            <Copy className="h-4 w-4 mr-2" /> Копировать
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          10% от дохода 1-го уровня, 5% — 2-го, 2% — 3-го.
        </p>
      </motion.div>

      {/* Referrals List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="font-display font-semibold text-sm mb-4">Ваши рефералы</h3>
        {referrals.length === 0 ? (
          <p className="text-muted-foreground text-sm">Пока нет приглашённых пользователей</p>
        ) : (
          <div className="space-y-2">
            {referrals.map((r) => {
              const p = profiles.get(r.referred_id);
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {(p?.full_name || "?")[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{p?.full_name || "Пользователь"}</div>
                      <div className="text-xs text-muted-foreground">Уровень {r.level}</div>
                    </div>
                  </div>
                  <div className="text-sm font-mono font-semibold">
                    {Number(r.bonus_amount).toLocaleString("ru-RU")} ₽
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Referrals;