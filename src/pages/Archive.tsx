import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const statusConfig: Record<string, { label: string; cls: string; icon: any }> = {
  approved: { label: "Принято", cls: "bg-success/10 text-success", icon: CheckCircle2 },
  rejected: { label: "Отклонено", cls: "bg-destructive/10 text-destructive", icon: XCircle },
};

const Archive = () => {
  const { user } = useAuth();
  const [archivedTasks, setArchivedTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchArchive = async () => {
      const { data } = await supabase
        .from("user_tasks")
        .select("*, tasks(title, reward, task_categories(name))")
        .eq("user_id", user.id)
        .in("status", ["approved", "rejected"])
        .order("completed_at", { ascending: false });
      setArchivedTasks(data || []);
      setLoading(false);
    };
    fetchArchive();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold mb-1">Архив заданий</h1>
        <p className="text-sm text-muted-foreground">Завершённые и отклонённые задания</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
      ) : archivedTasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Нет архивных заданий</div>
      ) : (
        <div className="space-y-2">
          {archivedTasks.map((ut, i) => {
            const st = statusConfig[ut.status] || statusConfig.approved;
            const Icon = st.icon;
            return (
              <motion.div
                key={ut.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">{ut.tasks?.title || "Задание"}</span>
                    <Badge variant="outline" className="shrink-0 text-xs">{ut.tasks?.task_categories?.name}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {ut.completed_at && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(ut.completed_at).toLocaleDateString("ru-RU")}
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${st.cls}`}>
                      <Icon className="h-3 w-3" /> {st.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span className="text-sm font-mono font-semibold">
                    {ut.tasks?.reward ? `${Number(ut.tasks.reward).toLocaleString("ru-RU")} ₽` : ""}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Archive;
