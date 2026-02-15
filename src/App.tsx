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
          <Route path="/dashboard/archive" element={<Tasks />} />
          <Route path="/dashboard/report" element={<Dashboard />} />
          <Route path="/dashboard/stats" element={<Dashboard />} />
          <Route path="/dashboard/notifications" element={<Dashboard />} />
          <Route path="/dashboard/verification" element={<SettingsPage />} />
          <Route path="/dashboard/support" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
