import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, ClipboardCheck, Wallet, Target, Award } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/api";

interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  check: (data: AchievementData) => boolean;
  progress?: (data: AchievementData) => string;
}

interface AchievementData {
  tasksCompleted: number;
  totalEarned: number;
  referralsCount: number;
  rating: number;
  balance: number;
  totalWithdrawn: number;
  level: string;
  isVerified: boolean;
  daysSinceRegistration: number;
  categoriesCompleted: number;
}

const achievements: Achievement[] = [
  { id: "first_task", emoji: "🏆", title: "Первое задание", description: "Выполните первое задание", check: d => d.tasksCompleted >= 1 },
  { id: "5_tasks", emoji: "⭐", title: "Пять звёзд", description: "Выполните 5 заданий", check: d => d.tasksCompleted >= 5, progress: d => `${Math.min(d.tasksCompleted, 5)}/5` },
  { id: "10_tasks", emoji: "🔥", title: "Десятка", description: "Выполните 10 заданий", check: d => d.tasksCompleted >= 10, progress: d => `${Math.min(d.tasksCompleted, 10)}/10` },
  { id: "25_tasks", emoji: "💪", title: "Профессионал", description: "Выполните 25 заданий", check: d => d.tasksCompleted >= 25, progress: d => `${Math.min(d.tasksCompleted, 25)}/25` },
  { id: "50_tasks", emoji: "🚀", title: "Ракета", description: "Выполните 50 заданий", check: d => d.tasksCompleted >= 50, progress: d => `${Math.min(d.tasksCompleted, 50)}/50` },
  { id: "100_tasks", emoji: "💯", title: "Сотня", description: "Выполните 100 заданий", check: d => d.tasksCompleted >= 100, progress: d => `${Math.min(d.tasksCompleted, 100)}/100` },
  { id: "earn_1k", emoji: "💵", title: "Первая тысяча", description: "Заработайте 1 000 ₽", check: d => d.totalEarned >= 1000, progress: d => `${Math.min(d.totalEarned, 1000).toLocaleString("ru-RU")}/1 000` },
  { id: "earn_10k", emoji: "💰", title: "Десять тысяч", description: "Заработайте 10 000 ₽", check: d => d.totalEarned >= 10000, progress: d => `${Math.min(d.totalEarned, 10000).toLocaleString("ru-RU")}/10 000` },
  { id: "earn_50k", emoji: "🤑", title: "Полтинник", description: "Заработайте 50 000 ₽", check: d => d.totalEarned >= 50000, progress: d => `${Math.min(d.totalEarned, 50000).toLocaleString("ru-RU")}/50 000` },
  { id: "earn_100k", emoji: "💎", title: "Бриллиант", description: "Заработайте 100 000 ₽", check: d => d.totalEarned >= 100000, progress: d => `${Math.min(d.totalEarned, 100000).toLocaleString("ru-RU")}/100 000` },
  { id: "earn_500k", emoji: "👑", title: "Корона", description: "Заработайте 500 000 ₽", check: d => d.totalEarned >= 500000, progress: d => `${Math.min(d.totalEarned, 500000).toLocaleString("ru-RU")}/500 000` },
  { id: "ref_1", emoji: "👥", title: "Первый реферал", description: "Пригласите 1 друга", check: d => d.referralsCount >= 1 },
  { id: "ref_5", emoji: "🤝", title: "Дружная команда", description: "Пригласите 5 друзей", check: d => d.referralsCount >= 5, progress: d => `${Math.min(d.referralsCount, 5)}/5` },
  { id: "ref_10", emoji: "🌐", title: "Сетевик", description: "Пригласите 10 друзей", check: d => d.referralsCount >= 10, progress: d => `${Math.min(d.referralsCount, 10)}/10` },
  { id: "ref_25", emoji: "🏅", title: "Лидер сети", description: "Пригласите 25 друзей", check: d => d.referralsCount >= 25, progress: d => `${Math.min(d.referralsCount, 25)}/25` },
  { id: "rating_4", emoji: "⭐", title: "Хороший рейтинг", description: "Достигните рейтинга 4.0", check: d => d.rating >= 4.0 },
  { id: "rating_45", emoji: "🌟", title: "Топ исполнитель", description: "Достигните рейтинга 4.5", check: d => d.rating >= 4.5 },
  { id: "rating_5", emoji: "✨", title: "Безупречный", description: "Достигните рейтинга 5.0", check: d => d.rating >= 5.0 },
  { id: "verified", emoji: "✅", title: "Верифицирован", description: "Пройдите верификацию", check: d => d.isVerified },
  { id: "first_withdraw", emoji: "🏧", title: "Первый вывод", description: "Выведите средства", check: d => d.totalWithdrawn > 0 },
  { id: "level_advanced", emoji: "📈", title: "Продвинутый", description: "Достигните уровня Продвинутый", check: d => d.level === "Продвинутый" || d.level === "Эксперт" },
  { id: "level_expert", emoji: "🎓", title: "Эксперт", description: "Достигните уровня Эксперт", check: d => d.level === "Эксперт" },
  { id: "week_old", emoji: "📅", title: "Неделя на платформе", description: "Зарегистрированы 7+ дней", check: d => d.daysSinceRegistration >= 7 },
  { id: "month_old", emoji: "🗓️", title: "Месяц на платформе", description: "Зарегистрированы 30+ дней", check: d => d.daysSinceRegistration >= 30 },
];

const Statistics = () => {
  const { user, profile } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [userTasks, setUserTasks] = useState<any[]>([]);
  const [referralsCount, setReferralsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const [paymentsRes, userTasksRes, refsRes] = await Promise.all([
        db.getPayments(user.id),
        db.getUserTasks(user.id),
        db.getReferrals(user.id),
      ]);
      setPayments(paymentsRes.data as any[] || []);
      setUserTasks(userTasksRes.data as any[] || []);
      setReferralsCount((refsRes.data as any[] || []).length);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const tasksCompleted = profile?.tasks_completed || 0;
  const totalEarned = Number(profile?.total_earned || 0);
  const totalWithdrawn = Number(profile?.total_withdrawn || 0);
  const balance = Number(profile?.balance || 0);
  const rating = Number(profile?.rating || 0);
  const avgCheck = tasksCompleted > 0 ? Math.round(totalEarned / tasksCompleted) : 0;
  const daysSinceRegistration = profile?.created_at ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const completedTasks = userTasks.filter(ut => ut.status === "approved");
  const uniqueCategories = new Set(completedTasks.map(ut => ut.tasks?.category_id).filter(Boolean));
  const categoryMap = new Map<string, { tasks: number; earned: number }>();
  completedTasks.forEach(ut => { const catName = ut.tasks?.task_categories?.name || "Другое"; const reward = Number(ut.tasks?.reward || 0); const existing = categoryMap.get(catName) || { tasks: 0, earned: 0 }; categoryMap.set(catName, { tasks: existing.tasks + 1, earned: existing.earned + reward }); });
  const categoryStats = Array.from(categoryMap.entries()).map(([name, data]) => ({ name, tasks: data.tasks, earned: data.earned, pct: tasksCompleted > 0 ? Math.round((data.tasks / tasksCompleted) * 100) : 0 })).sort((a, b) => b.tasks - a.tasks);
  const achievementData: AchievementData = { tasksCompleted, totalEarned, referralsCount, rating, balance, totalWithdrawn, level: profile?.level || "Новичок", isVerified: profile?.is_verified || false, daysSinceRegistration, categoriesCompleted: uniqueCategories.size };
  const completedAchievements = achievements.filter(a => a.check(achievementData)).length;
  const monthlyMap = new Map<string, number>();
  (payments || []).filter(p => p.type !== "withdrawal" && (p.status === "completed" || p.status === "approved")).forEach(p => { const d = new Date(p.created_at); const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; monthlyMap.set(key, (monthlyMap.get(key) || 0) + Number(p.amount)); });
  const monthlyData = Array.from(monthlyMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).slice(-6).map(([key, earned]) => ({ month: new Date(key + "-01").toLocaleDateString("ru-RU", { month: "short" }), earned }));
  const maxEarned = Math.max(...monthlyData.map(d => d.earned), 1);

  if (loading) return <DashboardLayout><div className="text-center py-12 text-muted-foreground">Загрузка...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Статистика</h1>
        <p className="text-sm text-muted-foreground">Аналитика вашей эффективности</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Wallet} label="Всего заработано" value={`${totalEarned.toLocaleString("ru-RU")} ₽`} positive />
        <StatCard icon={ClipboardCheck} label="Заданий выполнено" value={String(tasksCompleted)} positive />
        <StatCard icon={Target} label="Средний чек" value={`${avgCheck.toLocaleString("ru-RU")} ₽`} positive />
        <StatCard icon={Award} label="Рейтинг" value={rating > 0 ? `${rating.toFixed(1)} / 5` : "—"} positive />
      </div>
      {monthlyData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 mb-8">
          <h3 className="font-semibold mb-6">Доход по месяцам</h3>
          <div className="flex items-end gap-3 h-48">
            {monthlyData.map((d, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(d.earned / maxEarned) * 100}%` }} transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }} className="flex-1 flex flex-col items-center justify-end">
                <div className="text-xs font-medium mb-1">{(d.earned / 1000).toFixed(0)}K</div>
                <div className="w-full rounded-t-lg gradient-accent min-h-[4px]" style={{ height: "100%" }} />
                <div className="text-xs text-muted-foreground mt-2">{d.month}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-5">По категориям</h3>
          {categoryStats.length === 0 ? (<p className="text-sm text-muted-foreground">Нет данных — выполните задания</p>) : (
            <div className="space-y-4">{categoryStats.map(c => (<div key={c.name}><div className="flex items-center justify-between text-sm mb-1.5"><span className="font-medium">{c.name}</span><span className="text-muted-foreground">{c.tasks} заданий · {c.earned.toLocaleString("ru-RU")} ₽</span></div><Progress value={c.pct} className="h-2" /></div>))}</div>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-2">Достижения</h3>
          <p className="text-xs text-muted-foreground mb-5">{completedAchievements} из {achievements.length} получено</p>
          <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {achievements.map(a => { const done = a.check(achievementData); return (
              <div key={a.id} className={`p-3 rounded-xl border transition-all ${done ? "border-accent/30 bg-accent/5" : "border-border opacity-60"}`}>
                <div className="text-2xl mb-1">{a.emoji}</div>
                <div className="text-sm font-medium">{a.title}</div>
                <div className="text-xs text-muted-foreground">{done ? "Получено ✓" : (a.progress ? a.progress(achievementData) : a.description)}</div>
              </div>
            ); })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Statistics;
