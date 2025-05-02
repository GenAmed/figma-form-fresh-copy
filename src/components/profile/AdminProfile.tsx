
import React from "react";
import { User } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/services/notifications/toastService";

interface AdminProfileProps {
  user: User;
}

export const AdminProfile: React.FC<AdminProfileProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleManageUsers = () => {
    navigate("/gestion/users");
    showToast(
      "Gestion des utilisateurs",
      "Vous pouvez gérer les utilisateurs et leurs rôles ici",
      "info",
      5000,
      "/gestion/users"
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] pb-16">
      {/* Header */}
      <header className="bg-[#BD1E28] text-white px-4 py-3 fixed w-full top-0 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Profil Admin</h1>
          <Button variant="ghost" size="sm" className="text-white hover:bg-[#A01822]">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 px-4 mt-4">
        <div className="space-y-6">
          {/* Admin Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="bg-[#BD1E28] text-white text-xl">
                    {user.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-gray-500">Administrateur</p>
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
                  <p>Aujourd'hui à 08:15</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Actions d'administration</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full flex justify-between items-center"
                  onClick={handleManageUsers}
                >
                  <span>Gestion des utilisateurs</span>
                  <Users className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex justify-between items-center"
                  onClick={() => navigate("/gestion")}
                >
                  <span>Gestion des chantiers</span>
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Stats */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Statistiques du système</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Utilisateurs actifs</p>
                  <p className="text-xl font-bold">24</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Chantiers en cours</p>
                  <p className="text-xl font-bold">7</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Tâches cette semaine</p>
                  <p className="text-xl font-bold">42</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Alertes</p>
                  <p className="text-xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Buttons */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full">Paramètres du compte</Button>
            <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">Se déconnecter</Button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="profil" />
    </div>
  );
};
