import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, Plus, Archive, Send, CreditCard,
  BarChart3, Users, Bell, Settings, ShieldCheck, HelpCircle, LogOut, Shield, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import AtlanticLogo from "@/components/AtlanticLogo";

const navItems = [
  { label: "Дашборд", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Мои задания", icon: ClipboardList, path: "/dashboard/tasks" },
  { label: "Новые задания", icon: Plus, path: "/dashboard/new-tasks" },
  { label: "Архив", icon: Archive, path: "/dashboard/archive" },
  { label: "Отправить отчёт", icon: Send, path: "/dashboard/report" },
  { label: "Выплаты", icon: CreditCard, path: "/dashboard/payments" },
  { label: "Статистика", icon: BarChart3, path: "/dashboard/stats" },
  { label: "Рефералы", icon: Users, path: "/dashboard/referrals" },
  { label: "Уведомления", icon: Bell, path: "/dashboard/notifications" },
  { label: "Настройки", icon: Settings, path: "/dashboard/settings" },
  { label: "Верификация", icon: ShieldCheck, path: "/dashboard/verification" },
  { label: "Поддержка", icon: HelpCircle, path: "/dashboard/support" },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const { signOut, isAdmin, profile } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <AtlanticLogo size="sm" dark />
        </Link>
      </div>

      {profile && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-accent-foreground text-sm font-bold shadow-glow">
              {(profile.full_name || profile.email || "U")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate text-sidebar-foreground">{profile.full_name || "Пользователь"}</div>
              <div className="text-xs text-sidebar-foreground/40 truncate">{profile.level || "Новичок"}</div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300",
                active
                  ? "bg-gradient-to-r from-primary/15 to-accent/10 text-primary font-medium shadow-sm"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
              {item.label}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 mt-3",
              pathname === "/admin"
                ? "bg-primary/15 text-primary font-medium"
                : "text-primary/50 hover:bg-primary/10 hover:text-primary"
            )}
          >
            <Shield className="h-4 w-4 shrink-0" />
            Админ-панель
          </Link>
        )}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-300 w-full"
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[260px] flex-col bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-40 border-r border-sidebar-border">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 glass-strong z-40 flex items-center justify-between px-4">
        <Link to="/">
          <AtlanticLogo size="sm" />
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-foreground/50 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-[260px] flex flex-col bg-sidebar text-sidebar-foreground z-50 shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-[260px] pt-14 lg:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
