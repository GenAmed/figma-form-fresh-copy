import React, { useState, useEffect } from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Header } from "@/components/navigation/Header";
import { User } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AlertTriangle, CalendarDays, Timer, WifiOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ReportIssueDialog } from "@/components/reports/ReportIssueDialog";

interface HomeWorkerProps {
  user: User;
}

export const HomeWorker: React.FC<HomeWorkerProps> = ({ user }) => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState<boolean>(true);

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

  const handleClockButton = () => {
    navigate("/pointage");
  };

  const handleViewSchedule = () => {
    navigate("/calendrier");
  };

  return (
    <div className="h-full text-base-content">
      {/* Header */}
      <Header username={user.name} role={user.role} avatarUrl={user.avatarUrl} />

      {/* Main Content */}
      <div id="main-content" className="min-h-screen bg-[#F8F8F8] pt-20 pb-20">
        {!isConnected && (
          <div className="mx-4 bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-amber-800 flex items-center">
            <WifiOff className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="text-sm">
              Mode hors ligne activé. Certaines fonctionnalités peuvent être limitées.
            </p>
          </div>
        )}
        
        {/* Status Card */}
        <div id="status-card" className="mx-4 bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-[#333333] text-lg font-bold mb-2">Statut de pointage</h2>
          <div id="status-message" className="text-[#666666] mb-4">
            Accédez à la page de pointage pour commencer votre journée
          </div>
          <button 
            id="clock-button" 
            className="w-full bg-[#BD1E28] text-white py-3 rounded-md hover:bg-[#a01820] transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            onClick={handleClockButton}
          >
            <Timer className="h-5 w-5" />
            Pointer maintenant
          </button>
        </div>

        {/* Recent Activity */}
        <div id="recent-activity" className="mx-4 bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-[#333333] text-lg font-bold mb-3">Activité récente</h2>
          <div className="space-y-3">
            <div id="activity-1" className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <p className="text-[#333333] font-medium">Chantier A</p>
                <p className="text-sm text-[#666666]">Sortie: 17:30</p>
              </div>
              <span className="text-[#666666]">Aujourd'hui</span>
            </div>
            <div id="activity-2" className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <p className="text-[#333333] font-medium">Chantier A</p>
                <p className="text-sm text-[#666666]">Entrée: 08:00</p>
              </div>
              <span className="text-[#666666]">Aujourd'hui</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div id="quick-actions" className="mx-4 bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-[#333333] text-lg font-bold mb-3">Actions rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            <ReportIssueDialog>
              <button 
                id="report-issue" 
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors w-full"
              >
                <AlertTriangle className="text-[#BD1E28] h-5 w-5 mb-2" />
                <span className="text-sm text-[#333333]">Signaler un problème</span>
              </button>
            </ReportIssueDialog>
            <button 
              id="view-schedule" 
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              onClick={handleViewSchedule}
            >
              <CalendarDays className="text-[#BD1E28] h-5 w-5 mb-2" />
              <span className="text-sm text-[#333333]">Voir planning</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />
    </div>
  );
};
