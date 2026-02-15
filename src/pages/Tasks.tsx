import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Clock, ChevronRight, Building2, Users, Shield, Plane, Banknote } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const categoryIcons: Record<string, any> = {
  "Банковские услуги": Building2,
  "Подбор персонала": Users,
  "Страхование": Shield,
  "Туризм": Plane,
  "Займы": Banknote,
};

const difficultyColors: Record<string, string> = {
  "Легко": "bg-accent/10 text-accent",
  "Средне": "bg-amber-100 text-amber-700",
  "Сложно": "bg-red-100 text-red-700",
};

const Tasks = () => {
  const [active, setActive] = useState("Все");
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [tasksRes, catsRes] = await Promise.all([
        supabase.from("tasks").select("*, task_categories(name)").eq("status", "active"),
        supabase.from("task_categories").select("*"),
      ]);
      setTasks(tasksRes.data || []);
      setCategories(catsRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const categoryNames = ["Все", ...categories.map(c => c.name)];

  const filtered = tasks.filter(t => {
    const catName = t.task_categories?.name || "";
    return (active === "Все" || catName === active) &&
      t.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Задания</h1>
        <p className="text-sm text-muted-foreground">Выберите задание и начните зарабатывать</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Поиск заданий..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categoryNames.map(c => (
          <Button key={c} variant={active === c ? "default" : "outline"} size="sm" onClick={() => setActive(c)}
            className={active === c ? "gradient-accent text-accent-foreground border-0" : ""}>
            {c}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Нет доступных заданий</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((task, i) => (
            <motion.div key={task.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/dashboard/tasks/${task.id}`} className="flex items-center justify-between p-4 rounded-xl glass hover-lift group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm group-hover:text-accent transition-colors truncate">{task.title}</span>
                    <Badge variant="outline" className="shrink-0 text-xs">{task.task_categories?.name}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {task.deadline && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> до {new Date(task.deadline).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}</span>}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[task.difficulty] || ""}`}>{task.difficulty}</span>
                    <span>Мест: {task.taken_spots}/{task.total_spots}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span className="text-base font-bold">{Number(task.reward).toLocaleString("ru-RU")} ₽</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Tasks;
