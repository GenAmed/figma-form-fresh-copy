
import React, { useState } from "react";
import { User } from "@/lib/auth";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { clearCurrentUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { supabase } from "@/integrations/supabase/client";
import { useHomeStats } from "@/hooks/useHomeStats";

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { stats } = useHomeStats();

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
      <header className="bg-white shadow-sm px-4 py-3 fixed w-full top-0 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Mon Profil</h1>
          <Button variant="ghost" size="sm" onClick={handleSettings}>
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
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
                  {user.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.role === "admin" ? "Administrateur" : "Ouvrier"}</p>
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
                  <p>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : "Non disponible"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Statistics */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Statistiques de travail</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Employés Actifs</p>
                  <p className="text-xl font-bold">{stats.employesActifs}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Chantiers</p>
                  <p className="text-xl font-bold">{stats.chantiersActifs}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Ponctualité</p>
                  <p className="text-xl font-bold">98%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Assiduité</p>
                  <p className="text-xl font-bold">100%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Activité récente</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium">Pointage entrée</p>
                  <p className="text-sm text-gray-500">Chantier: Bordeaux Centre</p>
                  <p className="text-sm text-gray-500">Aujourd'hui à 08:15</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium">Pointage sortie</p>
                  <p className="text-sm text-gray-500">Chantier: Bordeaux Centre</p>
                  <p className="text-sm text-gray-500">Hier à 17:30</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium">Pointage entrée</p>
                  <p className="text-sm text-gray-500">Chantier: Bordeaux Centre</p>
                  <p className="text-sm text-gray-500">Hier à 08:00</p>
                </div>
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
              <h3 className="font-medium mb-2">Informations personnelles</h3>
              <p className="text-sm text-gray-600">Nom: {user.name}</p>
              <p className="text-sm text-gray-600">Email: {user.email}</p>
              <p className="text-sm text-gray-600">Rôle: {user.role === "admin" ? "Administrateur" : "Ouvrier"}</p>
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
