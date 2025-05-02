
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Pencil, UserPlus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UserManagementProps {
  user: User;
}

type UserData = {
  id: string;
  name: string;
  email: string;
  role: "ouvrier" | "admin";
  avatarUrl: string;
  phone?: string;
};

export const UserManagement: React.FC<UserManagementProps> = ({ user }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les utilisateurs depuis Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*");

        if (error) {
          throw error;
        }

        if (data) {
          const formattedData: UserData[] = data.map(profile => ({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as "ouvrier" | "admin",
            avatarUrl: profile.avatar_url || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg", // Image par défaut si aucune n'est fournie
            phone: profile.phone
          }));
          setUsers(formattedData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
        toast.error("Erreur lors du chargement des utilisateurs");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  const handleUserClick = (id: string) => {
    navigate(`/gestion/users/details/${id}`);
  };

  const handleEdit = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/gestion/users/details/${id}`);
  };

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        const { error } = await supabase
          .from("profiles")
          .delete()
          .eq("id", id);

        if (error) {
          throw error;
        }

        toast.success("Utilisateur supprimé avec succès");
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", error);
        toast.error("Erreur lors de la suppression de l'utilisateur");
      }
    }
  };

  const handleAddUser = () => {
    navigate("/gestion/users/add");
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
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 text-[#BD1E28] animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            Aucun utilisateur trouvé. Ajoutez-en un nouveau avec le bouton ci-dessus.
          </Card>
        ) : (
          <div className="space-y-4">
            {users.map((userData) => (
              <Card 
                key={userData.id} 
                className="bg-white rounded-lg shadow-sm p-4 cursor-pointer"
                onClick={() => handleUserClick(userData.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex space-x-3">
                    <img 
                      src={userData.avatarUrl} 
                      alt="User" 
                      className="w-12 h-12 rounded-full"
                      onError={(e) => {
                        // Fallback en cas d'image non disponible
                        (e.target as HTMLImageElement).src = "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg";
                      }}
                    />
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
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="gestion" />
    </div>
  );
};
