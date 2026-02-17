import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/api";
import BlockedUserScreen from "@/components/BlockedUserScreen";
import MaintenanceScreen from "@/components/MaintenanceScreen";

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { user, loading, isAdmin, profile } = useAuth();
  const [maintenanceMode, setMaintenanceMode] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMaintenance = async () => {
      const { data } = await db.getSetting("maintenance_mode");
      setMaintenanceMode((data as any)?.value === "true");
    };
    checkMaintenance();
  }, []);

  if (loading || maintenanceMode === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (profile?.is_blocked) return <BlockedUserScreen />;
  if (maintenanceMode && !isAdmin) return <MaintenanceScreen />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
