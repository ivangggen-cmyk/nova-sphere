import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users, AlertCircle, CheckCircle2, FileText, MessageCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const TaskDetail = () => {
  const { id } = useParams();

  return (
    <DashboardLayout>
      <Link to="/dashboard/tasks" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Назад к заданиям
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Header */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="outline" className="mb-2">Тестирование</Badge>
                <h1 className="text-xl font-bold mb-1">Тестирование платёжной формы</h1>
                <p className="text-sm text-muted-foreground">Задание #{id} · Создано 10 фев 2026</p>
              </div>
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">В работе</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center py-4">
              <div>
                <div className="text-lg font-bold">2 000 ₽</div>
                <div className="text-xs text-muted-foreground">Вознаграждение</div>
              </div>
              <div>
                <div className="text-lg font-bold flex items-center justify-center gap-1"><Clock className="h-4 w-4" /> 3 дня</div>
                <div className="text-xs text-muted-foreground">Срок выполнения</div>
              </div>
              <div>
                <div className="text-lg font-bold flex items-center justify-center gap-1"><Users className="h-4 w-4" /> 3/10</div>
                <div className="text-xs text-muted-foreground">Мест занято</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><FileText className="h-4 w-4" /> Описание</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Необходимо пройти процесс оплаты в тестовой среде платёжного сервиса. Проверить корректность работы формы на разных устройствах, зафиксировать ошибки и составить отчёт.
            </p>
          </div>

          {/* Steps */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Пошаговая инструкция</h3>
            <div className="space-y-3">
              {[
                "Перейдите по ссылке в тестовую среду",
                "Заполните форму тестовыми данными карты",
                "Выполните платёж и сделайте скриншот",
                "Повторите на мобильном устройстве",
                "Составьте отчёт с описанием найденных багов",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full gradient-accent flex items-center justify-center text-xs text-accent-foreground font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Criteria */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Критерии проверки</h3>
            <ul className="space-y-2">
              {[
                "Все скриншоты чёткие и читаемые",
                "Отчёт содержит минимум 3 тестовых сценария",
                "Указаны устройства и браузеры тестирования",
                "Описаны найденные ошибки (если есть)",
              ].map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="glass rounded-2xl p-6 space-y-4">
            <Button className="w-full gradient-accent text-accent-foreground border-0" size="lg">
              Отправить отчёт
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <MessageCircle className="mr-2 h-4 w-4" /> Задать вопрос
            </Button>
            <Separator />
            <div>
              <div className="text-xs text-muted-foreground mb-2">Прогресс</div>
              <Progress value={40} className="h-2 mb-1" />
              <div className="text-xs text-muted-foreground">Шаг 2 из 5</div>
            </div>
            <Separator />
            <div>
              <div className="text-xs text-muted-foreground mb-1">Дедлайн</div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-accent" /> 20 февраля 2026
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Уровень доступа</div>
              <div className="text-sm font-medium">Продвинутый</div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Материалы
            </h4>
            <div className="space-y-2">
              {["Ссылка на тестовую среду", "Инструкция в PDF", "Шаблон отчёта"].map((m) => (
                <div key={m} className="text-sm text-accent hover:underline cursor-pointer">{m}</div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TaskDetail;
