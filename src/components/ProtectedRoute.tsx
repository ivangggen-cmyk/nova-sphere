import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import BlockedUserScreen from "@/components/BlockedUserScreen";

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { user, loading, isAdmin, profile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  
  // Block access for blocked users
  if (profile?.is_blocked) return <BlockedUserScreen />;
  
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
