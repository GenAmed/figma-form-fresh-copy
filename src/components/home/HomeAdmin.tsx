
import React from "react";
import { Header } from "@/components/navigation/Header";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";

interface HomeAdminProps {
  user: User;
}

export const HomeAdmin: React.FC<HomeAdminProps> = ({ user }) => {
  return (
    <div className="h-full text-base-content">
      {/* Header */}
      <Header username={user.name} role={user.role} avatarUrl={user.avatarUrl} />

      {/* Main Content */}
      <div id="main-content" className="min-h-screen bg-[#F8F8F8] pt-20 pb-20">
        {/* Dashboard Summary */}
        <div id="dashboard-summary" className="mx-4 bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-[#333333] text-lg font-bold mb-3">Tableau de bord</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Employés actifs</p>
              <p className="text-2xl font-bold text-[#333333]">14</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Chantiers en cours</p>
              <p className="text-2xl font-bold text-[#333333]">5</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Heures cette semaine</p>
              <p className="text-2xl font-bold text-[#333333]">432</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Problèmes signalés</p>
              <p className="text-2xl font-bold text-[#333333]">2</p>
            </div>
          </div>
        </div>

        {/* Active Sites */}
        <div id="active-sites" className="mx-4 bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-[#333333] text-lg font-bold mb-3">Chantiers actifs</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <p className="text-[#333333] font-medium">Chantier A - Paris</p>
                <p className="text-sm text-[#666666]">8 employés</p>
              </div>
              <button className="text-[#BD1E28]">
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <p className="text-[#333333] font-medium">Chantier B - Lyon</p>
                <p className="text-sm text-[#666666]">6 employés</p>
              </div>
              <button className="text-[#BD1E28]">
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div id="quick-actions" className="mx-4 bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-[#333333] text-lg font-bold mb-3">Actions rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            <button id="add-employee" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md">
              <i className="fa-solid fa-user-plus text-[#BD1E28] text-xl mb-2"></i>
              <span className="text-sm text-[#333333]">Nouvel employé</span>
            </button>
            <button id="add-site" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md">
              <i className="fa-solid fa-building text-[#BD1E28] text-xl mb-2"></i>
              <span className="text-sm text-[#333333]">Nouveau chantier</span>
            </button>
            <button id="export-data" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md">
              <i className="fa-solid fa-file-export text-[#BD1E28] text-xl mb-2"></i>
              <span className="text-sm text-[#333333]">Exporter données</span>
            </button>
            <button id="view-reports" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md">
              <i className="fa-solid fa-chart-simple text-[#BD1E28] text-xl mb-2"></i>
              <span className="text-sm text-[#333333]">Voir rapports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />
    </div>
  );
};
