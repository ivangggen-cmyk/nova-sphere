import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users, AlertCircle, CheckCircle2, FileText, MessageCircle, Briefcase } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const taskData: Record<string, any> = {
  "1": {
    title: "Открой ИП и получи вознаграждение",
    category: "Банковские услуги",
    reward: "3 500 ₽",
    deadline: "28 февраля 2026",
    deadlineDays: "13 дней",
    spots: "12/50",
    description: "Зарегистрируйте индивидуальное предпринимательство через партнёрский сервис. После успешной регистрации и подтверждения — получите вознаграждение.",
    steps: [
      "Перейдите по партнёрской ссылке на сервис регистрации ИП",
      "Заполните анкету с вашими данными",
      "Загрузите необходимые документы",
      "Дождитесь подтверждения регистрации",
      "Отправьте отчёт с подтверждением",
    ],
    criteria: [
      "Скриншот подтверждения регистрации ИП",
      "ИНН должен быть реальным и активным",
      "Регистрация через партнёрскую ссылку",
    ],
    materials: ["Партнёрская ссылка", "Инструкция по регистрации", "Список документов"],
  },
  "2": {
    title: "Найди курьера для Яндекс Еда",
    category: "Подбор персонала",
    reward: "2 000 ₽",
    deadline: "20 февраля 2026",
    deadlineDays: "5 дней",
    spots: "45/100",
    description: "Найдите и пригласите нового курьера в сервис Яндекс Еда. Кандидат должен пройти регистрацию и выполнить первый заказ.",
    steps: [
      "Найдите потенциального курьера",
      "Отправьте ему реферальную ссылку",
      "Кандидат должен зарегистрироваться",
      "Кандидат выполняет первый заказ",
      "Отправьте отчёт с данными курьера",
    ],
    criteria: [
      "Курьер зарегистрирован через вашу ссылку",
      "Курьер выполнил минимум 1 заказ",
      "Данные курьера подтверждены",
    ],
    materials: ["Реферальная ссылка", "Промо-материалы", "Шаблон обращения"],
  },
};

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const task = taskData[id || "1"] || taskData["1"];

  const handleTakeTask = () => {
    toast({
      title: "Задание взято в работу!",
      description: "Перейдите в раздел «Отправить отчёт» для отправки результата.",
    });
    navigate("/dashboard/report");
  };

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
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="outline" className="mb-2">{task.category}</Badge>
                <h1 className="text-xl font-bold mb-1">{task.title}</h1>
                <p className="text-sm text-muted-foreground">Задание #{id} · Создано 10 фев 2026</p>
              </div>
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-accent/10 text-accent">Доступно</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center py-4">
              <div>
                <div className="text-lg font-bold">{task.reward}</div>
                <div className="text-xs text-muted-foreground">Вознаграждение</div>
              </div>
              <div>
                <div className="text-lg font-bold flex items-center justify-center gap-1"><Clock className="h-4 w-4" /> {task.deadlineDays}</div>
                <div className="text-xs text-muted-foreground">Срок выполнения</div>
              </div>
              <div>
                <div className="text-lg font-bold flex items-center justify-center gap-1"><Users className="h-4 w-4" /> {task.spots}</div>
                <div className="text-xs text-muted-foreground">Мест занято</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><FileText className="h-4 w-4" /> Описание</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Пошаговая инструкция</h3>
            <div className="space-y-3">
              {task.steps.map((step: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full gradient-accent flex items-center justify-center text-xs text-accent-foreground font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Критерии проверки</h3>
            <ul className="space-y-2">
              {task.criteria.map((c: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="glass rounded-2xl p-6 space-y-4">
            <Button
              className="w-full gradient-accent text-accent-foreground border-0"
              size="lg"
              onClick={handleTakeTask}
            >
              <Briefcase className="mr-2 h-4 w-4" /> Взять в работу
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <MessageCircle className="mr-2 h-4 w-4" /> Задать вопрос
            </Button>
            <Separator />
            <div>
              <div className="text-xs text-muted-foreground mb-1">Дедлайн</div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-accent" /> {task.deadline}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Уровень доступа</div>
              <div className="text-sm font-medium">Все уровни</div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Материалы
            </h4>
            <div className="space-y-2">
              {task.materials.map((m: string) => (
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
