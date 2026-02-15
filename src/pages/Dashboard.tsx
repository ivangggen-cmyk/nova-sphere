import { motion } from "framer-motion";
import { Wallet, ClipboardCheck, TrendingUp, Star, ArrowRight, Clock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const recentTasks = [
  { id: 1, title: "Регистрация в сервисе FinApp", reward: "850 ₽", status: "accepted", date: "14 фев" },
  { id: 2, title: "Обзор мобильного приложения", reward: "1 200 ₽", status: "review", date: "13 фев" },
  { id: 3, title: "Тестирование платёжной формы", reward: "2 000 ₽", status: "in_progress", date: "12 фев" },
  { id: 4, title: "Заполнение анкеты страхования", reward: "500 ₽", status: "available", date: "12 фев" },
];

const statusMap: Record<string, { label: string; cls: string }> = {
  accepted: { label: "Принято", cls: "bg-accent/10 text-accent" },
  review: { label: "На проверке", cls: "bg-amber-100 text-amber-700" },
  in_progress: { label: "В работе", cls: "bg-blue-100 text-blue-700" },
  available: { label: "Доступно", cls: "bg-muted text-muted-foreground" },
};

const Dashboard = () => (
  <DashboardLayout>
    <div className="mb-8">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl md:text-3xl font-bold mb-1"
      >
        Добро пожаловать, Алексей 👋
      </motion.h1>
      <p className="text-muted-foreground text-sm">Вот ваша сводка за сегодня</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard icon={Wallet} label="Баланс" value="24 580 ₽" change="+12%" positive />
      <StatCard icon={ClipboardCheck} label="Выполнено заданий" value="47" change="+3 за неделю" positive />
      <StatCard icon={TrendingUp} label="Доход за месяц" value="38 200 ₽" change="+8%" positive />
      <StatCard icon={Star} label="Рейтинг" value="4.8" change="Топ 5%" positive />
    </div>

    {/* Progress */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Уровень: Продвинутый</h3>
          <p className="text-xs text-muted-foreground">До следующего уровня — 3 задания</p>
        </div>
        <span className="text-sm font-medium text-accent">78%</span>
      </div>
      <Progress value={78} className="h-2" />
    </motion.div>

    <div className="grid lg:grid-cols-3 gap-6">
      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-2 glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold">Последние задания</h3>
          <Link to="/dashboard/tasks">
            <Button variant="ghost" size="sm" className="text-accent">
              Все задания <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {recentTasks.map((task) => (
            <Link key={task.id} to={`/dashboard/tasks/${task.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate group-hover:text-accent transition-colors">{task.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{task.date}</div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusMap[task.status].cls}`}>
                  {statusMap[task.status].label}
                </span>
                <span className="text-sm font-semibold whitespace-nowrap">{task.reward}</span>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="font-semibold mb-5">Активность</h3>
        <div className="space-y-4">
          {[
            { text: "Задание «Обзор FinApp» одобрено", time: "2 часа назад", icon: "✅" },
            { text: "Новое задание доступно", time: "5 часов назад", icon: "📋" },
            { text: "Выплата 5 000 ₽ обработана", time: "Вчера", icon: "💰" },
            { text: "Реферал зарегистрировался", time: "2 дня назад", icon: "👤" },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-lg">{a.icon}</span>
              <div>
                <div className="text-sm">{a.text}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" /> {a.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </DashboardLayout>
);

export default Dashboard;
