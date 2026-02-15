import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";

const archivedTasks = [
  { id: 10, title: "Оформи кредитную карту Альфа-Банк", category: "Банковские услуги", reward: "1 800 ₽", date: "5 фев", status: "accepted" },
  { id: 11, title: "Найди курьера для Самокат", category: "Подбор персонала", reward: "1 500 ₽", date: "2 фев", status: "accepted" },
  { id: 12, title: "Оформи страховку жизни", category: "Страхование", reward: "2 200 ₽", date: "28 янв", status: "rejected" },
  { id: 13, title: "Подбери водителя в Ситимобил", category: "Подбор персонала", reward: "1 600 ₽", date: "25 янв", status: "accepted" },
  { id: 14, title: "Открой расчётный счёт для ИП", category: "Банковские услуги", reward: "2 500 ₽", date: "20 янв", status: "accepted" },
  { id: 15, title: "Забронируй тур в Турцию", category: "Туризм", reward: "3 800 ₽", date: "15 янв", status: "rejected" },
];

const statusConfig: Record<string, { label: string; cls: string; icon: any }> = {
  accepted: { label: "Принято", cls: "bg-accent/10 text-accent", icon: CheckCircle2 },
  rejected: { label: "Отклонено", cls: "bg-destructive/10 text-destructive", icon: XCircle },
};

const Archive = () => (
  <DashboardLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-1">Архив заданий</h1>
      <p className="text-sm text-muted-foreground">Завершённые и отклонённые задания</p>
    </div>

    <div className="space-y-3">
      {archivedTasks.map((task, i) => {
        const st = statusConfig[task.status];
        const Icon = st.icon;
        return (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center justify-between p-4 rounded-xl glass group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm truncate">{task.title}</span>
                  <Badge variant="outline" className="shrink-0 text-xs">{task.category}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {task.date}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${st.cls}`}>
                    <Icon className="h-3 w-3" /> {st.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4 shrink-0">
                <span className="text-base font-bold">{task.reward}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </DashboardLayout>
);

export default Archive;
