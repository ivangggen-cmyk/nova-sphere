import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, ClipboardCheck, TrendingUp, Star, ArrowRight, Clock, Sparkles, Zap, Bell, ChevronRight, Newspaper } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/api";

const statusMap: Record<string, { label: string; cls: string }> = {
  assigned: { label: "Назначено", cls: "bg-primary/10 text-primary" },
  in_progress: { label: "В работе", cls: "bg-accent/10 text-accent" },
  submitted: { label: "На проверке", cls: "bg-amber-100 text-amber-700" },
  approved: { label: "Принято", cls: "bg-success/10 text-success" },
  rejected: { label: "Отклонено", cls: "bg-destructive/10 text-destructive" },
};

const notifIcons: Record<string, string> = {
  success: "✅", bonus: "💰", warning: "⚠️", info: "📋", system: "🔔",
};

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newsItems, setNewsItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [tasksRes, notifsRes, newsRes] = await Promise.all([
        db.getUserTasks(user.id),
        db.getNotifications(user.id),
        db.getPublishedNews(),
      ]);
      setRecentTasks((tasksRes.data as any[] || []).slice(0, 4));
      setNotifications((notifsRes.data as any[] || []).filter((n: any) => !n.is_read).slice(0, 5));
      setNewsItems((newsRes.data as any[] || []).slice(0, 5));
    };
    fetchData();
  }, [user]);

  const balance = profile?.balance || 0;
  const totalEarned = profile?.total_earned || 0;
  const tasksCompleted = profile?.tasks_completed || 0;
  const rating = profile?.rating || 0;
  const level = profile?.level || "Новичок";
  const progressPercent = Math.min(tasksCompleted * 10, 100);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-sm text-muted-foreground mb-1">Добро пожаловать 👋</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">{profile?.full_name?.split(" ")[0] || "пользователь"}</h1>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <StatCard icon={Wallet} label="Баланс" value={`${Number(balance).toLocaleString("ru-RU")} ₽`} positive />
        <StatCard icon={ClipboardCheck} label="Выполнено" value={String(tasksCompleted)} positive />
        <StatCard icon={TrendingUp} label="Доход" value={`${Number(totalEarned).toLocaleString("ru-RU")} ₽`} positive />
        <StatCard icon={Star} label="Рейтинг" value={String(rating)} positive />
      </div>

      {/* Level Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-2xl p-5 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-accent/3" />
        <div className="relative flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center"><Zap className="h-4 w-4 text-primary-foreground" /></div>
            <div><h3 className="font-display font-semibold text-sm">{level}</h3><p className="text-xs text-muted-foreground">Прогресс уровня</p></div>
          </div>
          <span className="text-sm font-mono font-semibold text-primary">{progressPercent}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full gradient-primary rounded-full" />
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Последние задания</h3>
            <Link to="/dashboard/tasks"><Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 h-8">Все <ArrowRight className="ml-1 h-3 w-3" /></Button></Link>
          </div>
          {recentTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-3"><ClipboardCheck className="h-6 w-6 text-muted-foreground/40" /></div>
              <p className="text-muted-foreground text-sm mb-3">У вас пока нет заданий</p>
              <Link to="/dashboard/tasks"><Button size="sm" variant="outline" className="rounded-xl text-xs h-8">Найти задания <ArrowRight className="ml-1 h-3 w-3" /></Button></Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recentTasks.map((ut, i) => (
                <motion.div key={ut.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <Link to={`/dashboard/tasks/${ut.task_id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate group-hover:text-primary transition-colors">{ut.tasks?.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{new Date(ut.assigned_at).toLocaleDateString("ru-RU")}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className={`text-[11px] px-2 py-0.5 rounded-lg font-medium ${statusMap[ut.status]?.cls || ""}`}>{statusMap[ut.status]?.label || ut.status}</span>
                      <span className="text-sm font-mono font-semibold">{ut.tasks?.reward ? `${Number(ut.tasks.reward).toLocaleString("ru-RU")} ₽` : ""}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm">Уведомления</h3>
            {notifications.length > 0 && (<span className="text-[11px] px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-medium">{notifications.length}</span>)}
          </div>
          {notifications.length === 0 ? (
            <div className="text-center py-10"><div className="w-12 h-12 mx-auto rounded-xl bg-muted flex items-center justify-center mb-3"><Bell className="h-5 w-5 text-muted-foreground/40" /></div><p className="text-muted-foreground text-sm">Нет новых</p></div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n, i) => (
                <motion.div key={n.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors">
                  <span className="text-base mt-0.5">{notifIcons[n.type] || "📋"}</span>
                  <div className="min-w-0"><div className="text-sm font-medium truncate">{n.title}</div><div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3" />{new Date(n.created_at).toLocaleDateString("ru-RU")}</div></div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* News Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4"><Newspaper className="h-4 w-4 text-primary" /><h3 className="font-display font-semibold text-sm">Новости</h3></div>
        {newsItems.length === 0 ? (
          <div className="text-center py-10"><div className="w-12 h-12 mx-auto rounded-xl bg-muted flex items-center justify-center mb-3"><Newspaper className="h-5 w-5 text-muted-foreground/40" /></div><p className="text-muted-foreground text-sm">Нет новостей</p></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsItems.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                {item.image_url && (<img src={item.image_url} alt={item.title} className="w-full h-36 object-cover" />)}
                <div className="p-4">
                  <h4 className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-2">{item.content}</p>
                  <div className="text-[11px] text-muted-foreground/60 flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(item.created_at).toLocaleDateString("ru-RU")}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
