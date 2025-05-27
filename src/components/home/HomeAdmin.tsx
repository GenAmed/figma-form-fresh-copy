
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { scheduleUnassignedWorkersCheck } from "@/services/assignment/assignmentCheckService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useHomeStats } from "@/hooks/useHomeStats";
import { useRecentAlerts } from "@/hooks/useRecentAlerts";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { useSupabaseProfile } from "@/hooks/useSupabaseProfile";
import { AdminHeader } from "./admin/AdminHeader";
import { QuickStats } from "./admin/QuickStats";
import { AdminActions } from "./admin/AdminActions";
import { RecentAlerts } from "./admin/RecentAlerts";
import { RecentActivity } from "./admin/RecentActivity";
import { ConnectionStatus } from "./admin/ConnectionStatus";

export const HomeAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [hasCheckedUnassigned, setHasCheckedUnassigned] = useState<boolean>(false);
  
  // Always call hooks at the top level
  const { stats, loading: statsLoading } = useHomeStats();
  const { alerts, loading: alertsLoading } = useRecentAlerts();
  const { activities, loading: activitiesLoading } = useRecentActivity();
  const { profile, user } = useSupabaseProfile();

  // Vérifier la connexion à Supabase
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('worksites').select('count', { count: 'exact', head: true });
        if (error) {
          console.error("Erreur de connexion à Supabase:", error);
          setIsConnected(false);
          toast.error("Problème de connexion au serveur");
        } else {
          setIsConnected(true);
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la connexion:", err);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  // Set up the automatic check for unassigned workers - only once
  useEffect(() => {
    if (!hasCheckedUnassigned && profile?.role === "admin") {
      console.log("🔍 [HomeAdmin] Setting up unassigned workers check");
      // Schedule the regular checks
      scheduleUnassignedWorkersCheck();
      setHasCheckedUnassigned(true);
    }
  }, [profile, hasCheckedUnassigned]);

  // Early returns AFTER all hooks have been called
  if (!profile || !user) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#BD1E28] border-e-transparent mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  const handleNavigation = (path: string) => {
    console.log("🧭 [HomeAdmin] Navigating to:", path);
    navigate(path);
  };

  return (
    <div className="h-full text-base-content">
      <AdminHeader profileName={profile.name} isConnected={isConnected} />

      {/* Main Content */}
      <main className="flex-1 p-4 min-h-screen bg-[#F8F8F8] pt-0 pb-20">
        <ConnectionStatus isConnected={isConnected} />
        
        <QuickStats 
          stats={stats}
          loading={statsLoading}
          onEmployeesClick={() => handleNavigation("/gestion/users")}
          onWorksitesClick={() => handleNavigation("/gestion")}
        />

        <AdminActions 
          onUsersClick={() => handleNavigation("/gestion/users")}
          onWorksitesClick={() => handleNavigation("/gestion")}
          onReportsClick={() => handleNavigation("/rapports")}
          onCalendarClick={() => handleNavigation("/calendrier")}
        />

        <RecentAlerts 
          alerts={alerts}
          loading={alertsLoading}
          onViewAllClick={() => handleNavigation("/rapports?tab=alerts")}
        />

        <RecentActivity 
          activities={activities}
          loading={activitiesLoading}
        />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />
    </div>
  );
};
