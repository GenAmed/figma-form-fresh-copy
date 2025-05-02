
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Pencil, Plus, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface UserManagementProps {
  user: User;
}

type UserData = {
  id: string;
  name: string;
  email: string;
  role: "ouvrier" | "admin";
  avatarUrl: string;
};

export const UserManagement: React.FC<UserManagementProps> = ({ user }) => {
  const navigate = useNavigate();
  
  // Sample user data
  const [users, setUsers] = useState<UserData[]>([
    {
      id: "1",
      name: "Thomas Bernard",
      email: "thomas.bernard@avem.fr",
      role: "admin",
      avatarUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
    },
    {
      id: "2",
      name: "Pierre Dubois",
      email: "pierre.dubois@avem.fr",
      role: "ouvrier",
      avatarUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
    },
    {
      id: "3",
      name: "Marie Laurent",
      email: "marie.laurent@avem.fr",
      role: "admin",
      avatarUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
    }
  ]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Admin</span>;
      case "ouvrier":
        return <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">Ouvrier</span>;
      default:
        return <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">Inconnu</span>;
    }
  };

  const handleEdit = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // Future implementation for editing a user
    toast.info("Fonction de modification à venir");
  };

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // Implementation for deleting a user
    toast.success("Utilisateur supprimé avec succès");
    setUsers(users.filter(user => user.id !== id));
  };

  const handleAddUser = () => {
    // Future implementation for adding a user
    toast.info("Fonction d'ajout d'utilisateur à venir");
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <header className="bg-[#BD1E28] text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">Gestion des utilisateurs</h1>
          <button 
            className="flex items-center space-x-1 bg-white/20 px-3 py-1.5 rounded-md"
            onClick={handleAddUser}
          >
            <UserPlus className="w-4 h-4 mr-1" />
            <span className="text-sm">Nouvel utilisateur</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-4 pb-20">
        {/* Users List */}
        <div className="space-y-4">
          {users.map((userData) => (
            <Card 
              key={userData.id} 
              className="bg-white rounded-lg shadow-sm p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex space-x-3">
                  <img src={userData.avatarUrl} alt="User" className="w-12 h-12 rounded-full" />
                  <div>
                    <h3 className="font-bold text-[#333333]">{userData.name}</h3>
                    <p className="text-sm text-[#666666]">{userData.email}</p>
                    {getRoleBadge(userData.role)}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="p-2 text-[#666666] hover:text-[#BD1E28]"
                    onClick={(e) => handleEdit(userData.id, e)}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 text-[#666666] hover:text-[#BD1E28]"
                    onClick={(e) => handleDelete(userData.id, e)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="gestion" />
    </div>
  );
};
