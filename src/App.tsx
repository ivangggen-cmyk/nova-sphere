import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import Referrals from "./pages/Referrals";
import Payments from "./pages/Payments";
import SettingsPage from "./pages/Settings";
import Report from "./pages/Report";
import Archive from "./pages/Archive";
import Notifications from "./pages/Notifications";
import Statistics from "./pages/Statistics";
import Verification from "./pages/Verification";
import Support from "./pages/Support";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/tasks" element={<Tasks />} />
          <Route path="/dashboard/tasks/:id" element={<TaskDetail />} />
          <Route path="/dashboard/new-tasks" element={<Tasks />} />
          <Route path="/dashboard/referrals" element={<Referrals />} />
          <Route path="/dashboard/payments" element={<Payments />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/archive" element={<Archive />} />
          <Route path="/dashboard/report" element={<Report />} />
          <Route path="/dashboard/stats" element={<Statistics />} />
          <Route path="/dashboard/notifications" element={<Notifications />} />
          <Route path="/dashboard/verification" element={<Verification />} />
          <Route path="/dashboard/support" element={<Support />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
