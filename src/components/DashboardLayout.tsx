import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, Plus, Archive, Send, CreditCard,
  BarChart3, Users, Bell, Settings, ShieldCheck, HelpCircle, LogOut, ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Дашборд", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Мои задания", icon: ClipboardList, path: "/dashboard/tasks" },
  { label: "Новые задания", icon: Plus, path: "/dashboard/new-tasks" },
  { label: "Архив", icon: Archive, path: "/dashboard/archive" },
  { label: "Отправить отчёт", icon: Send, path: "/dashboard/report" },
  { label: "История выплат", icon: CreditCard, path: "/dashboard/payments" },
  { label: "Статистика", icon: BarChart3, path: "/dashboard/stats" },
  { label: "Рефералы", icon: Users, path: "/dashboard/referrals" },
  { label: "Уведомления", icon: Bell, path: "/dashboard/notifications" },
  { label: "Настройки", icon: Settings, path: "/dashboard/settings" },
  { label: "Верификация", icon: ShieldCheck, path: "/dashboard/verification" },
  { label: "Поддержка", icon: HelpCircle, path: "/dashboard/support" },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold">
            <ChevronLeft className="h-4 w-4 text-sidebar-foreground/50" />
            <span className="text-accent">Work</span><span className="text-sidebar-foreground">Flow</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                  active
                    ? "bg-sidebar-accent text-accent font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 glass z-40 flex items-center px-4 gap-3">
        <Link to="/" className="font-bold text-lg">
          <span className="gradient-text">Work</span>Flow
        </Link>
      </div>

      {/* Main */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
