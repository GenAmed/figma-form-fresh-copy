
import React from "react";
import { User } from "@/lib/auth";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-[#F8F8F8] pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 fixed w-full top-0 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Mon Profil</h1>
          <Button variant="ghost" size="sm">
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
                  <p>Aujourd'hui à 08:15</p>
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
                  <p className="text-sm text-gray-500">Heures ce mois</p>
                  <p className="text-xl font-bold">124h</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Chantiers</p>
                  <p className="text-xl font-bold">3</p>
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
            <Button variant="outline" className="w-full">Changer mon mot de passe</Button>
            <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">Se déconnecter</Button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />
    </div>
  );
};
