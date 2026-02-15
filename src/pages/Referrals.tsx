import { motion } from "framer-motion";
import { Copy, Users, TrendingUp, Gift, Share2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const referrals = [
  { name: "Мария К.", joined: "10 фев", earned: "1 250 ₽", level: 1 },
  { name: "Дмитрий П.", joined: "5 фев", earned: "800 ₽", level: 1 },
  { name: "Олег С.", joined: "1 фев", earned: "2 100 ₽", level: 1 },
  { name: "Анна В.", joined: "28 янв", earned: "450 ₽", level: 2 },
];

const Referrals = () => {
  const { toast } = useToast();
  const link = "https://atlantic.ru/ref/alexey123";

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Реферальная программа</h1>
        <p className="text-sm text-muted-foreground">Приглашайте друзей и зарабатывайте вместе</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Приглашено" value="12" change="+2 за неделю" positive />
        <StatCard icon={TrendingUp} label="Заработок с рефералов" value="8 450 ₽" change="+15%" positive />
        <StatCard icon={Gift} label="Бонусы" value="2 000 ₽" />
        <StatCard icon={Share2} label="Уровней" value="3" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 mb-6"
      >
        <h3 className="font-semibold mb-3">Ваша реферальная ссылка</h3>
        <div className="flex gap-2">
          <Input value={link} readOnly className="flex-1" />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(link);
              toast({ title: "Ссылка скопирована!" });
            }}
            className="gradient-accent text-accent-foreground border-0"
          >
            <Copy className="h-4 w-4 mr-2" /> Копировать
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Вы получаете 10% от дохода рефералов 1-го уровня, 5% — 2-го, 2% — 3-го.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="font-semibold mb-4">Ваши рефералы</h3>
        <div className="space-y-3">
          {referrals.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {r.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">Присоединился {r.joined}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{r.earned}</div>
                <div className="text-xs text-muted-foreground">Уровень {r.level}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Referrals;
