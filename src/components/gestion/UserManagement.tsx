
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Pencil, UserPlus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccessToast, showErrorToast } from "@/services/notifications/toastService";
import { useSupabaseProfile } from "@/hooks/useSupabaseProfile";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: "ouvrier" | "admin";
  avatarUrl: string;
  phone?: string;
};

export const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile: currentUserProfile } = useSupabaseProfile();

  // Charger les utilisateurs depuis Supabase
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("🔄 Chargement des utilisateurs depuis Supabase");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*");

      if (error) {
        console.error("❌ Erreur lors de la requête:", error);
        throw error;
      }

      console.log("📊 Données brutes reçues:", data);

      if (data) {
        const formattedData: UserData[] = data.map(profile => ({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as "ouvrier" | "admin",
          avatarUrl: profile.avatar_url || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
          phone: profile.phone
        }));
        setUsers(formattedData);
        console.log(`✅ ${formattedData.length} utilisateurs chargés:`, formattedData.map(u => ({id: u.id, name: u.name})));
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des utilisateurs:", error);
      showErrorToast("Erreur", "Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

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
    
    const userToDelete = users.find(u => u.id === id);
    console.log("🗑️ Tentative de suppression de l'utilisateur:", { id, name: userToDelete?.name });
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userToDelete?.name}" ?`)) {
      try {
        console.log("🔍 Vérification de l'authentification actuelle...");
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        console.log("👤 Utilisateur authentifié:", currentUser?.email || "Non authentifié");

        if (!currentUser) {
          showErrorToast("Erreur d'authentification", "Vous devez être connecté avec Supabase pour supprimer des utilisateurs");
          return;
        }

        // Vérifier que l'utilisateur actuel est admin
        if (!currentUserProfile || currentUserProfile.role !== 'admin') {
          showErrorToast("Permission refusée", "Seuls les administrateurs peuvent supprimer des utilisateurs");
          return;
        }

        // Étape 1: Vérifier que l'utilisateur existe avant suppression
        console.log("🔍 Vérification de l'existence de l'utilisateur avant suppression...");
        const { data: existingUser, error: checkError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        if (checkError) {
          console.error("❌ Erreur lors de la vérification:", checkError);
          if (checkError.code === 'PGRST116') {
            showErrorToast("Utilisateur introuvable", "L'utilisateur n'existe déjà plus");
            await fetchUsers();
            return;
          }
          throw checkError;
        }

        console.log("✅ Utilisateur trouvé avant suppression:", existingUser);

        // Étape 2: Effectuer la suppression
        console.log("🗑️ Exécution de la suppression...");
        const { error: deleteError, data: deleteData } = await supabase
          .from("profiles")
          .delete()
          .eq("id", id);

        console.log("📤 Résultat de la suppression:", { error: deleteError, data: deleteData });

        if (deleteError) {
          console.error("❌ Erreur lors de la suppression:", deleteError);
          
          // Messages d'erreur plus spécifiques
          if (deleteError.code === '42501') {
            showErrorToast("Permission refusée", "Vous n'avez pas les droits pour supprimer cet utilisateur. Vérifiez que vous êtes bien connecté en tant qu'admin.");
          } else if (deleteError.message.includes('row-level security')) {
            showErrorToast("Sécurité RLS", "Les politiques de sécurité empêchent cette suppression. Contactez l'administrateur système.");
          } else {
            showErrorToast("Erreur de suppression", `Erreur: ${deleteError.message}`);
          }
          return;
        }

        // Étape 3: Vérifier que l'utilisateur a bien été supprimé
        console.log("🔍 Vérification de la suppression...");
        const { data: deletedUser, error: verifyError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        if (verifyError && verifyError.code === 'PGRST116') {
          console.log("✅ Utilisateur bien supprimé de la base de données");
          showSuccessToast("Suppression réussie", `Utilisateur "${userToDelete?.name}" supprimé avec succès`);
        } else if (deletedUser) {
          console.error("⚠️ PROBLÈME: L'utilisateur existe encore après suppression!", deletedUser);
          showErrorToast("Échec de la suppression", "L'utilisateur existe encore - les politiques RLS peuvent bloquer la suppression");
          return;
        }
        
        // Étape 4: Recharger la liste pour assurer la cohérence
        console.log("🔄 Rechargement de la liste...");
        await fetchUsers();
        
      } catch (error) {
        console.error("❌ Erreur lors de la suppression de l'utilisateur:", error);
        showErrorToast("Erreur", `Erreur lors de la suppression: ${error.message}`);
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
