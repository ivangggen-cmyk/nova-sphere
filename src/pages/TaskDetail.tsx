import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, Briefcase, ExternalLink, ListChecks, Lightbulb, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const difficultyColors: Record<string, string> = {
  "Легко": "bg-success/10 text-success",
  "Средне": "bg-accent/10 text-accent",
  "Сложно": "bg-destructive/10 text-destructive",
};

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [taking, setTaking] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      const { data } = await supabase.from("tasks").select("*, task_categories(name)").eq("id", id).single();
      setTask(data);
      setLoading(false);
    };
    if (id) fetchTask();
  }, [id, user]);

  const handleTakeTask = () => {
    setShowConfirmModal(true);
  };

  const confirmTakeTask = async () => {
    if (!user || !task) return;
    setTaking(true);
    try {
      const { error } = await supabase.from("user_tasks").insert({ user_id: user.id, task_id: task.id, status: "in_progress" });
      if (error) throw error;
      toast({ title: "Задание принято!", description: "Задание добавлено в ваш список. Отправьте отчёт после выполнения." });
      setShowConfirmModal(false);
      navigate("/dashboard/report");
    } catch (error: any) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } finally { setTaking(false); }
  };

  if (loading) return <DashboardLayout><div className="text-center py-12 text-muted-foreground">Загрузка...</div></DashboardLayout>;
  if (!task) return <DashboardLayout><div className="text-center py-12 text-muted-foreground">Задание не найдено</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <Link to="/dashboard/tasks" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Назад
      </Link>
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="outline" className="mb-2">{task.task_categories?.name}</Badge>
                <h1 className="text-xl font-display font-bold mb-1">{task.title}</h1>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-medium bg-success/10 text-success">Доступно</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center py-4">
              <div><div className="text-lg font-mono font-bold">{Number(task.reward).toLocaleString("ru-RU")} ₽</div><div className="text-xs text-muted-foreground">Вознаграждение</div></div>
              <div><div className={`text-sm font-medium px-3 py-1 rounded-lg inline-block ${difficultyColors[task.difficulty] || ""}`}>{task.difficulty}</div><div className="text-xs text-muted-foreground mt-1">Сложность</div></div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2"><FileText className="h-4 w-4" /> Описание</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
          </div>

          {task.requirements?.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2"><ListChecks className="h-4 w-4" /> Требования</h3>
              <ul className="space-y-2">
                {task.requirements.map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />{r}</li>
                ))}
              </ul>
            </div>
          )}

          {task.recommendations?.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500" /> Рекомендации</h3>
              <ul className="space-y-2">
                {task.recommendations.map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="text-amber-500 shrink-0">•</span>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {task.steps?.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-display font-semibold text-sm mb-4">Инструкция</h3>
              <div className="space-y-3">
                {task.steps.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center text-xs text-primary-foreground font-bold shrink-0 mt-0.5">{i + 1}</div>
                    <p className="text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {task.criteria?.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Критерии проверки</h3>
              <ul className="space-y-2">
                {task.criteria.map((c: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />{c}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <Button className="w-full gradient-primary text-primary-foreground border-0 rounded-xl" size="lg" onClick={handleTakeTask} disabled={taking}>
              <Briefcase className="mr-2 h-4 w-4" /> Взять в работу
            </Button>
            <Separator />
            <div><div className="text-xs text-muted-foreground mb-1">Сложность</div><div className="text-sm font-medium">{task.difficulty}</div></div>
            <div><div className="text-xs text-muted-foreground mb-1">Категория</div><div className="text-sm font-medium">{task.task_categories?.name}</div></div>
          </div>

          {task.materials?.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h4 className="font-display font-semibold text-sm mb-3 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Материалы</h4>
              <div className="space-y-2">{task.materials.map((m: string) => (<div key={m} className="text-sm text-primary hover:underline cursor-pointer">{m}</div>))}</div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Confirmation Modal with Link */}
      <AnimatePresence>
        {showConfirmModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50" onClick={() => setShowConfirmModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card border border-border rounded-2xl shadow-elevated p-6">
              <button onClick={() => setShowConfirmModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
              <h3 className="font-display font-semibold text-lg mb-2">Принять задание?</h3>
              <p className="text-sm text-muted-foreground mb-4">{task.title}</p>
              
              {task.link_url && (
                <a href={task.link_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20 text-primary hover:bg-primary/10 transition-colors mb-4">
                  <ExternalLink className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium truncate">Ссылка для выполнения</span>
                </a>
              )}

              <div className="flex gap-3">
                <Button className="flex-1 gradient-primary text-primary-foreground border-0 rounded-xl" onClick={confirmTakeTask} disabled={taking}>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Принять в работу
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowConfirmModal(false)}>
                  Отклонить
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default TaskDetail;
