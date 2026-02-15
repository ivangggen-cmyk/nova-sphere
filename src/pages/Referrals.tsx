import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Users, TrendingUp, Gift, Share2 } from "lucide-react";
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

  useEffect(() => {
    if (!user) return;
    supabase.from("referrals").select("*, profiles!referrals_referred_id_fkey(full_name, created_at)")
      .eq("referrer_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setReferrals(data || []));
  }, [user]);

  const link = `${window.location.origin}/auth?ref=${profile?.referral_code || ""}`;
  const totalEarned = referrals.reduce((s, r) => s + Number(r.bonus_amount), 0);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Реферальная программа</h1>
        <p className="text-sm text-muted-foreground">Приглашайте друзей и зарабатывайте вместе</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Приглашено" value={String(referrals.length)} positive />
        <StatCard icon={TrendingUp} label="Заработок с рефералов" value={`${totalEarned.toLocaleString("ru-RU")} ₽`} positive />
        <StatCard icon={Gift} label="Бонусы" value={`${totalEarned.toLocaleString("ru-RU")} ₽`} />
        <StatCard icon={Share2} label="Уровней" value="3" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-6">
        <h3 className="font-semibold mb-3">Ваша реферальная ссылка</h3>
        <div className="flex gap-2">
          <Input value={link} readOnly className="flex-1" />
          <Button onClick={() => { navigator.clipboard.writeText(link); toast({ title: "Ссылка скопирована!" }); }}
            className="gradient-accent text-accent-foreground border-0">
            <Copy className="h-4 w-4 mr-2" /> Копировать
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">Вы получаете 10% от дохода рефералов 1-го уровня, 5% — 2-го, 2% — 3-го.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Ваши рефералы</h3>
        {referrals.length === 0 ? (
          <p className="text-muted-foreground text-sm">Пока никого не пригласили</p>
        ) : (
          <div className="space-y-3">
            {referrals.map((r, i) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {(r.profiles?.full_name || "?")[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{r.profiles?.full_name || "Пользователь"}</div>
                    <div className="text-xs text-muted-foreground">Уровень {r.level}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{Number(r.bonus_amount).toLocaleString("ru-RU")} ₽</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Referrals;
