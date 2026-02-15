import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, ClipboardList, CreditCard, Settings, BarChart3,
  Shield, Bell, FileText, ChevronLeft, LogOut, Search, Plus, Eye, Ban,
  Edit, Trash2, CheckCircle2, XCircle, Clock, DollarSign, TrendingUp,
  Mail, Globe, Lock, Megaphone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/StatCard";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const adminNav = [
  { label: "Обзор", icon: LayoutDashboard, tab: "overview" },
  { label: "Пользователи", icon: Users, tab: "users" },
  { label: "Задания", icon: ClipboardList, tab: "tasks" },
  { label: "Финансы", icon: CreditCard, tab: "finance" },
  { label: "Отчёты", icon: FileText, tab: "reports" },
  { label: "Рефералы", icon: TrendingUp, tab: "referrals" },
  { label: "Контент", icon: Megaphone, tab: "content" },
  { label: "Настройки", icon: Settings, tab: "settings" },
  { label: "Безопасность", icon: Shield, tab: "security" },
];

const mockUsers = [
  { id: 1, name: "Алексей Иванов", email: "alex@mail.ru", balance: "24 580 ₽", tasks: 47, rating: 4.8, status: "active", level: "Продвинутый", joined: "10 янв 2026" },
  { id: 2, name: "Мария Козлова", email: "maria@gmail.com", balance: "12 300 ₽", tasks: 23, rating: 4.5, status: "active", level: "Новичок", joined: "25 янв 2026" },
  { id: 3, name: "Дмитрий Петров", email: "dmitry@yandex.ru", balance: "45 100 ₽", tasks: 89, rating: 4.9, status: "active", level: "Эксперт", joined: "5 дек 2025" },
  { id: 4, name: "Елена Смирнова", email: "elena@mail.ru", balance: "1 200 ₽", tasks: 5, rating: 3.2, status: "blocked", level: "Новичок", joined: "1 фев 2026" },
  { id: 5, name: "Олег Сидоров", email: "oleg@inbox.ru", balance: "31 800 ₽", tasks: 62, rating: 4.7, status: "active", level: "Продвинутый", joined: "15 ноя 2025" },
];

const mockTasks = [
  { id: 1, title: "Открой ИП и получи вознаграждение", category: "Банковские услуги", reward: "3 500 ₽", completed: 38, total: 50, status: "active" },
  { id: 2, title: "Найди курьера для Яндекс Еда", category: "Подбор персонала", reward: "2 000 ₽", completed: 45, total: 100, status: "active" },
  { id: 3, title: "Оформи дебетовую карту Тинькофф", category: "Банковские услуги", reward: "1 500 ₽", completed: 180, total: 200, status: "active" },
  { id: 4, title: "Оформи полис ОСАГО онлайн", category: "Страхование", reward: "1 200 ₽", completed: 60, total: 80, status: "paused" },
  { id: 5, title: "Забронируй тур через партнёра", category: "Туризм", reward: "4 000 ₽", completed: 15, total: 15, status: "completed" },
];

const mockTransactions = [
  { id: 1, user: "Алексей И.", amount: "5 000 ₽", type: "withdrawal", status: "pending", date: "15 фев" },
  { id: 2, user: "Дмитрий П.", amount: "8 200 ₽", type: "withdrawal", status: "approved", date: "14 фев" },
  { id: 3, user: "Мария К.", amount: "2 100 ₽", type: "reward", status: "approved", date: "14 фев" },
  { id: 4, user: "Олег С.", amount: "3 500 ₽", type: "withdrawal", status: "pending", date: "13 фев" },
  { id: 5, user: "Елена С.", amount: "1 200 ₽", type: "reward", status: "approved", date: "13 фев" },
];

const pendingReports = [
  { id: 1, user: "Алексей И.", task: "Открой ИП", format: "Текст", submitted: "15 фев 14:30", status: "pending" },
  { id: 2, user: "Мария К.", task: "Найди курьера", format: "Фото", submitted: "15 фев 12:15", status: "pending" },
  { id: 3, user: "Олег С.", task: "Оформи карту Тинькофф", format: "Текст", submitted: "14 фев 18:00", status: "pending" },
  { id: 4, user: "Дмитрий П.", task: "Полис ОСАГО", format: "Аудио", submitted: "14 фев 10:45", status: "approved" },
];

const Admin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchUsers, setSearchUsers] = useState("");

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUsers.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold">
            <ChevronLeft className="h-4 w-4 text-sidebar-foreground/50" />
            <span className="text-accent">Atlantic</span>
            <Badge className="ml-1 bg-accent/20 text-accent border-0 text-[10px]">Admin</Badge>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {adminNav.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all w-full text-left",
                activeTab === item.tab
                  ? "bg-sidebar-accent text-accent font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors">
            <LogOut className="h-4 w-4" />
            В кабинет
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Панель администратора</h1>
              <p className="text-sm text-muted-foreground mb-6">Обзор платформы Atlantic</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Users} label="Пользователей" value="1 247" change="+52 за неделю" positive />
                <StatCard icon={ClipboardList} label="Активных заданий" value="24" change="+3 новых" positive />
                <StatCard icon={DollarSign} label="Выплачено за месяц" value="2.4M ₽" change="+18%" positive />
                <StatCard icon={FileText} label="Отчётов на проверке" value="14" change="Ожидают" />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Последние отчёты</h3>
                  <div className="space-y-3">
                    {pendingReports.slice(0, 3).map(r => (
                      <div key={r.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <div>
                          <div className="text-sm font-medium">{r.user} — {r.task}</div>
                          <div className="text-xs text-muted-foreground">{r.format} · {r.submitted}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-accent border-accent/30 hover:bg-accent/10">
                            <CheckCircle2 className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10">
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Ожидают выплат</h3>
                  <div className="space-y-3">
                    {mockTransactions.filter(t => t.status === "pending").map(t => (
                      <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <div>
                          <div className="text-sm font-medium">{t.user}</div>
                          <div className="text-xs text-muted-foreground">{t.date} · Вывод</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-sm">{t.amount}</span>
                          <Button size="sm" className="h-8 gradient-accent text-accent-foreground border-0">
                            Подтвердить
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Пользователи</h1>
                  <p className="text-sm text-muted-foreground">{mockUsers.length} зарегистрированных</p>
                </div>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Поиск по имени или email..." value={searchUsers} onChange={(e) => setSearchUsers(e.target.value)} className="pl-10" />
              </div>

              <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium text-muted-foreground">Пользователь</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Уровень</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Баланс</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Заданий</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Рейтинг</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Статус</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                                {u.name[0]}
                              </div>
                              <div>
                                <div className="font-medium">{u.name}</div>
                                <div className="text-xs text-muted-foreground">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4"><Badge variant="outline">{u.level}</Badge></td>
                          <td className="p-4 font-medium">{u.balance}</td>
                          <td className="p-4">{u.tasks}</td>
                          <td className="p-4">{u.rating}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.status === "active" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                              {u.status === "active" ? "Активен" : "Заблокирован"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Eye className="h-3.5 w-3.5" /></Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive"><Ban className="h-3.5 w-3.5" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tasks management */}
          {activeTab === "tasks" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Управление заданиями</h1>
                  <p className="text-sm text-muted-foreground">{mockTasks.length} заданий</p>
                </div>
                <Button className="gradient-accent text-accent-foreground border-0">
                  <Plus className="h-4 w-4 mr-2" /> Создать задание
                </Button>
              </div>

              <div className="space-y-3">
                {mockTasks.map((task, i) => (
                  <motion.div key={task.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="glass rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{task.title}</span>
                            <Badge variant="outline">{task.category}</Badge>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              task.status === "active" ? "bg-accent/10 text-accent" :
                              task.status === "paused" ? "bg-amber-100 text-amber-700" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {task.status === "active" ? "Активно" : task.status === "paused" ? "Пауза" : "Завершено"}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Вознаграждение: {task.reward} · Выполнено: {task.completed}/{task.total}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="h-1.5 rounded-full gradient-accent" style={{ width: `${(task.completed / task.total) * 100}%` }} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Finance */}
          {activeTab === "finance" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Финансы</h1>
              <p className="text-sm text-muted-foreground mb-6">Транзакции и выплаты</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={DollarSign} label="Баланс платформы" value="8.2M ₽" positive />
                <StatCard icon={TrendingUp} label="Выплачено за месяц" value="2.4M ₽" change="+18%" positive />
                <StatCard icon={Clock} label="Ожидают выплаты" value="142K ₽" />
                <StatCard icon={CreditCard} label="Комиссия" value="5%" />
              </div>

              <div className="glass rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="font-semibold">Последние транзакции</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium text-muted-foreground">Пользователь</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Тип</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Сумма</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Дата</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Статус</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTransactions.map(t => (
                        <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-medium">{t.user}</td>
                          <td className="p-4">{t.type === "withdrawal" ? "Вывод" : "Начисление"}</td>
                          <td className="p-4 font-semibold">{t.amount}</td>
                          <td className="p-4 text-muted-foreground">{t.date}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              t.status === "approved" ? "bg-accent/10 text-accent" : "bg-amber-100 text-amber-700"
                            }`}>
                              {t.status === "approved" ? "Подтверждено" : "Ожидает"}
                            </span>
                          </td>
                          <td className="p-4">
                            {t.status === "pending" && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="h-7 text-xs text-accent" onClick={() => toast({ title: "Выплата подтверждена" })}>Подтвердить</Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs text-destructive">Отклонить</Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Reports moderation */}
          {activeTab === "reports" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Проверка отчётов</h1>
              <p className="text-sm text-muted-foreground mb-6">Модерация отчётов пользователей</p>

              <div className="space-y-3">
                {pendingReports.map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="glass rounded-xl p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{r.user}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className="text-sm">{r.task}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>Формат: {r.format}</span>
                            <span>{r.submitted}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {r.status === "pending" ? (
                            <>
                              <Button size="sm" variant="outline" className="text-accent border-accent/30 hover:bg-accent/10">
                                <Eye className="h-3.5 w-3.5 mr-1" /> Просмотр
                              </Button>
                              <Button size="sm" className="gradient-accent text-accent-foreground border-0" onClick={() => toast({ title: "Отчёт одобрен" })}>
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Одобрить
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                                <XCircle className="h-3.5 w-3.5 mr-1" /> Отклонить
                              </Button>
                            </>
                          ) : (
                            <Badge className="bg-accent/10 text-accent border-0">Одобрен</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Referrals admin */}
          {activeTab === "referrals" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Реферальная система</h1>
              <p className="text-sm text-muted-foreground mb-6">Настройка и статистика</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Users} label="Всего рефералов" value="342" change="+28 за неделю" positive />
                <StatCard icon={TrendingUp} label="Выплачено бонусов" value="186K ₽" positive />
                <StatCard icon={BarChart3} label="Конверсия" value="23%" change="+2%" positive />
                <StatCard icon={DollarSign} label="Ср. доход реферала" value="4 200 ₽" />
              </div>

              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-4">Настройка процентов</h3>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { level: "1-й уровень", pct: "10%" },
                    { level: "2-й уровень", pct: "5%" },
                    { level: "3-й уровень", pct: "2%" },
                  ].map(l => (
                    <div key={l.level} className="text-center p-4 rounded-xl border border-border">
                      <div className="text-2xl font-bold text-accent mb-1">{l.pct}</div>
                      <div className="text-sm text-muted-foreground">{l.level}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {activeTab === "content" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Управление контентом</h1>
              <p className="text-sm text-muted-foreground mb-6">Страницы, баннеры, новости</p>

              <div className="grid lg:grid-cols-3 gap-6">
                {[
                  { title: "Лендинг", desc: "Главная страница", icon: Globe, count: "7 секций" },
                  { title: "Баннеры", desc: "Промо-материалы", icon: Megaphone, count: "3 активных" },
                  { title: "Email-рассылки", desc: "Шаблоны писем", icon: Mail, count: "5 шаблонов" },
                ].map((c, i) => (
                  <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className="glass rounded-2xl p-6 hover-lift cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                        <c.icon className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-semibold mb-1">{c.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{c.desc}</p>
                      <Badge variant="outline">{c.count}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Системные настройки</h1>
              <p className="text-sm text-muted-foreground mb-6">Конфигурация платформы</p>

              <div className="space-y-6">
                {[
                  { title: "Роли и права", items: ["Администратор", "Модератор", "Поддержка"] },
                  { title: "Уведомления", items: ["Email-уведомления", "Push-уведомления", "Telegram-бот"] },
                  { title: "Интеграции", items: ["Платёжная система", "SMS-сервис", "Аналитика"] },
                ].map((section, i) => (
                  <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className="glass rounded-2xl p-6">
                      <h3 className="font-semibold mb-4">{section.title}</h3>
                      <div className="space-y-3">
                        {section.items.map(item => (
                          <div key={item} className="flex items-center justify-between py-2">
                            <span className="text-sm">{item}</span>
                            <Switch />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Безопасность</h1>
              <p className="text-sm text-muted-foreground mb-6">Защита и мониторинг</p>

              <div className="grid lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="h-4 w-4" /> Настройки безопасности</h3>
                  <div className="space-y-4">
                    {[
                      "Двухфакторная аутентификация (обязательная)",
                      "Защита от накруток",
                      "Антифрод-алгоритм",
                      "Логирование всех действий",
                      "Блокировка подозрительных IP",
                      "Шифрование данных",
                    ].map(item => (
                      <div key={item} className="flex items-center justify-between py-1">
                        <span className="text-sm">{item}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><Lock className="h-4 w-4" /> Лог безопасности</h3>
                  <div className="space-y-3">
                    {[
                      { event: "Вход администратора", ip: "192.168.1.1", time: "15 фев 14:30" },
                      { event: "Блокировка пользователя #4", ip: "192.168.1.1", time: "15 фев 12:15" },
                      { event: "Подозрительная активность", ip: "10.0.0.45", time: "14 фев 23:00" },
                      { event: "Массовая выплата", ip: "192.168.1.1", time: "14 фев 10:00" },
                      { event: "Изменение настроек комиссии", ip: "192.168.1.2", time: "13 фев 16:30" },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <div className="text-sm">{log.event}</div>
                          <div className="text-xs text-muted-foreground">IP: {log.ip}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">{log.time}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
