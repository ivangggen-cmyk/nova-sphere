import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, ClipboardCheck, TrendingUp, Star, ArrowRight, Clock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const statusMap: Record<string, { label: string; cls: string }> = {
  assigned: { label: "В работе", cls: "bg-blue-100 text-blue-700" },
  in_progress: { label: "В работе", cls: "bg-blue-100 text-blue-700" },
  submitted: { label: "На проверке", cls: "bg-amber-100 text-amber-700" },
  approved: { label: "Принято", cls: "bg-accent/10 text-accent" },
  rejected: { label: "Отклонено", cls: "bg-red-100 text-red-700" },
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
        supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(4),
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

  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl md:text-3xl font-bold mb-1">
          Добро пожаловать, {profile?.full_name || "пользователь"} 👋
        </motion.h1>
        <p className="text-muted-foreground text-sm">Вот ваша сводка за сегодня</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Wallet} label="Баланс" value={`${Number(balance).toLocaleString("ru-RU")} ₽`} positive />
        <StatCard icon={ClipboardCheck} label="Выполнено заданий" value={String(tasksCompleted)} positive />
        <StatCard icon={TrendingUp} label="Доход" value={`${Number(totalEarned).toLocaleString("ru-RU")} ₽`} positive />
        <StatCard icon={Star} label="Рейтинг" value={String(rating)} positive />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Уровень: {level}</h3>
            <p className="text-xs text-muted-foreground">Выполняйте задания для повышения уровня</p>
          </div>
        </div>
        <Progress value={Math.min(tasksCompleted * 10, 100)} className="h-2" />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">Последние задания</h3>
            <Link to="/dashboard/tasks"><Button variant="ghost" size="sm" className="text-accent">Все задания <ArrowRight className="ml-1 h-3 w-3" /></Button></Link>
          </div>
          {recentTasks.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">У вас пока нет заданий. <Link to="/dashboard/tasks" className="text-accent hover:underline">Найти задания</Link></p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((ut) => (
                <Link key={ut.id} to={`/dashboard/tasks/${ut.task_id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate group-hover:text-accent transition-colors">{ut.tasks?.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{new Date(ut.assigned_at).toLocaleDateString("ru-RU")}</div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusMap[ut.status]?.cls || ""}`}>{statusMap[ut.status]?.label || ut.status}</span>
                    <span className="text-sm font-semibold whitespace-nowrap">{ut.tasks?.reward ? `${Number(ut.tasks.reward).toLocaleString("ru-RU")} ₽` : ""}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-5">Уведомления</h3>
          {notifications.length === 0 ? (
            <p className="text-muted-foreground text-sm">Нет новых уведомлений</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3">
                  <span className="text-lg">{n.type === "success" ? "✅" : n.type === "bonus" ? "💰" : n.type === "warning" ? "⚠️" : "📋"}</span>
                  <div>
                    <div className="text-sm">{n.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3" /> {new Date(n.created_at).toLocaleDateString("ru-RU")}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
