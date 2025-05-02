
import React from "react";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Header } from "@/components/navigation/Header";
import { User } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

interface HomeWorkerProps {
  user: User;
}

export const HomeWorker: React.FC<HomeWorkerProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleClockButton = () => {
    navigate("/pointage");
  };

  return (
    <div className="h-full text-base-content">
      {/* Header */}
      <Header username={user.name} role={user.role} avatarUrl={user.avatarUrl} />

      {/* Main Content */}
      <div id="main-content" className="min-h-screen bg-[#F8F8F8] pt-20 pb-20">
        {/* Status Card */}
        <div id="status-card" className="mx-4 bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-[#333333] text-lg font-bold mb-2">Statut de pointage</h2>
          <div id="status-message" className="text-[#666666] mb-4">
            Accédez à la page de pointage pour commencer votre journée
          </div>
          <button 
            id="clock-button" 
            className="w-full bg-[#BD1E28] text-white py-3 rounded-md hover:bg-[#a01820] transition-colors duration-200 font-medium"
            onClick={handleClockButton}
          >
            <i className="fa-regular fa-clock mr-2"></i>
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
            <button id="report-issue" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md">
              <i className="fa-solid fa-triangle-exclamation text-[#BD1E28] text-xl mb-2"></i>
              <span className="text-sm text-[#333333]">Signaler un problème</span>
            </button>
            <button id="view-schedule" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md">
              <i className="fa-regular fa-calendar text-[#BD1E28] text-xl mb-2"></i>
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
