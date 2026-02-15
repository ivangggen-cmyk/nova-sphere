import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
            <Route path="/dashboard/tasks/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
            <Route path="/dashboard/new-tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
            <Route path="/dashboard/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
            <Route path="/dashboard/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/dashboard/archive" element={<ProtectedRoute><Archive /></ProtectedRoute>} />
            <Route path="/dashboard/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/dashboard/stats" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
            <Route path="/dashboard/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/dashboard/verification" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
            <Route path="/dashboard/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
