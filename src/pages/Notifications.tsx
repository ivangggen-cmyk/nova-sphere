import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, Info, AlertTriangle, Gift, Clock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";

const initialNotifications = [
  { id: 1, type: "success", icon: CheckCircle2, title: "Отчёт одобрен", desc: "Ваш отчёт по заданию «Открой ИП» был одобрен. Вознаграждение 3 500 ₽ зачислено.", time: "30 мин назад", read: false },
  { id: 2, type: "info", icon: Info, title: "Новое задание доступно", desc: "Появилось новое задание в категории «Подбор персонала» с вознаграждением 2 200 ₽.", time: "2 часа назад", read: false },
  { id: 3, type: "warning", icon: AlertTriangle, title: "Дедлайн приближается", desc: "Задание «Найди курьера для Яндекс Еда» истекает через 2 дня.", time: "5 часов назад", read: false },
  { id: 4, type: "bonus", icon: Gift, title: "Бонус за активность", desc: "Вы получили бонус 500 ₽ за выполнение 5 заданий подряд!", time: "Вчера", read: true },
  { id: 5, type: "success", icon: CheckCircle2, title: "Выплата обработана", desc: "Выплата 5 000 ₽ отправлена на вашу карту *4521.", time: "2 дня назад", read: true },
  { id: 6, type: "info", icon: Info, title: "Реферал зарегистрировался", desc: "Ваш реферал Дмитрий П. зарегистрировался на платформе.", time: "3 дня назад", read: true },
];

const typeColors: Record<string, string> = {
  success: "text-accent",
  info: "text-primary",
  warning: "text-amber-500",
  bonus: "text-purple-500",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Уведомления</h1>
          <p className="text-sm text-muted-foreground">{unreadCount > 0 ? `${unreadCount} непрочитанных` : "Все прочитаны"}</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            Прочитать все
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => {
          const Icon = n.icon;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-start gap-4 p-4 rounded-xl glass transition-all ${!n.read ? "ring-1 ring-accent/20" : "opacity-75"}`}
            >
              <div className={`mt-0.5 ${typeColors[n.type]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm">{n.title}</span>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground">{n.desc}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <Clock className="h-3 w-3" /> {n.time}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
