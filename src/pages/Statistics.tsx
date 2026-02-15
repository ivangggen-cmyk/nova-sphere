import { motion } from "framer-motion";
import { BarChart3, TrendingUp, ClipboardCheck, Wallet, Target, Award } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Progress } from "@/components/ui/progress";

const monthlyData = [
  { month: "Сен", earned: 18500, tasks: 8 },
  { month: "Окт", earned: 24200, tasks: 12 },
  { month: "Ноя", earned: 31000, tasks: 15 },
  { month: "Дек", earned: 28700, tasks: 13 },
  { month: "Янв", earned: 35400, tasks: 18 },
  { month: "Фев", earned: 38200, tasks: 20 },
];

const categoryStats = [
  { name: "Банковские услуги", tasks: 25, earned: "42 000 ₽", pct: 35 },
  { name: "Подбор персонала", tasks: 18, earned: "32 400 ₽", pct: 27 },
  { name: "Страхование", tasks: 12, earned: "18 000 ₽", pct: 15 },
  { name: "Туризм", tasks: 8, earned: "16 000 ₽", pct: 13 },
  { name: "Займы", tasks: 7, earned: "12 600 ₽", pct: 10 },
];

const maxEarned = Math.max(...monthlyData.map(d => d.earned));

const Statistics = () => (
  <DashboardLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-1">Статистика</h1>
      <p className="text-sm text-muted-foreground">Аналитика вашей эффективности</p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard icon={Wallet} label="Всего заработано" value="121 000 ₽" change="+18% к прошлому месяцу" positive />
      <StatCard icon={ClipboardCheck} label="Заданий выполнено" value="70" change="96% успешных" positive />
      <StatCard icon={Target} label="Средний чек" value="1 730 ₽" change="+5%" positive />
      <StatCard icon={Award} label="Рейтинг" value="4.8 / 5" change="Топ 5%" positive />
    </div>

    {/* Chart */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl p-6 mb-8"
    >
      <h3 className="font-semibold mb-6">Доход по месяцам</h3>
      <div className="flex items-end gap-3 h-48">
        {monthlyData.map((d, i) => (
          <motion.div
            key={d.month}
            initial={{ height: 0 }}
            animate={{ height: `${(d.earned / maxEarned) * 100}%` }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-end"
          >
            <div className="text-xs font-medium mb-1">{(d.earned / 1000).toFixed(0)}K</div>
            <div className="w-full rounded-t-lg gradient-accent min-h-[4px]" style={{ height: "100%" }} />
            <div className="text-xs text-muted-foreground mt-2">{d.month}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>

    <div className="grid lg:grid-cols-2 gap-6">
      {/* By category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="font-semibold mb-5">По категориям</h3>
        <div className="space-y-4">
          {categoryStats.map(c => (
            <div key={c.name}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium">{c.name}</span>
                <span className="text-muted-foreground">{c.tasks} заданий · {c.earned}</span>
              </div>
              <Progress value={c.pct} className="h-2" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="font-semibold mb-5">Достижения</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { emoji: "🏆", title: "Первое задание", desc: "Выполнено", done: true },
            { emoji: "🔥", title: "10 заданий подряд", desc: "Без отклонений", done: true },
            { emoji: "💎", title: "Топ исполнитель", desc: "Рейтинг 4.5+", done: true },
            { emoji: "🚀", title: "100 заданий", desc: "30 осталось", done: false },
            { emoji: "👥", title: "5 рефералов", desc: "Выполнено", done: true },
            { emoji: "💰", title: "Заработок 200K", desc: "79K осталось", done: false },
          ].map((a, i) => (
            <div key={i} className={`p-3 rounded-xl border ${a.done ? "border-accent/30 bg-accent/5" : "border-border opacity-60"}`}>
              <div className="text-2xl mb-2">{a.emoji}</div>
              <div className="text-sm font-medium">{a.title}</div>
              <div className="text-xs text-muted-foreground">{a.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </DashboardLayout>
);

export default Statistics;
