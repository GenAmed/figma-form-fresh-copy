
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Building, ChevronRight, Clock, Users, FileText, AlertTriangle, Check, WifiOff, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { scheduleUnassignedWorkersCheck, checkAndNotifyUnassignedWorkers } from "@/services/assignment/assignmentCheckService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageNotifications } from "@/components/admin/MessageNotifications";
import { useHomeStats } from "@/hooks/useHomeStats";
import { useRecentAlerts } from "@/hooks/useRecentAlerts";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { useSupabaseProfile } from "@/hooks/useSupabaseProfile";

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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "danger":
        return "text-red-500";
      case "warning":
        return "text-amber-500";
      case "info":
      default:
        return "text-blue-500";
    }
  };

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case "danger":
        return "bg-red-50";
      case "warning":
        return "bg-amber-50";
      case "info":
      default:
        return "bg-blue-50";
    }
  };

  const getActivityIcon = (action: string) => {
    return action === "entry" ? "text-green-600" : "text-red-600";
  };

  const getActivityBgColor = (action: string) => {
    return action === "entry" ? "bg-green-100" : "bg-red-100";
  };

  const handleNavigation = (path: string) => {
    console.log("🧭 [HomeAdmin] Navigating to:", path);
    navigate(path);
  };

  return (
    <div className="h-full text-base-content">
      {/* Header */}
      <header className="bg-[#BD1E28] text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Bonjour, {profile.name}</h1>
            <p className="text-sm opacity-90">Rôle: Administrateur</p>
          </div>
          <div className="relative flex items-center">
            <span className="mr-2">
              {isConnected ? 
                <Check className="h-4 w-4 text-green-400" /> : 
                <WifiOff className="h-4 w-4 text-amber-400" />
              }
            </span>
            <button id="notifications-btn" className="p-2">
              <i className="fa-regular fa-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 min-h-screen bg-[#F8F8F8] pt-0 pb-20">
        {!isConnected && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-amber-800 flex items-center">
            <WifiOff className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="text-sm">
              Mode hors ligne activé. Certaines fonctionnalités peuvent être limitées.
            </p>
          </div>
        )}
        
        {/* Quick Stats */}
        <section id="quick-stats" className="grid grid-cols-2 gap-4 mb-6">
          <Card 
            className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleNavigation("/gestion/users")}
          >
            <p className="text-sm text-[#666666]">Employés Actifs</p>
            <p className="text-2xl font-bold text-[#333333]">
              {statsLoading ? "..." : stats.employesActifs}
            </p>
          </Card>
          <Card 
            className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleNavigation("/gestion")}
          >
            <p className="text-sm text-[#666666]">Chantiers Actifs</p>
            <p className="text-2xl font-bold text-[#333333]">
              {statsLoading ? "..." : stats.chantiersActifs}
            </p>
          </Card>
        </section>

        {/* Administration */}
        <section id="admin-actions" className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-bold text-[#333333] mb-4">Administration</h2>
          <div className="space-y-3">
            <button 
              onClick={() => handleNavigation("/gestion/users")}
              className="w-full flex items-center justify-between p-3 bg-[#F8F8F8] rounded-md text-[#333333] hover:bg-gray-100 transition-colors"
            >
              <span className="flex items-center">
                <Users className="w-5 h-5 mr-3" />
                Gérer les utilisateurs
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleNavigation("/gestion")}
              className="w-full flex items-center justify-between p-3 bg-[#F8F8F8] rounded-md text-[#333333] hover:bg-gray-100 transition-colors"
            >
              <span className="flex items-center">
                <Building className="w-5 h-5 mr-3" />
                Gérer les chantiers
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleNavigation("/rapports")}
              className="w-full flex items-center justify-between p-3 bg-[#F8F8F8] rounded-md text-[#333333] hover:bg-gray-100 transition-colors"
            >
              <span className="flex items-center">
                <FileText className="w-5 h-5 mr-3" />
                Rapports & Analyses
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleNavigation("/calendrier")}
              className="w-full flex items-center justify-between p-3 bg-[#F8F8F8] rounded-md text-[#333333] hover:bg-gray-100 transition-colors"
            >
              <span className="flex items-center">
                <Clock className="w-5 h-5 mr-3" />
                Calendrier & Assignations
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Recent Alerts */}
        <section id="recent-alerts" className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#333333]">Alertes Récentes</h2>
            <button 
              onClick={() => handleNavigation("/rapports?tab=alerts")} 
              className="text-xs text-[#BD1E28] hover:underline"
            >
              Voir tout
            </button>
          </div>
          {alertsLoading ? (
            <div className="space-y-3">
              <div className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-md"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-[#666666]">Aucune alerte récente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`flex items-start space-x-3 p-3 ${getAlertBgColor(alert.type)} rounded-md`}>
                  <AlertTriangle className={`w-5 h-5 ${getAlertIcon(alert.type)} mt-0.5`} />
                  <div>
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-[#666666]">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section id="recent-activity" className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-bold text-[#333333] mb-4">Activité Récente</h2>
          {activitiesLoading ? (
            <div className="space-y-4">
              <div className="animate-pulse flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div className="animate-pulse flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-[#666666]">Aucune activité récente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full ${getActivityBgColor(activity.action)} flex items-center justify-center`}>
                    <Clock className={`w-4 h-4 ${getActivityIcon(activity.action)}`} />
                  </div>
                  <div>
                    <p className="text-sm text-[#333333]">
                      {activity.user_name} - Pointage {activity.action === "entry" ? "entrée" : "sortie"}
                    </p>
                    <p className="text-xs text-[#666666]">Chantier: {activity.worksite_name}</p>
                    <p className="text-xs text-[#666666]">{activity.time_ago}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />
    </div>
  );
};
