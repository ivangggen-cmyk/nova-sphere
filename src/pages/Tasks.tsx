import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = ["Все", "Финансы", "Тестирование", "Маркетинг", "Регистрации", "Опросы"];

const tasks = [
  { id: 1, title: "Регистрация в сервисе FinApp", category: "Регистрации", reward: "850 ₽", deadline: "16 фев", difficulty: "Легко", spots: 12, status: "available" },
  { id: 2, title: "Обзор мобильного приложения BankX", category: "Тестирование", reward: "1 200 ₽", deadline: "18 фев", difficulty: "Средне", spots: 5, status: "review" },
  { id: 3, title: "Тестирование платёжной формы", category: "Тестирование", reward: "2 000 ₽", deadline: "20 фев", difficulty: "Сложно", spots: 3, status: "in_progress" },
  { id: 4, title: "Заполнение анкеты страхования", category: "Финансы", reward: "500 ₽", deadline: "15 фев", difficulty: "Легко", spots: 50, status: "available" },
  { id: 5, title: "Маркетинговый опрос B2B", category: "Опросы", reward: "300 ₽", deadline: "22 фев", difficulty: "Легко", spots: 100, status: "available" },
  { id: 6, title: "Публикация отзыва о сервисе", category: "Маркетинг", reward: "750 ₽", deadline: "17 фев", difficulty: "Средне", spots: 20, status: "available" },
];

const difficultyColors: Record<string, string> = {
  "Легко": "bg-accent/10 text-accent",
  "Средне": "bg-amber-100 text-amber-700",
  "Сложно": "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  available: "Доступно",
  in_progress: "В работе",
  review: "На проверке",
};

const Tasks = () => {
  const [active, setActive] = useState("Все");
  const [search, setSearch] = useState("");

  const filtered = tasks.filter(t =>
    (active === "Все" || t.category === active) &&
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Задания</h1>
        <p className="text-sm text-muted-foreground">Выберите задание и начните зарабатывать</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск заданий..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(c => (
          <Button
            key={c}
            variant={active === c ? "default" : "outline"}
            size="sm"
            onClick={() => setActive(c)}
            className={active === c ? "gradient-accent text-accent-foreground border-0" : ""}
          >
            {c}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/dashboard/tasks/${task.id}`}
              className="flex items-center justify-between p-4 rounded-xl glass hover-lift group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm group-hover:text-accent transition-colors truncate">{task.title}</span>
                  <Badge variant="outline" className="shrink-0 text-xs">{task.category}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {task.deadline}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[task.difficulty]}`}>{task.difficulty}</span>
                  <span>Мест: {task.spots}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4 shrink-0">
                <span className="text-base font-bold">{task.reward}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Tasks;
