import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, Info, AlertTriangle, Gift, Clock, Settings } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const typeConfig: Record<string, { icon: any; color: string }> = {
  success: { icon: CheckCircle2, color: "text-accent" },
  info: { icon: Info, color: "text-primary" },
  warning: { icon: AlertTriangle, color: "text-amber-500" },
  bonus: { icon: Gift, color: "text-purple-500" },
  system: { icon: Settings, color: "text-muted-foreground" },
};

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setNotifications(data || []);
        setLoading(false);
      });
  }, [user]);

  const markAllRead = async () => {
    if (!user) return;
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;
    
    await supabase.from("notifications").update({ is_read: true }).in("id", unreadIds);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markOneRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

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

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Нет уведомлений</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => {
            const cfg = typeConfig[n.type] || typeConfig.info;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-start gap-4 p-4 rounded-xl glass transition-all cursor-pointer ${!n.is_read ? "ring-1 ring-accent/20" : "opacity-75"}`}
                onClick={() => !n.is_read && markOneRead(n.id)}
              >
                <div className={`mt-0.5 ${cfg.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm">{n.title}</span>
                    {!n.is_read && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Clock className="h-3 w-3" /> {new Date(n.created_at).toLocaleDateString("ru-RU")}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Notifications;
