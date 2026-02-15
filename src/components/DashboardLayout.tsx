import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, Plus, Archive, Send, CreditCard,
  BarChart3, Users, Bell, Settings, ShieldCheck, HelpCircle, LogOut, Shield, Menu, X,
  ChevronDown, Search, Command
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import AtlanticLogo from "@/components/AtlanticLogo";

const navItems = [
  { label: "Дашборд", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Задания", icon: ClipboardList, path: "/dashboard/tasks" },
  { label: "Новые", icon: Plus, path: "/dashboard/new-tasks" },
  { label: "Архив", icon: Archive, path: "/dashboard/archive" },
  { label: "Отчёт", icon: Send, path: "/dashboard/report" },
  { label: "Выплаты", icon: CreditCard, path: "/dashboard/payments" },
  { label: "Статистика", icon: BarChart3, path: "/dashboard/stats" },
  { label: "Рефералы", icon: Users, path: "/dashboard/referrals" },
  { label: "Уведомления", icon: Bell, path: "/dashboard/notifications" },
  { label: "Настройки", icon: Settings, path: "/dashboard/settings" },
  { label: "Верификация", icon: ShieldCheck, path: "/dashboard/verification" },
  { label: "Поддержка", icon: HelpCircle, path: "/dashboard/support" },
];

// Main visible tabs in top bar
const mainTabs = [
  { label: "Дашборд", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Задания", icon: ClipboardList, path: "/dashboard/tasks" },
  { label: "Выплаты", icon: CreditCard, path: "/dashboard/payments" },
  { label: "Статистика", icon: BarChart3, path: "/dashboard/stats" },
  { label: "Рефералы", icon: Users, path: "/dashboard/referrals" },
];

// Mobile bottom tabs
const mobileTabs = [
  { label: "Главная", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Задания", icon: ClipboardList, path: "/dashboard/tasks" },
  { label: "Выплаты", icon: CreditCard, path: "/dashboard/payments" },
  { label: "Статистика", icon: BarChart3, path: "/dashboard/stats" },
  { label: "Ещё", icon: Menu, path: "__more__" },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const { signOut, isAdmin, profile } = useAuth();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (path: string) => pathname === path;
  const isTabActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ===== DESKTOP TOP NAV ===== */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <AtlanticLogo size="sm" />
          </Link>

          {/* Center nav tabs */}
          <nav className="flex items-center gap-1 bg-muted/50 rounded-2xl p-1">
            {mainTabs.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                  isTabActive(item.path)
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            ))}

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={cn(
                  "flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                  moreOpen ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="hidden lg:inline">Ещё</span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", moreOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-elevated p-2 z-50"
                    >
                      {navItems.filter(item => !mainTabs.some(t => t.path === item.path)).map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMoreOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                            isActive(item.path)
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-foreground/70 hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                      {isAdmin && (
                        <>
                          <div className="h-px bg-border my-1" />
                          <Link
                            to="/admin"
                            onClick={() => setMoreOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-primary/80 hover:bg-primary/10 hover:text-primary transition-all"
                          >
                            <Shield className="h-4 w-4" />
                            Админ-панель
                          </Link>
                        </>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/dashboard/notifications"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
            </Link>
            
            <div className="h-6 w-px bg-border" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {(profile?.full_name || profile?.email || "U")[0].toUpperCase()}
              </div>
              <div className="hidden lg:block">
                <div className="text-sm font-medium leading-none">{profile?.full_name?.split(" ")[0] || "Пользователь"}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{profile?.level || "Новичок"}</div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Выйти"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== MOBILE TOP BAR ===== */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 z-50 glass-strong border-b border-border flex items-center justify-between px-4">
        <Link to="/dashboard">
          <AtlanticLogo size="sm" />
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/dashboard/notifications" className="w-9 h-9 rounded-xl flex items-center justify-center">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </Link>
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
            {(profile?.full_name || "U")[0].toUpperCase()}
          </div>
        </div>
      </header>

      {/* ===== MOBILE BOTTOM TAB BAR ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileTabs.map((item) => {
            if (item.path === "__more__") {
              return (
                <button
                  key="more"
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex flex-col items-center gap-1 py-1 px-3"
                >
                  <Menu className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Ещё</span>
                </button>
              );
            }
            const active = isTabActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 py-1 px-3"
              >
                <item.icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-[10px]", active ? "text-primary font-medium" : "text-muted-foreground")}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ===== MOBILE FULL MENU ===== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl border-t border-border max-h-[75vh] overflow-y-auto"
            >
              <div className="p-2 pt-3 flex justify-center">
                <div className="w-10 h-1 rounded-full bg-muted" />
              </div>
              <div className="p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all",
                      isActive(item.path)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground/70 hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-primary/80 hover:bg-primary/10"
                  >
                    <Shield className="h-4 w-4" />
                    Админ-панель
                  </Link>
                )}
                <div className="h-px bg-border my-2" />
                <button
                  onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-destructive hover:bg-destructive/10 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Выйти
                </button>
              </div>
              <div className="h-8" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== MAIN CONTENT ===== */}
      <main className="pt-14 md:pt-16 pb-20 md:pb-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
