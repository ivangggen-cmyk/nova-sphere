import { useState } from "react";
import { motion } from "framer-motion";
import { Send, FileImage, FileText, Mic, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type ReportFormat = "photo" | "text" | "audio";

const takenTasks = [
  { id: 1, title: "Открой ИП и получи вознаграждение", category: "Банковские услуги", reward: "3 500 ₽", deadline: "28 фев", status: "in_progress" },
  { id: 2, title: "Найди курьера для Яндекс Еда", category: "Подбор персонала", reward: "2 000 ₽", deadline: "20 фев", status: "in_progress" },
];

const Report = () => {
  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [format, setFormat] = useState<ReportFormat>("text");
  const [textReport, setTextReport] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    toast({
      title: "Отчёт отправлен!",
      description: "Администратор проверит ваш отчёт и примет решение.",
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-accent-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Отчёт отправлен на проверку</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Администратор рассмотрит ваш отчёт и примет решение. Вы получите уведомление о результате.
          </p>
          <Button variant="outline" onClick={() => { setSubmitted(false); setSelectedTask(null); }}>
            Отправить ещё отчёт
          </Button>
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

        {takenTasks.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">У вас нет заданий в работе. Возьмите задание из каталога.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {takenTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedTask(task.id)}
                className="flex items-center justify-between p-4 rounded-xl glass hover-lift group cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm group-hover:text-accent transition-colors truncate">{task.title}</span>
                    <Badge variant="outline" className="shrink-0 text-xs">{task.category}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> до {task.deadline}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">В работе</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span className="text-base font-bold">{task.reward}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </DashboardLayout>
    );
  }

  const task = takenTasks.find(t => t.id === selectedTask)!;

  return (
    <DashboardLayout>
      <button
        onClick={() => setSelectedTask(null)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        ← Назад к списку
      </button>

      <div className="max-w-2xl">
        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-1">{task.title}</h2>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="outline">{task.category}</Badge>
            <span>Вознаграждение: {task.reward}</span>
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
              <button
                key={f.key}
                onClick={() => setFormat(f.key)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  format === f.key
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/30"
                }`}
              >
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
              <Textarea
                placeholder="Опишите результат выполнения задания..."
                value={textReport}
                onChange={(e) => setTextReport(e.target.value)}
                rows={6}
                className="resize-none"
              />
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
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" size="sm">Начать запись</Button>
                  <Button variant="outline" size="sm">Загрузить файл</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          className="w-full gradient-accent text-accent-foreground border-0"
          size="lg"
          onClick={handleSubmit}
          disabled={format === "text" && !textReport.trim()}
        >
          <Send className="mr-2 h-4 w-4" /> Отправить отчёт на проверку
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Report;
