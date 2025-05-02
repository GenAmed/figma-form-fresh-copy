
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { Building, ChevronRight, Clock, Users, FileText, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface HomeAdminProps {
  user: User;
}

export const HomeAdmin: React.FC<HomeAdminProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="h-full text-base-content">
      {/* Header */}
      <header className="bg-[#BD1E28] text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Bonjour, {user.name}</h1>
            <p className="text-sm opacity-90">Rôle: Administrateur</p>
          </div>
          <div className="relative">
            <button id="notifications-btn" className="p-2">
              <i className="fa-regular fa-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 min-h-screen bg-[#F8F8F8] pt-0 pb-20">
        {/* Quick Stats */}
        <section id="quick-stats" className="grid grid-cols-2 gap-4 mb-6">
          <Card 
            className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigate("/gestion/users")}
          >
            <p className="text-sm text-[#666666]">Employés Actifs</p>
            <p className="text-2xl font-bold text-[#333333]">24</p>
          </Card>
          <Card 
            className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigate("/gestion")}
          >
            <p className="text-sm text-[#666666]">Chantiers Actifs</p>
            <p className="text-2xl font-bold text-[#333333]">8</p>
          </Card>
        </section>

        {/* Admin Actions */}
        <section id="admin-actions" className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-bold text-[#333333] mb-4">Administration</h2>
          <div className="space-y-3">
            <Link to="/gestion/users" className="w-full flex items-center justify-between p-3 bg-[#F8F8F8] rounded-md text-[#333333]">
              <span className="flex items-center">
                <Users className="w-5 h-5 mr-3" />
                Gérer les utilisateurs
              </span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/gestion" className="w-full flex items-center justify-between p-3 bg-[#F8F8F8] rounded-md text-[#333333]">
              <span className="flex items-center">
                <Building className="w-5 h-5 mr-3" />
                Gérer les chantiers
              </span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/rapports" className="w-full flex items-center justify-between p-3 bg-[#F8F8F8] rounded-md text-[#333333]">
              <span className="flex items-center">
                <FileText className="w-5 h-5 mr-3" />
                Rapports & Analyses
              </span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Recent Alerts */}
        <section id="recent-alerts" className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#333333]">Alertes Récentes</h2>
            <Link to="/rapports?tab=alerts" className="text-xs text-[#BD1E28]">Voir tout</Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-md">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Heures supplémentaires excessives</p>
                <p className="text-xs text-[#666666]">Jean Dupont - +4h au delà du seuil</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-md">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Absence non justifiée</p>
                <p className="text-xs text-[#666666]">Marie Martin - Chantier Bordeaux</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section id="recent-activity" className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-bold text-[#333333] mb-4">Activité Récente</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-[#333333]">Jean Dupont - Pointage entrée</p>
                <p className="text-xs text-[#666666]">Chantier: Tour Eiffel</p>
                <p className="text-xs text-[#666666]">Il y a 5 minutes</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-[#333333]">Marie Martin - Pointage sortie</p>
                <p className="text-xs text-[#666666]">Chantier: Arc de Triomphe</p>
                <p className="text-xs text-[#666666]">Il y a 12 minutes</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />
    </div>
  );
};
