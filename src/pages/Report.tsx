import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, FileImage, FileText, Mic, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type ReportFormat = "photo" | "text" | "audio";

const Report = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [userTasks, setUserTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [format, setFormat] = useState<ReportFormat>("text");
  const [textReport, setTextReport] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("user_tasks")
        .select("*, tasks(title, reward, deadline, task_categories(name))")
        .eq("user_id", user.id)
        .in("status", ["assigned", "in_progress"]);
      setUserTasks(data || []);
      setLoading(false);
    };
    fetchTasks();
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !selectedTask) return;
    setSubmitting(true);
    try {
      // Create report
      const { error: reportError } = await supabase.from("reports").insert({
        user_task_id: selectedTask,
        user_id: user.id,
        format,
        content: format === "text" ? textReport : `${format} отчёт отправлен`,
        status: "pending",
      });
      if (reportError) throw reportError;

      // Update user_task status
      await supabase.from("user_tasks").update({ status: "submitted" }).eq("id", selectedTask);

      toast({ title: "Отчёт отправлен!", description: "Администратор проверит ваш отчёт и примет решение." });
      setSubmitted(true);
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-accent-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Отчёт отправлен на проверку</h2>
          <p className="text-muted-foreground mb-6 max-w-md">Администратор рассмотрит ваш отчёт и примет решение.</p>
          <Button variant="outline" onClick={() => { setSubmitted(false); setSelectedTask(null); setTextReport(""); }}>Отправить ещё отчёт</Button>
        </motion.div>
      </DashboardLayout>
    );
  }

  if (selectedTask === null) {
    return (
      <DashboardLayout>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Отправить отчёт</h1>
          <p className="text-sm text-muted-foreground">Выберите задание для отправки отчёта</p>
        </div>
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
        ) : userTasks.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">У вас нет заданий в работе. Возьмите задание из каталога.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userTasks.map((ut, i) => (
              <motion.div key={ut.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedTask(ut.id)}
                className="flex items-center justify-between p-4 rounded-xl glass hover-lift group cursor-pointer">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm group-hover:text-accent transition-colors truncate">{ut.tasks?.title}</span>
                    <Badge variant="outline" className="shrink-0 text-xs">{ut.tasks?.task_categories?.name}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">В работе</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span className="text-base font-bold">{ut.tasks?.reward ? `${Number(ut.tasks.reward).toLocaleString("ru-RU")} ₽` : ""}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </DashboardLayout>
    );
  }

  const selectedUserTask = userTasks.find(ut => ut.id === selectedTask);

  return (
    <DashboardLayout>
      <button onClick={() => setSelectedTask(null)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">← Назад к списку</button>
      <div className="max-w-2xl">
        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-1">{selectedUserTask?.tasks?.title}</h2>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="outline">{selectedUserTask?.tasks?.task_categories?.name}</Badge>
            <span>Вознаграждение: {selectedUserTask?.tasks?.reward ? `${Number(selectedUserTask.tasks.reward).toLocaleString("ru-RU")} ₽` : ""}</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-4">Формат отчёта</h3>
          <div className="grid grid-cols-3 gap-3">
            {([
              { key: "photo" as ReportFormat, icon: FileImage, label: "Фото" },
              { key: "text" as ReportFormat, icon: FileText, label: "Текст" },
              { key: "audio" as ReportFormat, icon: Mic, label: "Аудио" },
            ]).map(f => (
              <button key={f.key} onClick={() => setFormat(f.key)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${format === f.key ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"}`}>
                <f.icon className={`h-6 w-6 ${format === f.key ? "text-accent" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${format === f.key ? "text-accent" : "text-muted-foreground"}`}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 mb-6">
          {format === "text" && (
            <div>
              <h3 className="font-semibold mb-3">Текстовый отчёт</h3>
              <Textarea placeholder="Опишите результат выполнения задания..." value={textReport} onChange={(e) => setTextReport(e.target.value)} rows={6} className="resize-none" />
            </div>
          )}
          {format === "photo" && (
            <div>
              <h3 className="font-semibold mb-3">Загрузка фото</h3>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                <FileImage className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">Перетащите фото или нажмите для загрузки</p>
                <Button variant="outline" size="sm">Выбрать файл</Button>
              </div>
            </div>
          )}
          {format === "audio" && (
            <div>
              <h3 className="font-semibold mb-3">Аудио отчёт</h3>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                <Mic className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">Запишите голосовой отчёт или загрузите аудиофайл</p>
                <Button variant="outline" size="sm">Загрузить файл</Button>
              </div>
            </div>
          )}
        </div>

        <Button className="w-full gradient-accent text-accent-foreground border-0" size="lg" onClick={handleSubmit}
          disabled={submitting || (format === "text" && !textReport.trim())}>
          <Send className="mr-2 h-4 w-4" /> {submitting ? "Отправка..." : "Отправить отчёт на проверку"}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Report;
