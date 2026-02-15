import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, FileImage, FileText, Mic, CheckCircle2, ChevronRight, AlertTriangle } from "lucide-react";
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
  const [submittedTaskIds, setSubmittedTaskIds] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [format, setFormat] = useState<ReportFormat>("text");
  const [textReport, setTextReport] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      const { data: tasks } = await supabase.from("user_tasks")
        .select("*, tasks(title, reward, deadline, task_categories(name))")
        .eq("user_id", user.id).in("status", ["assigned", "in_progress"]);
      const { data: existingReports } = await supabase.from("reports").select("user_task_id").eq("user_id", user.id);
      const submitted = new Set((existingReports || []).map((r: any) => r.user_task_id));
      setSubmittedTaskIds(submitted);
      setUserTasks((tasks || []).filter((t: any) => !submitted.has(t.id)));
      setLoading(false);
    };
    fetchTasks();
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !selectedTask) return;
    const { data: existing } = await supabase.from("reports").select("id").eq("user_task_id", selectedTask).eq("user_id", user.id).limit(1);
    if (existing && existing.length > 0) {
      toast({ title: "Отчёт уже отправлен", variant: "destructive" }); return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("reports").insert({ user_task_id: selectedTask, user_id: user.id, format, content: format === "text" ? textReport : `${format} отчёт`, status: "pending" });
      if (error) throw error;
      await supabase.from("user_tasks").update({ status: "submitted" }).eq("id", selectedTask);
      await supabase.from("security_logs").insert({ user_id: user.id, event: "report_submitted", details: `Task: ${selectedTask}, Format: ${format}` });
      toast({ title: "Отчёт отправлен!" });
      setSubmitted(true);
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  if (submitted) return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6"><CheckCircle2 className="h-8 w-8 text-primary-foreground" /></div>
        <h2 className="text-2xl font-display font-bold mb-2">Отчёт отправлен</h2>
        <p className="text-muted-foreground mb-6 max-w-md">Администратор рассмотрит ваш отчёт.</p>
        <Button variant="outline" className="rounded-xl" onClick={() => window.location.reload()}>Вернуться</Button>
      </motion.div>
    </DashboardLayout>
  );

  if (selectedTask === null) return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold mb-1">Отправить отчёт</h1>
        <p className="text-sm text-muted-foreground">Выберите задание (1 отчёт на задание)</p>
      </div>
      {loading ? <div className="text-center py-12 text-muted-foreground">Загрузка...</div> :
       userTasks.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Нет заданий для отчёта.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {userTasks.map((ut, i) => (
            <motion.div key={ut.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              onClick={() => setSelectedTask(ut.id)}
              className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all cursor-pointer group">
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm group-hover:text-primary transition-colors truncate block">{ut.tasks?.title}</span>
                <Badge variant="outline" className="text-[11px] mt-1">{ut.tasks?.task_categories?.name}</Badge>
              </div>
              <div className="flex items-center gap-3 ml-4 shrink-0">
                <span className="text-sm font-mono font-bold">{ut.tasks?.reward ? `${Number(ut.tasks.reward).toLocaleString("ru-RU")} ₽` : ""}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );

  const selectedUserTask = userTasks.find(ut => ut.id === selectedTask);

  return (
    <DashboardLayout>
      <button onClick={() => setSelectedTask(null)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">← Назад</button>
      <div className="max-w-2xl space-y-4">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-display font-bold mb-1">{selectedUserTask?.tasks?.title}</h2>
          <Badge variant="outline">{selectedUserTask?.tasks?.task_categories?.name}</Badge>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-semibold text-sm mb-4">Формат отчёта</h3>
          <div className="grid grid-cols-3 gap-3">
            {([{ key: "photo" as ReportFormat, icon: FileImage, label: "Фото" }, { key: "text" as ReportFormat, icon: FileText, label: "Текст" }, { key: "audio" as ReportFormat, icon: Mic, label: "Аудио" }]).map(f => (
              <button key={f.key} onClick={() => setFormat(f.key)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${format === f.key ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                <f.icon className={`h-6 w-6 ${format === f.key ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${format === f.key ? "text-primary" : "text-muted-foreground"}`}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          {format === "text" && <Textarea placeholder="Опишите результат..." value={textReport} onChange={(e) => setTextReport(e.target.value)} rows={6} className="resize-none rounded-xl" />}
          {format === "photo" && <div className="border-2 border-dashed border-border rounded-xl p-8 text-center"><FileImage className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><p className="text-sm text-muted-foreground mb-2">Загрузите фото</p><Button variant="outline" size="sm" className="rounded-xl">Выбрать файл</Button></div>}
          {format === "audio" && <div className="border-2 border-dashed border-border rounded-xl p-8 text-center"><Mic className="h-10 w-10 text-muted-foreground mx-auto mb-3" /><p className="text-sm text-muted-foreground mb-2">Загрузите аудио</p><Button variant="outline" size="sm" className="rounded-xl">Загрузить</Button></div>}
        </div>
        <Button className="w-full gradient-primary text-primary-foreground border-0 rounded-xl" size="lg" onClick={handleSubmit}
          disabled={submitting || (format === "text" && !textReport.trim())}>
          <Send className="mr-2 h-4 w-4" /> {submitting ? "Отправка..." : "Отправить отчёт"}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Report;
