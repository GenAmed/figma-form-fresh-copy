
import React, { useState } from "react";
import { User } from "@/lib/auth";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings, Users, Building, FileText, BarChart3 } from "lucide-react";
import { clearCurrentUser } from "@/lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { supabase } from "@/integrations/supabase/client";
import { useHomeStats } from "@/hooks/useHomeStats";
import { useRecentAlerts } from "@/hooks/useRecentAlerts";

interface AdminProfileProps {
  user: User;
}

export const AdminProfile: React.FC<AdminProfileProps> = ({ user }) => {
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { stats } = useHomeStats();
  const { alerts } = useRecentAlerts();

  const handleLogout = async () => {
    try {
      // Déconnecter de Supabase si l'utilisateur est connecté via Supabase
      await supabase.auth.signOut();
      
      // Nettoyer le localStorage
      clearCurrentUser();
      
      toast.success("Déconnexion réussie", {
        description: "À bientôt !",
        duration: 2000,
      });
      
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] pb-16">
      {/* Header */}
      <header className="bg-[#BD1E28] text-white px-4 py-3 fixed w-full top-0 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Profil Administrateur</h1>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleSettings}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 px-4 mt-4">
        <div className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-[#BD1E28] flex items-center justify-center text-2xl font-bold text-white">
                  {user.name?.charAt(0) || "A"}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-gray-500">Administrateur</p>
                  <p className="text-xs text-gray-400">Accès complet au système</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p>{user.email || "Non défini"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Téléphone</label>
                  <p>{user.phone || "Non défini"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Dernière connexion</label>
                  <p>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : "Non disponible"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Statistics */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Vue d'ensemble</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-blue-600">Employés Actifs</p>
                  <p className="text-xl font-bold text-blue-800">{stats.employesActifs}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                  <Building className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-green-600">Chantiers Actifs</p>
                  <p className="text-xl font-bold text-green-800">{stats.chantiersActifs}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg text-center border border-amber-200">
                  <FileText className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                  <p className="text-sm text-amber-600">Alertes</p>
                  <p className="text-xl font-bold text-amber-800">{alerts.length}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
                  <BarChart3 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm text-purple-600">Rapports</p>
                  <p className="text-xl font-bold text-purple-800">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Actions rapides</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link 
                  to="/gestion/users" 
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center">
                    <Users className="w-5 h-5 mr-3" />
                    Gérer les utilisateurs
                  </span>
                </Link>
                <Link 
                  to="/gestion" 
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center">
                    <Building className="w-5 h-5 mr-3" />
                    Gérer les chantiers
                  </span>
                </Link>
                <Link 
                  to="/rapports" 
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center">
                    <FileText className="w-5 h-5 mr-3" />
                    Consulter les rapports
                  </span>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Settings Buttons */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleChangePassword}
            >
              Changer mon mot de passe
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              Se déconnecter
            </Button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paramètres du compte</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Informations administrateur</h3>
              <p className="text-sm text-gray-600">Nom: {user.name}</p>
              <p className="text-sm text-gray-600">Email: {user.email}</p>
              <p className="text-sm text-gray-600">Rôle: Administrateur</p>
              <p className="text-sm text-gray-600">Permissions: Accès complet</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Statistiques système</h3>
              <p className="text-sm text-gray-600">Employés gérés: {stats.employesActifs}</p>
              <p className="text-sm text-gray-600">Chantiers supervisés: {stats.chantiersActifs}</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleChangePassword}
                className="flex-1"
              >
                Changer le mot de passe
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="flex-1"
              >
                Fermer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <ChangePasswordDialog 
        open={showChangePassword}
        onOpenChange={setShowChangePassword}
      />
    </div>
  );
};
