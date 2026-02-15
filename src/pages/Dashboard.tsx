import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, ClipboardCheck, TrendingUp, Star, ArrowRight, Clock, Sparkles, Zap, Bell } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const statusMap: Record<string, { label: string; cls: string }> = {
  assigned: { label: "Назначено", cls: "bg-accent/10 text-accent" },
  in_progress: { label: "В работе", cls: "bg-primary/10 text-primary" },
  submitted: { label: "На проверке", cls: "bg-amber-500/10 text-amber-600" },
  approved: { label: "Принято", cls: "bg-primary/10 text-primary" },
  rejected: { label: "Отклонено", cls: "bg-destructive/10 text-destructive" },
};

const notifIcons: Record<string, string> = {
  success: "✅",
  bonus: "💰",
  warning: "⚠️",
  info: "📋",
  system: "🔔",
};

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [tasksRes, notifsRes] = await Promise.all([
        supabase.from("user_tasks").select("*, tasks(title, reward)").eq("user_id", user.id).order("assigned_at", { ascending: false }).limit(4),
        supabase.from("notifications").select("*").eq("user_id", user.id).eq("is_read", false).order("created_at", { ascending: false }).limit(5),
      ]);
      setRecentTasks(tasksRes.data || []);
      setNotifications(notifsRes.data || []);
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
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-1"
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            Привет, {profile?.full_name?.split(" ")[0] || "пользователь"} 👋
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-sm"
        >
          Ваша сводка за сегодня
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Wallet} label="Баланс" value={`${Number(balance).toLocaleString("ru-RU")} ₽`} positive />
        <StatCard icon={ClipboardCheck} label="Выполнено" value={String(tasksCompleted)} positive />
        <StatCard icon={TrendingUp} label="Доход" value={`${Number(totalEarned).toLocaleString("ru-RU")} ₽`} positive />
        <StatCard icon={Star} label="Рейтинг" value={String(rating)} positive />
      </div>

      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 mb-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow">
                <Zap className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold">Уровень: {level}</h3>
                <p className="text-xs text-muted-foreground">Прогресс до следующего уровня</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-primary">{progressPercent}%</span>
          </div>
          <div className="relative">
            <Progress value={progressPercent} className="h-2.5 rounded-full" />
            <div className="absolute inset-0 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full gradient-accent rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-display font-semibold">Последние задания</h3>
            </div>
            <Link to="/dashboard/tasks">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                Все задания <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          {recentTasks.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
                <ClipboardCheck className="h-7 w-7 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm mb-3">У вас пока нет заданий</p>
              <Link to="/dashboard/tasks">
                <Button size="sm" variant="outline" className="rounded-xl">
                  Найти задания <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTasks.map((ut, i) => (
                <motion.div
                  key={ut.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    to={`/dashboard/tasks/${ut.task_id}`}
                    className="flex items-center justify-between p-3.5 rounded-xl hover:bg-muted/50 transition-all duration-300 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate group-hover:text-primary transition-colors duration-300">
                        {ut.tasks?.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {new Date(ut.assigned_at).toLocaleDateString("ru-RU")}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusMap[ut.status]?.cls || ""}`}>
                        {statusMap[ut.status]?.label || ut.status}
                      </span>
                      <span className="text-sm font-display font-semibold whitespace-nowrap">
                        {ut.tasks?.reward ? `${Number(ut.tasks.reward).toLocaleString("ru-RU")} ₽` : ""}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold">Уведомления</h3>
            {notifications.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {notifications.length}
              </span>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto rounded-xl bg-muted flex items-center justify-center mb-3">
                <Bell className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm">Нет новых уведомлений</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors duration-300"
                >
                  <span className="text-lg mt-0.5">{notifIcons[n.type] || "📋"}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{n.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {new Date(n.created_at).toLocaleDateString("ru-RU")}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
