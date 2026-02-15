import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Users, ClipboardList, CreditCard, Settings, BarChart3,
  Shield, Bell, FileText, ChevronLeft, LogOut, Search, Plus, Eye, Ban,
  Edit, Trash2, CheckCircle2, XCircle, Clock, DollarSign, TrendingUp,
  Mail, Globe, Lock, Megaphone, Save, RefreshCw, UserPlus, AlertTriangle,
  Download, Upload, Filter, MoreVertical, Activity, Database, Zap, Award,
  MessageSquare, Layers, Tag, Target, Percent, ArrowUpRight, ArrowDownRight,
  Calendar, Hash, Star, PieChart, Bookmark, Send, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import StatCard from "@/components/StatCard";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const adminNav = [
  { label: "Обзор", icon: LayoutDashboard, tab: "overview" },
  { label: "Пользователи", icon: Users, tab: "users" },
  { label: "Задания", icon: ClipboardList, tab: "tasks" },
  { label: "Категории", icon: Tag, tab: "categories" },
  { label: "Финансы", icon: CreditCard, tab: "finance" },
  { label: "Отчёты", icon: FileText, tab: "reports" },
  { label: "Рефералы", icon: TrendingUp, tab: "referrals" },
  { label: "Уведомления", icon: Bell, tab: "notifications" },
  { label: "Контент", icon: Megaphone, tab: "content" },
  { label: "Баннеры", icon: Layers, tab: "banners" },
  { label: "Новости", icon: Globe, tab: "news" },
  { label: "Настройки", icon: Settings, tab: "settings" },
  { label: "Реквизиты", icon: CreditCard, tab: "requisites" },
  { label: "Безопасность", icon: Shield, tab: "security" },
  { label: "Логи", icon: Activity, tab: "logs" },
];

const Admin = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Data states
  const [users, setUsers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [platformSettings, setPlatformSettings] = useState<any[]>([]);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const [allRequisites, setAllRequisites] = useState<any[]>([]);
  // Search states
  const [searchUsers, setSearchUsers] = useState("");
  const [searchTasks, setSearchTasks] = useState("");
  
  // Form states
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskReward, setNewTaskReward] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");
  const [newTaskDifficulty, setNewTaskDifficulty] = useState("Легко");
  const [newTaskSpots, setNewTaskSpots] = useState("50");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskSteps, setNewTaskSteps] = useState("");
  const [newTaskCriteria, setNewTaskCriteria] = useState("");
  
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");
  
  const [newBannerTitle, setNewBannerTitle] = useState("");
  const [newBannerDesc, setNewBannerDesc] = useState("");
  const [newBannerLink, setNewBannerLink] = useState("");
  
  const [newNewsTitle, setNewNewsTitle] = useState("");
  const [newNewsContent, setNewNewsContent] = useState("");
  
  const [notifUserId, setNotifUserId] = useState("");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState<string>("info");
  
  // Edit states
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskReward, setEditTaskReward] = useState("");
  const [editTaskStatus, setEditTaskStatus] = useState("");

  // Stats
  const [stats, setStats] = useState({ users: 0, activeTasks: 0, totalPaid: 0, pendingReports: 0 });

  const fetchAll = useCallback(async () => {
    const [usersR, tasksR, catsR, txR, reportsR, refsR, settingsR, logsR, bannersR, newsR, notifsR, reqsR] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("tasks").select("*, task_categories(name)").order("created_at", { ascending: false }),
      supabase.from("task_categories").select("*").order("name"),
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
      supabase.from("reports").select("*, user_tasks(task_id, tasks(title))").order("submitted_at", { ascending: false }),
      supabase.from("referrals").select("*").order("created_at", { ascending: false }),
      supabase.from("platform_settings").select("*").order("key"),
      supabase.from("security_logs").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("banners").select("*").order("sort_order"),
      supabase.from("news").select("*").order("created_at", { ascending: false }),
      supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("user_requisites").select("*").order("created_at", { ascending: false }),
    ]);

    const profilesData = usersR.data || [];
    setUsers(profilesData);
    setTasks(tasksR.data || []);
    setCategories(catsR.data || []);

    // Enrich with profile names
    const profileMap = new Map(profilesData.map((p: any) => [p.user_id, p]));
    const enriched = (arr: any[]) => arr.map(item => ({ ...item, profiles: profileMap.get(item.user_id) || null }));

    setTransactions(enriched(txR.data || []));
    setReports(enriched(reportsR.data || []));
    setAllNotifications(enriched(notifsR.data || []));

    // Enrich referrals
    const refsEnriched = (refsR.data || []).map((r: any) => ({
      ...r,
      referrer: profileMap.get(r.referrer_id) || null,
      referred: profileMap.get(r.referred_id) || null,
    }));
    setReferrals(refsEnriched);

    setPlatformSettings(settingsR.data || []);
    setSecurityLogs(logsR.data || []);
    setBanners(bannersR.data || []);
    setNews(newsR.data || []);
    // Enrich requisites with profile names
    setAllRequisites(enriched(reqsR.data || []));
    const totalPaid = (txR.data || []).filter((t: any) => t.status === "completed" || t.status === "approved").reduce((s: number, t: any) => s + Number(t.amount), 0);
    const pendingReports = (reportsR.data || []).filter((r: any) => r.status === "pending").length;
    const activeTasks = (tasksR.data || []).filter((t: any) => t.status === "active").length;

    setStats({ users: profilesData.length, activeTasks, totalPaid, pendingReports });
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ====== USER ACTIONS ======
  const blockUser = async (userId: string, block: boolean) => {
    await supabase.from("profiles").update({ is_blocked: block }).eq("user_id", userId);
    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, is_blocked: block } : u));
    await logAction(block ? "Пользователь заблокирован" : "Пользователь разблокирован", userId);
    toast({ title: block ? "Пользователь заблокирован" : "Пользователь разблокирован" });
  };

  const updateUserBalance = async (userId: string, amount: number) => {
    const user = users.find(u => u.user_id === userId);
    if (!user) return;
    const newBalance = Number(user.balance) + amount;
    await supabase.from("profiles").update({ balance: newBalance, total_earned: Number(user.total_earned) + (amount > 0 ? amount : 0) }).eq("user_id", userId);
    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, balance: newBalance, total_earned: Number(u.total_earned) + (amount > 0 ? amount : 0) } : u));
    toast({ title: `Баланс обновлён: ${amount > 0 ? "+" : ""}${amount} ₽` });
  };

  const updateUserLevel = async (userId: string, level: string) => {
    await supabase.from("profiles").update({ level }).eq("user_id", userId);
    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, level } : u));
    toast({ title: `Уровень обновлён: ${level}` });
  };

  const verifyUser = async (userId: string, verified: boolean) => {
    await supabase.from("profiles").update({ is_verified: verified }).eq("user_id", userId);
    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, is_verified: verified } : u));
    // Notify user
    await supabase.from("notifications").insert({
      user_id: userId, type: "success" as const,
      title: verified ? "Аккаунт верифицирован!" : "Верификация отменена",
      message: verified ? "Администратор подтвердил вашу личность. Вам доступны все задания." : "Верификация вашего аккаунта отменена.",
    });
    await logAction(verified ? "Пользователь верифицирован" : "Верификация отменена", userId);
    toast({ title: verified ? "Пользователь верифицирован" : "Верификация отменена" });
  };

  const deleteUser = async (userId: string) => {
    // Just block and mark
    await supabase.from("profiles").update({ is_blocked: true }).eq("user_id", userId);
    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, is_blocked: true } : u));
    toast({ title: "Пользователь удалён (заблокирован)" });
  };

  // ====== TASK ACTIONS ======
  const createTask = async () => {
    if (!newTaskTitle || !newTaskCategory) { toast({ title: "Заполните название и категорию", variant: "destructive" }); return; }
    const { error, data } = await supabase.from("tasks").insert({
      title: newTaskTitle, description: newTaskDesc, reward: parseFloat(newTaskReward) || 0,
      category_id: newTaskCategory, difficulty: newTaskDifficulty,
      total_spots: parseInt(newTaskSpots) || 50,
      deadline: newTaskDeadline || null,
      steps: newTaskSteps ? newTaskSteps.split("\n").filter(Boolean) : [],
      criteria: newTaskCriteria ? newTaskCriteria.split("\n").filter(Boolean) : [],
      created_by: user?.id,
    }).select("*, task_categories(name)");
    if (error) { toast({ title: "Ошибка", description: error.message, variant: "destructive" }); return; }
    setTasks(prev => [data![0], ...prev]);
    setNewTaskTitle(""); setNewTaskDesc(""); setNewTaskReward(""); setNewTaskSteps(""); setNewTaskCriteria("");
    toast({ title: "Задание создано" });
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    await supabase.from("tasks").update({ status: status as any }).eq("id", taskId);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    toast({ title: `Статус задания: ${status}` });
  };

  const saveEditTask = async () => {
    if (!editingTask) return;
    await supabase.from("tasks").update({
      title: editTaskTitle, reward: parseFloat(editTaskReward) || 0,
      status: editTaskStatus as any,
    }).eq("id", editingTask);
    setTasks(prev => prev.map(t => t.id === editingTask ? { ...t, title: editTaskTitle, reward: parseFloat(editTaskReward), status: editTaskStatus } : t));
    setEditingTask(null);
    toast({ title: "Задание обновлено" });
  };

  const deleteTask = async (taskId: string) => {
    await supabase.from("tasks").delete().eq("id", taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast({ title: "Задание удалено" });
  };

  // ====== CATEGORY ACTIONS ======
  const createCategory = async () => {
    if (!newCategoryName) { toast({ title: "Введите название", variant: "destructive" }); return; }
    const { data, error } = await supabase.from("task_categories").insert({
      name: newCategoryName, description: newCategoryDesc, icon: newCategoryIcon
    }).select();
    if (error) { toast({ title: "Ошибка", description: error.message, variant: "destructive" }); return; }
    setCategories(prev => [...prev, data![0]]);
    setNewCategoryName(""); setNewCategoryDesc(""); setNewCategoryIcon("");
    toast({ title: "Категория создана" });
  };

  const deleteCategory = async (id: string) => {
    await supabase.from("task_categories").delete().eq("id", id);
    setCategories(prev => prev.filter(c => c.id !== id));
    toast({ title: "Категория удалена" });
  };

  // ====== FINANCE ACTIONS ======
  const approvePayment = async (id: string) => {
    await supabase.from("payments").update({ status: "approved" as const, completed_at: new Date().toISOString() }).eq("id", id);
    const tx = transactions.find(t => t.id === id);
    if (tx && tx.type === "withdrawal") {
      // Balance already deducted on request, just update total_withdrawn
      const userProfile = users.find(u => u.user_id === tx.user_id);
      if (userProfile) {
        const newWithdrawn = Number(userProfile.total_withdrawn) + Number(tx.amount);
        await supabase.from("profiles").update({ total_withdrawn: newWithdrawn }).eq("user_id", tx.user_id);
        setUsers(prev => prev.map(u => u.user_id === tx.user_id ? { ...u, total_withdrawn: newWithdrawn } : u));
      }
    }
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: "approved", completed_at: new Date().toISOString() } : t));
    await logAction("Выплата одобрена", id);
    toast({ title: "Выплата одобрена" });
  };

  const rejectPayment = async (id: string) => {
    const tx = transactions.find(t => t.id === id);
    await supabase.from("payments").update({ status: "rejected" as const }).eq("id", id);
    // Return balance to user on rejection
    if (tx && tx.type === "withdrawal") {
      const userProfile = users.find(u => u.user_id === tx.user_id);
      if (userProfile) {
        const newBal = Number(userProfile.balance) + Number(tx.amount);
        await supabase.from("profiles").update({ balance: newBal }).eq("user_id", tx.user_id);
        setUsers(prev => prev.map(u => u.user_id === tx.user_id ? { ...u, balance: newBal } : u));
      }
      // Notify user
      if (tx.user_id) {
        await supabase.from("notifications").insert({
          user_id: tx.user_id, type: "warning" as const,
          title: "Вывод отклонён", message: "Ваш запрос на вывод средств отклонён. Средства возвращены на баланс."
        });
      }
      await logAction("Вывод отклонён, средства возвращены", id);
    }
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: "rejected" } : t));
    toast({ title: "Выплата отклонена, средства возвращены" });
  };

  const createPayment = async (userId: string, amount: number, type: string, desc: string) => {
    const { data, error } = await supabase.from("payments").insert({
      user_id: userId, amount, type: type as any, description: desc, status: "completed" as const, completed_at: new Date().toISOString()
    }).select();
    if (error) { toast({ title: "Ошибка", description: error.message, variant: "destructive" }); return; }
    const profileMap = new Map(users.map((p: any) => [p.user_id, p]));
    setTransactions(prev => [{ ...data![0], profiles: profileMap.get(userId) || null }, ...prev]);
    if (type === "reward" || type === "referral_bonus") {
      await updateUserBalance(userId, amount);
    }
    toast({ title: "Платёж создан" });
  };

  // ====== REPORT ACTIONS ======
  const approveReport = async (id: string) => {
    const report = reports.find(r => r.id === id);
    await supabase.from("reports").update({ status: "approved" as const, reviewed_by: user?.id, reviewed_at: new Date().toISOString() }).eq("id", id);
    if (report?.user_task_id) {
      await supabase.from("user_tasks").update({ status: "approved" as const, completed_at: new Date().toISOString() }).eq("id", report.user_task_id);
      // Get task reward and pay user
      const { data: ut } = await supabase.from("user_tasks").select("*, tasks(reward)").eq("id", report.user_task_id).single();
      if (ut?.tasks?.reward && report?.user_id) {
        await createPayment(report.user_id, Number(ut.tasks.reward), "reward", `Награда за задание`);
        await supabase.from("profiles").update({ tasks_completed: (users.find(u => u.user_id === report.user_id)?.tasks_completed || 0) + 1 }).eq("user_id", report.user_id);
      }
      // Send notification
      if (report?.user_id) {
        await supabase.from("notifications").insert({ user_id: report.user_id, type: "success" as const, title: "Отчёт одобрен!", message: "Ваш отчёт был одобрен. Вознаграждение начислено." });
      }
    }
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
    await logAction("Отчёт одобрен", id);
    toast({ title: "Отчёт одобрен, вознаграждение начислено" });
  };

  const rejectReport = async (id: string) => {
    const report = reports.find(r => r.id === id);
    await supabase.from("reports").update({ status: "rejected" as const, reviewed_by: user?.id, reviewed_at: new Date().toISOString() }).eq("id", id);
    if (report?.user_task_id) {
      await supabase.from("user_tasks").update({ status: "rejected" as const }).eq("id", report.user_task_id);
    }
    if (report?.user_id) {
      await supabase.from("notifications").insert({ user_id: report.user_id, type: "warning" as const, title: "Отчёт отклонён", message: "Ваш отчёт был отклонён. Проверьте требования и отправьте повторно." });
    }
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
    toast({ title: "Отчёт отклонён" });
  };

  // ====== BANNER ACTIONS ======
  const createBanner = async () => {
    if (!newBannerTitle) return;
    const { data, error } = await supabase.from("banners").insert({ title: newBannerTitle, description: newBannerDesc, link_url: newBannerLink }).select();
    if (error) { toast({ title: "Ошибка", description: error.message, variant: "destructive" }); return; }
    setBanners(prev => [...prev, data![0]]);
    setNewBannerTitle(""); setNewBannerDesc(""); setNewBannerLink("");
    toast({ title: "Баннер создан" });
  };

  const toggleBanner = async (id: string, active: boolean) => {
    await supabase.from("banners").update({ is_active: active }).eq("id", id);
    setBanners(prev => prev.map(b => b.id === id ? { ...b, is_active: active } : b));
    toast({ title: active ? "Баннер активирован" : "Баннер деактивирован" });
  };

  const deleteBanner = async (id: string) => {
    await supabase.from("banners").delete().eq("id", id);
    setBanners(prev => prev.filter(b => b.id !== id));
    toast({ title: "Баннер удалён" });
  };

  // ====== NEWS ACTIONS ======
  const createNews = async () => {
    if (!newNewsTitle) return;
    const { data, error } = await supabase.from("news").insert({ title: newNewsTitle, content: newNewsContent }).select();
    if (error) { toast({ title: "Ошибка", variant: "destructive" }); return; }
    setNews(prev => [data![0], ...prev]);
    setNewNewsTitle(""); setNewNewsContent("");
    toast({ title: "Новость создана" });
  };

  const publishNews = async (id: string, publish: boolean) => {
    await supabase.from("news").update({ is_published: publish }).eq("id", id);
    setNews(prev => prev.map(n => n.id === id ? { ...n, is_published: publish } : n));
    toast({ title: publish ? "Новость опубликована" : "Новость снята с публикации" });
  };

  const deleteNews = async (id: string) => {
    await supabase.from("news").delete().eq("id", id);
    setNews(prev => prev.filter(n => n.id !== id));
    toast({ title: "Новость удалена" });
  };

  // ====== SETTINGS ACTIONS ======
  const updateSetting = async (key: string, value: string) => {
    await supabase.from("platform_settings").update({ value }).eq("key", key);
    setPlatformSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
    toast({ title: `Настройка "${key}" обновлена` });
  };

  // ====== NOTIFICATION ACTIONS ======
  const sendNotification = async () => {
    if (!notifUserId || !notifTitle) { toast({ title: "Выберите пользователя и введите заголовок", variant: "destructive" }); return; }
    const { error } = await supabase.from("notifications").insert({
      user_id: notifUserId, title: notifTitle, message: notifMessage, type: notifType as any
    });
    if (error) { toast({ title: "Ошибка", description: error.message, variant: "destructive" }); return; }
    setNotifTitle(""); setNotifMessage("");
    toast({ title: "Уведомление отправлено" });
  };

  const sendBroadcast = async () => {
    if (!notifTitle) { toast({ title: "Введите заголовок", variant: "destructive" }); return; }
    const inserts = users.map(u => ({
      user_id: u.user_id, title: notifTitle, message: notifMessage, type: notifType as any
    }));
    await supabase.from("notifications").insert(inserts);
    toast({ title: `Рассылка отправлена ${users.length} пользователям` });
  };

  // ====== LOG ACTION ======
  const logAction = async (event: string, details: string = "") => {
    await supabase.from("security_logs").insert({ user_id: user?.id, event, details });
  };

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const filteredTasks = tasks.filter(t =>
    t.title?.toLowerCase().includes(searchTasks.toLowerCase())
  );

  const pendingPayments = transactions.filter(t => t.status === "pending");
  const pendingReports = reports.filter(r => r.status === "pending");

  return (
    <div className="flex min-h-screen">
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
            <button key={item.tab} onClick={() => setActiveTab(item.tab)}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all w-full text-left",
                activeTab === item.tab ? "bg-sidebar-accent text-accent font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground")}>
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
              {item.tab === "reports" && pendingReports.length > 0 && <Badge className="ml-auto bg-destructive text-destructive-foreground text-[10px] h-5">{pendingReports.length}</Badge>}
              {item.tab === "finance" && pendingPayments.length > 0 && <Badge className="ml-auto bg-amber-500 text-white text-[10px] h-5">{pendingPayments.length}</Badge>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/50" onClick={() => { fetchAll(); toast({ title: "Данные обновлены" }); }}>
            <RefreshCw className="h-4 w-4 mr-2" /> Обновить
          </Button>
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors">
            <LogOut className="h-4 w-4" /> В кабинет
          </Link>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">

          {/* ===== OVERVIEW ===== */}
          {activeTab === "overview" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Панель администратора</h1>
              <p className="text-sm text-muted-foreground mb-6">Обзор платформы Atlantic</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Users} label="Пользователей" value={String(stats.users)} positive />
                <StatCard icon={ClipboardList} label="Активных заданий" value={String(stats.activeTasks)} positive />
                <StatCard icon={DollarSign} label="Выплачено" value={`${stats.totalPaid.toLocaleString("ru-RU")} ₽`} positive />
                <StatCard icon={FileText} label="Отчётов на проверке" value={String(stats.pendingReports)} />
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Последние отчёты</h3>
                  <div className="space-y-3">
                    {pendingReports.slice(0, 5).map(r => (
                      <div key={r.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <div>
                          <div className="text-sm font-medium">{r.profiles?.full_name || "—"} → {r.user_tasks?.tasks?.title || "—"}</div>
                          <div className="text-xs text-muted-foreground">{r.format} · {new Date(r.submitted_at).toLocaleString("ru-RU")}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-accent border-accent/30 hover:bg-accent/10" onClick={() => approveReport(r.id)}><CheckCircle2 className="h-3 w-3" /></Button>
                          <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => rejectReport(r.id)}><XCircle className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                    {pendingReports.length === 0 && <p className="text-sm text-muted-foreground">Нет отчётов на проверке</p>}
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Ожидают выплат</h3>
                  <div className="space-y-3">
                    {pendingPayments.slice(0, 5).map(t => (
                      <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <div>
                          <div className="text-sm font-medium">{t.profiles?.full_name || t.profiles?.email || "—"}</div>
                          <div className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString("ru-RU")} · {t.type === "withdrawal" ? "Вывод" : "Начисление"}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-sm">{Number(t.amount).toLocaleString("ru-RU")} ₽</span>
                          <Button size="sm" className="h-8 gradient-accent text-accent-foreground border-0" onClick={() => approvePayment(t.id)}>Подтвердить</Button>
                          <Button size="sm" variant="outline" className="h-8 text-destructive" onClick={() => rejectPayment(t.id)}>✕</Button>
                        </div>
                      </div>
                    ))}
                    {pendingPayments.length === 0 && <p className="text-sm text-muted-foreground">Нет ожидающих выплат</p>}
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* ===== USERS ===== */}
          {activeTab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Пользователи</h1>
                  <p className="text-sm text-muted-foreground">{users.length} зарегистрированных</p>
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
                        <th className="text-left p-4 font-medium text-muted-foreground">Верификация</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Статус</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{(u.full_name || u.email || "U")[0].toUpperCase()}</div>
                              <div>
                                <div className="font-medium">{u.full_name || "—"}</div>
                                <div className="text-xs text-muted-foreground">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Select defaultValue={u.level} onValueChange={v => updateUserLevel(u.user_id, v)}>
                              <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Новичок">Новичок</SelectItem>
                                <SelectItem value="Продвинутый">Продвинутый</SelectItem>
                                <SelectItem value="Эксперт">Эксперт</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-4 font-medium">{Number(u.balance).toLocaleString("ru-RU")} ₽</td>
                          <td className="p-4">{u.tasks_completed}</td>
                          <td className="p-4">{Number(u.rating).toFixed(1)}</td>
                          <td className="p-4">
                            <Button size="sm" variant={u.is_verified ? "default" : "outline"} className="h-7 text-xs" onClick={() => verifyUser(u.user_id, !u.is_verified)}>
                              {u.is_verified ? <><ShieldCheck className="h-3 w-3 mr-1" />Верифицирован</> : "Верифицировать"}
                            </Button>
                          </td>
                          <td className="p-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${!u.is_blocked ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                              {!u.is_blocked ? "Активен" : "Заблокирован"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Начислить 1000₽" onClick={() => updateUserBalance(u.user_id, 1000)}>
                                <DollarSign className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => blockUser(u.user_id, !u.is_blocked)}>
                                <Ban className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => deleteUser(u.user_id)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
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

          {/* ===== TASKS ===== */}
          {activeTab === "tasks" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Управление заданиями</h1>
                  <p className="text-sm text-muted-foreground">{tasks.length} заданий</p>
                </div>
              </div>

              {/* Create task form */}
              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Plus className="h-4 w-4" /> Создать задание</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div><Label className="text-xs">Название</Label><Input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Название задания" /></div>
                  <div><Label className="text-xs">Категория</Label>
                    <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                      <SelectTrigger><SelectValue placeholder="Выберите категорию" /></SelectTrigger>
                      <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-xs">Вознаграждение (₽)</Label><Input type="number" value={newTaskReward} onChange={e => setNewTaskReward(e.target.value)} /></div>
                  <div><Label className="text-xs">Сложность</Label>
                    <Select value={newTaskDifficulty} onValueChange={setNewTaskDifficulty}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Легко">Легко</SelectItem><SelectItem value="Средне">Средне</SelectItem><SelectItem value="Сложно">Сложно</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-xs">Кол-во мест</Label><Input type="number" value={newTaskSpots} onChange={e => setNewTaskSpots(e.target.value)} /></div>
                  <div><Label className="text-xs">Дедлайн</Label><Input type="date" value={newTaskDeadline} onChange={e => setNewTaskDeadline(e.target.value)} /></div>
                </div>
                <div className="space-y-4 mb-4">
                  <div><Label className="text-xs">Описание</Label><Textarea value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} rows={3} /></div>
                  <div><Label className="text-xs">Шаги (по одному на строку)</Label><Textarea value={newTaskSteps} onChange={e => setNewTaskSteps(e.target.value)} rows={3} placeholder="Шаг 1&#10;Шаг 2" /></div>
                  <div><Label className="text-xs">Критерии проверки (по одному на строку)</Label><Textarea value={newTaskCriteria} onChange={e => setNewTaskCriteria(e.target.value)} rows={3} /></div>
                </div>
                <Button className="gradient-accent text-accent-foreground border-0" onClick={createTask}><Plus className="h-4 w-4 mr-2" /> Создать</Button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Поиск заданий..." value={searchTasks} onChange={e => setSearchTasks(e.target.value)} className="pl-10" />
              </div>

              <div className="space-y-3">
                {filteredTasks.map((task, i) => (
                  <motion.div key={task.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <div className="glass rounded-xl p-5">
                      {editingTask === task.id ? (
                        <div className="space-y-3">
                          <Input value={editTaskTitle} onChange={e => setEditTaskTitle(e.target.value)} />
                          <div className="flex gap-3">
                            <Input type="number" value={editTaskReward} onChange={e => setEditTaskReward(e.target.value)} placeholder="Награда" className="w-32" />
                            <Select value={editTaskStatus} onValueChange={setEditTaskStatus}>
                              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="active">Активно</SelectItem><SelectItem value="paused">Пауза</SelectItem><SelectItem value="completed">Завершено</SelectItem></SelectContent>
                            </Select>
                            <Button size="sm" onClick={saveEditTask}><Save className="h-4 w-4 mr-1" /> Сохранить</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingTask(null)}>Отмена</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{task.title}</span>
                              <Badge variant="outline">{task.task_categories?.name}</Badge>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                task.status === "active" ? "bg-accent/10 text-accent" : task.status === "paused" ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}>
                                {task.status === "active" ? "Активно" : task.status === "paused" ? "Пауза" : "Завершено"}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Награда: {Number(task.reward).toLocaleString("ru-RU")} ₽ · Выполнено: {task.taken_spots}/{task.total_spots}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {task.status === "active" && <Button variant="ghost" size="sm" className="h-8" onClick={() => updateTaskStatus(task.id, "paused")} title="Приостановить"><Clock className="h-3.5 w-3.5" /></Button>}
                            {task.status === "paused" && <Button variant="ghost" size="sm" className="h-8" onClick={() => updateTaskStatus(task.id, "active")} title="Активировать"><Zap className="h-3.5 w-3.5" /></Button>}
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setEditingTask(task.id); setEditTaskTitle(task.title); setEditTaskReward(String(task.reward)); setEditTaskStatus(task.status); }}><Edit className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => deleteTask(task.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ===== CATEGORIES ===== */}
          {activeTab === "categories" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Категории заданий</h1>
              <p className="text-sm text-muted-foreground mb-6">{categories.length} категорий</p>

              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-4">Добавить категорию</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Название" />
                  <Input value={newCategoryDesc} onChange={e => setNewCategoryDesc(e.target.value)} placeholder="Описание" />
                  <Input value={newCategoryIcon} onChange={e => setNewCategoryIcon(e.target.value)} placeholder="Иконка (например Building2)" />
                </div>
                <Button className="gradient-accent text-accent-foreground border-0" onClick={createCategory}><Plus className="h-4 w-4 mr-2" /> Добавить</Button>
              </div>

              <div className="space-y-3">
                {categories.map(c => (
                  <div key={c.id} className="glass rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-sm text-muted-foreground">{c.description}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteCategory(c.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== FINANCE ===== */}
          {activeTab === "finance" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Финансы</h1>
              <p className="text-sm text-muted-foreground mb-6">Транзакции и выплаты</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={DollarSign} label="Всего выплачено" value={`${stats.totalPaid.toLocaleString("ru-RU")} ₽`} positive />
                <StatCard icon={Clock} label="Ожидают" value={`${pendingPayments.reduce((s, t) => s + Number(t.amount), 0).toLocaleString("ru-RU")} ₽`} />
                <StatCard icon={ArrowUpRight} label="Выводы" value={String(transactions.filter(t => t.type === "withdrawal").length)} />
                <StatCard icon={ArrowDownRight} label="Начисления" value={String(transactions.filter(t => t.type !== "withdrawal").length)} />
              </div>

              <div className="glass rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-border"><h3 className="font-semibold">Транзакции</h3></div>
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
                      {transactions.map(t => (
                        <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-medium">{t.profiles?.full_name || t.profiles?.email || "—"}</td>
                          <td className="p-4">{t.type === "withdrawal" ? "Вывод" : t.type === "reward" ? "Награда" : "Реф. бонус"}</td>
                          <td className="p-4 font-semibold">{Number(t.amount).toLocaleString("ru-RU")} ₽</td>
                          <td className="p-4 text-muted-foreground">{new Date(t.created_at).toLocaleDateString("ru-RU")}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              t.status === "approved" || t.status === "completed" ? "bg-accent/10 text-accent" :
                              t.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-destructive/10 text-destructive"}`}>
                              {t.status === "approved" || t.status === "completed" ? "Подтверждено" : t.status === "pending" ? "Ожидает" : "Отклонено"}
                            </span>
                          </td>
                          <td className="p-4">
                            {t.status === "pending" && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="h-7 text-xs text-accent" onClick={() => approvePayment(t.id)}>Подтвердить</Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs text-destructive" onClick={() => rejectPayment(t.id)}>Отклонить</Button>
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

          {/* ===== REPORTS ===== */}
          {activeTab === "reports" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Проверка отчётов</h1>
              <p className="text-sm text-muted-foreground mb-6">{pendingReports.length} на проверке</p>
              <div className="space-y-3">
                {reports.map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <div className="glass rounded-xl p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{r.profiles?.full_name || "—"}</span>
                            <span className="text-muted-foreground">→</span>
                            <span className="text-sm">{r.user_tasks?.tasks?.title || "—"}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>Формат: {r.format}</span>
                            <span>{new Date(r.submitted_at).toLocaleString("ru-RU")}</span>
                          </div>
                          {r.content && <div className="mt-2 text-sm p-3 rounded-lg bg-muted/50">{r.content}</div>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-4">
                          {r.status === "pending" ? (
                            <>
                              <Button size="sm" className="gradient-accent text-accent-foreground border-0" onClick={() => approveReport(r.id)}>
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Одобрить
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => rejectReport(r.id)}>
                                <XCircle className="h-3.5 w-3.5 mr-1" /> Отклонить
                              </Button>
                            </>
                          ) : (
                            <Badge className={r.status === "approved" ? "bg-accent/10 text-accent border-0" : "bg-destructive/10 text-destructive border-0"}>
                              {r.status === "approved" ? "Одобрен" : "Отклонён"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {reports.length === 0 && <div className="text-center py-12 text-muted-foreground">Нет отчётов</div>}
              </div>
            </div>
          )}

          {/* ===== REFERRALS ===== */}
          {activeTab === "referrals" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Реферальная система</h1>
              <p className="text-sm text-muted-foreground mb-6">{referrals.length} рефералов</p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <StatCard icon={Users} label="Всего рефералов" value={String(referrals.length)} positive />
                <StatCard icon={TrendingUp} label="Выплачено бонусов" value={`${referrals.reduce((s, r) => s + Number(r.bonus_amount), 0).toLocaleString("ru-RU")} ₽`} positive />
                <StatCard icon={BarChart3} label="Уникальных рефереров" value={String(new Set(referrals.map(r => r.referrer_id)).size)} />
              </div>
              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-4">Настройка процентов</h3>
                <div className="grid grid-cols-3 gap-6">
                  {["referral_level_1_percent", "referral_level_2_percent", "referral_level_3_percent"].map((key, i) => {
                    const setting = platformSettings.find(s => s.key === key);
                    return (
                      <div key={key} className="text-center p-4 rounded-xl border border-border">
                        <Input type="number" value={setting?.value || ""} onChange={e => updateSetting(key, e.target.value)}
                          className="text-2xl font-bold text-accent text-center border-0 bg-transparent p-0 h-auto" />
                        <div className="text-sm text-muted-foreground mt-1">{i + 1}-й уровень (%)</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Последние рефералы</h3>
                <div className="space-y-3">
                  {referrals.slice(0, 20).map(r => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50">
                      <div>
                        <div className="text-sm font-medium">{r.referrer?.full_name || "—"} → {r.referred?.full_name || "—"}</div>
                        <div className="text-xs text-muted-foreground">Уровень {r.level} · {new Date(r.created_at).toLocaleDateString("ru-RU")}</div>
                      </div>
                      <span className="font-semibold text-sm">{Number(r.bonus_amount).toLocaleString("ru-RU")} ₽</span>
                    </div>
                  ))}
                  {referrals.length === 0 && <p className="text-sm text-muted-foreground">Нет рефералов</p>}
                </div>
              </div>
            </div>
          )}

          {/* ===== NOTIFICATIONS ===== */}
          {activeTab === "notifications" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Уведомления</h1>
              <p className="text-sm text-muted-foreground mb-6">Отправка уведомлений пользователям</p>

              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-4">Отправить уведомление</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-xs">Пользователь</Label>
                    <Select value={notifUserId} onValueChange={setNotifUserId}>
                      <SelectTrigger><SelectValue placeholder="Выберите пользователя" /></SelectTrigger>
                      <SelectContent>{users.map(u => <SelectItem key={u.user_id} value={u.user_id}>{u.full_name || u.email}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Тип</Label>
                    <Select value={notifType} onValueChange={setNotifType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Информация</SelectItem>
                        <SelectItem value="success">Успех</SelectItem>
                        <SelectItem value="warning">Предупреждение</SelectItem>
                        <SelectItem value="bonus">Бонус</SelectItem>
                        <SelectItem value="system">Системное</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4 mb-4">
                  <Input value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder="Заголовок" />
                  <Textarea value={notifMessage} onChange={e => setNotifMessage(e.target.value)} placeholder="Сообщение" rows={3} />
                </div>
                <div className="flex gap-3">
                  <Button className="gradient-accent text-accent-foreground border-0" onClick={sendNotification}><Send className="h-4 w-4 mr-2" /> Отправить</Button>
                  <Button variant="outline" onClick={sendBroadcast}><Megaphone className="h-4 w-4 mr-2" /> Рассылка всем</Button>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Последние уведомления</h3>
                <div className="space-y-2">
                  {allNotifications.slice(0, 20).map(n => (
                    <div key={n.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50">
                      <div>
                        <div className="text-sm"><span className="font-medium">{n.profiles?.full_name || "—"}</span> — {n.title}</div>
                        <div className="text-xs text-muted-foreground">{n.type} · {new Date(n.created_at).toLocaleString("ru-RU")}</div>
                      </div>
                      <Badge variant={n.is_read ? "outline" : "default"} className="text-xs">{n.is_read ? "Прочитано" : "Не прочитано"}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== CONTENT ===== */}
          {activeTab === "content" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Управление контентом</h1>
              <p className="text-sm text-muted-foreground mb-6">Страницы, баннеры, новости</p>
              <div className="grid lg:grid-cols-3 gap-6">
                {[
                  { title: "Баннеры", desc: `${banners.length} баннеров`, icon: Layers, tab: "banners" },
                  { title: "Новости", desc: `${news.length} новостей`, icon: Globe, tab: "news" },
                  { title: "Уведомления", desc: "Рассылка", icon: Bell, tab: "notifications" },
                ].map((c, i) => (
                  <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className="glass rounded-2xl p-6 hover-lift cursor-pointer" onClick={() => setActiveTab(c.tab)}>
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4"><c.icon className="h-6 w-6 text-accent" /></div>
                      <h3 className="font-semibold mb-1">{c.title}</h3>
                      <p className="text-sm text-muted-foreground">{c.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ===== BANNERS ===== */}
          {activeTab === "banners" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Баннеры</h1>
              <p className="text-sm text-muted-foreground mb-6">{banners.length} баннеров</p>
              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-4">Добавить баннер</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Input value={newBannerTitle} onChange={e => setNewBannerTitle(e.target.value)} placeholder="Заголовок" />
                  <Input value={newBannerDesc} onChange={e => setNewBannerDesc(e.target.value)} placeholder="Описание" />
                  <Input value={newBannerLink} onChange={e => setNewBannerLink(e.target.value)} placeholder="Ссылка" />
                </div>
                <Button className="gradient-accent text-accent-foreground border-0" onClick={createBanner}><Plus className="h-4 w-4 mr-2" /> Добавить</Button>
              </div>
              <div className="space-y-3">
                {banners.map(b => (
                  <div key={b.id} className="glass rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{b.title}</div>
                      <div className="text-sm text-muted-foreground">{b.description}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={b.is_active} onCheckedChange={v => toggleBanner(b.id, v)} />
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteBanner(b.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== NEWS ===== */}
          {activeTab === "news" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Новости</h1>
              <p className="text-sm text-muted-foreground mb-6">{news.length} новостей</p>
              <div className="glass rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-4">Добавить новость</h3>
                <div className="space-y-4 mb-4">
                  <Input value={newNewsTitle} onChange={e => setNewNewsTitle(e.target.value)} placeholder="Заголовок" />
                  <Textarea value={newNewsContent} onChange={e => setNewNewsContent(e.target.value)} placeholder="Содержание" rows={4} />
                </div>
                <Button className="gradient-accent text-accent-foreground border-0" onClick={createNews}><Plus className="h-4 w-4 mr-2" /> Добавить</Button>
              </div>
              <div className="space-y-3">
                {news.map(n => (
                  <div key={n.id} className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{n.title}</div>
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant={n.is_published ? "default" : "outline"} onClick={() => publishNews(n.id, !n.is_published)}>
                          {n.is_published ? "Опубликовано" : "Опубликовать"}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteNews(n.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== SETTINGS ===== */}
          {activeTab === "settings" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Системные настройки</h1>
              <p className="text-sm text-muted-foreground mb-6">Конфигурация платформы</p>
              <div className="glass rounded-2xl p-6">
                <div className="space-y-4">
                  {platformSettings.map(s => (
                    <div key={s.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                      <div>
                        <div className="text-sm font-medium">{s.description || s.key}</div>
                        <div className="text-xs text-muted-foreground">{s.key}</div>
                      </div>
                      {s.value === "true" || s.value === "false" ? (
                        <Switch checked={s.value === "true"} onCheckedChange={v => updateSetting(s.key, String(v))} />
                      ) : (
                        <Input value={s.value} onChange={e => updateSetting(s.key, e.target.value)} className="w-32 text-right" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== REQUISITES ===== */}
          {activeTab === "requisites" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Реквизиты пользователей</h1>
              <p className="text-sm text-muted-foreground mb-6">Просмотр настроенных реквизитов</p>
              <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium text-muted-foreground">Пользователь</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Метод</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Реквизиты</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allRequisites.map((r: any) => (
                        <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-medium">{r.profiles?.full_name || r.profiles?.email || "—"}</td>
                          <td className="p-4">
                            <Badge variant="outline" className="text-xs">
                              {r.method === "card" ? "Карта" : r.method === "sbp" ? "СБП" : r.method === "crypto" ? "Crypto" : "LOLZTEAM"}
                            </Badge>
                          </td>
                          <td className="p-4 font-mono text-xs">{r.details}</td>
                          <td className="p-4 text-muted-foreground">{new Date(r.created_at).toLocaleDateString("ru-RU")}</td>
                        </tr>
                      ))}
                      {allRequisites.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Нет реквизитов</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {activeTab === "security" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Безопасность</h1>
              <p className="text-sm text-muted-foreground mb-6">Защита и мониторинг</p>
              <div className="grid lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="h-4 w-4" /> Настройки безопасности</h3>
                  <div className="space-y-4">
                    {platformSettings.filter(s => ["two_factor_required", "antifraud_enabled", "ip_logging"].includes(s.key)).map(s => (
                      <div key={s.key} className="flex items-center justify-between py-1">
                        <span className="text-sm">{s.description}</span>
                        <Switch checked={s.value === "true"} onCheckedChange={v => updateSetting(s.key, String(v))} />
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2"><Lock className="h-4 w-4" /> Статистика безопасности</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-sm">Заблокированных пользователей</span><span className="font-semibold">{users.filter(u => u.is_blocked).length}</span></div>
                    <div className="flex justify-between"><span className="text-sm">Верифицированных</span><span className="font-semibold">{users.filter(u => u.is_verified).length}</span></div>
                    <div className="flex justify-between"><span className="text-sm">Событий безопасности</span><span className="font-semibold">{securityLogs.length}</span></div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* ===== LOGS ===== */}
          {activeTab === "logs" && (
            <div>
              <h1 className="text-2xl font-bold mb-1">Лог безопасности</h1>
              <p className="text-sm text-muted-foreground mb-6">Последние {securityLogs.length} событий</p>
              <div className="glass rounded-2xl p-6">
                <div className="space-y-3">
                  {securityLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="text-sm font-medium">{log.event}</div>
                        <div className="text-xs text-muted-foreground">
                          {log.ip_address && `IP: ${log.ip_address} · `}{log.details}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString("ru-RU")}</div>
                    </div>
                  ))}
                  {securityLogs.length === 0 && <p className="text-sm text-muted-foreground">Нет событий</p>}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Admin;
