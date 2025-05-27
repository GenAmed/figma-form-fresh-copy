
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Building, Pencil, Plus, Trash2, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface WorksiteManagementProps {
  user: User;
}

type Worksite = {
  id: string;
  name: string;
  address: string;
  startDate: string;
  endDate: string;
  status: "active" | "pending" | "completed";
};

export const WorksiteManagement: React.FC<WorksiteManagementProps> = ({ user }) => {
  const navigate = useNavigate();
  const [worksites, setWorksites] = useState<Worksite[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les chantiers depuis notre Edge Function
  useEffect(() => {
    fetchWorksites();
  }, []);

  const fetchWorksites = async () => {
    try {
      setLoading(true);
      
      console.log("Tentative de récupération des chantiers via l'Edge Function");
      
      // Utiliser l'Edge Function pour récupérer les chantiers
      const { data, error } = await supabase.functions.invoke("get-worksites");
      
      if (error) {
        throw error;
      }

      console.log("Réponse de l'Edge Function:", data);

      if (data && data.data) {
        const formattedData: Worksite[] = data.data.map(worksite => ({
          id: worksite.id,
          name: worksite.name,
          address: worksite.address,
          startDate: worksite.start_date ? new Date(worksite.start_date).toLocaleDateString() : "",
          endDate: worksite.end_date ? new Date(worksite.end_date).toLocaleDateString() : "",
          status: worksite.status as "active" | "pending" | "completed"
        }));
        setWorksites(formattedData);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des chantiers:", error);
      toast.error("Erreur lors du chargement des chantiers");
    } finally {
      setLoading(false);
    }
  };

  const getStatusUI = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Actif</span>;
      case "pending":
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">En attente</span>;
      case "completed":
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Terminé</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Inconnu</span>;
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/gestion/details/${id}`);
  };

  const handleEdit = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/gestion/details/${id}`);
  };

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (confirm("Êtes-vous sûr de vouloir supprimer ce chantier ?")) {
      try {
        // Utiliser l'Edge Function pour la suppression aussi pour maintenir la cohérence
        const { error } = await supabase
          .from("worksites")
          .delete()
          .eq("id", id);

        if (error) {
          throw error;
        }

        toast.success("Chantier supprimé avec succès");
        
        // Recharger la liste complète pour assurer la cohérence
        await fetchWorksites();
      } catch (error) {
        console.error("Erreur lors de la suppression du chantier:", error);
        toast.error("Erreur lors de la suppression du chantier");
      }
    }
  };

  const handleAddWorksite = () => {
    navigate("/gestion/add");
  };

  const handleGoToUserManagement = () => {
    navigate("/gestion/users");
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <header className="bg-[#BD1E28] text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">Gestion des chantiers</h1>
          <div className="flex space-x-2">
            <button 
              className="bg-white bg-opacity-20 px-4 py-2 rounded-md text-sm flex items-center"
              onClick={handleAddWorksite}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau chantier
            </button>
            <button 
              className="bg-white bg-opacity-20 px-4 py-2 rounded-md text-sm flex items-center"
              onClick={handleGoToUserManagement}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Utilisateurs
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 text-[#BD1E28] animate-spin" />
          </div>
        ) : worksites.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            Aucun chantier trouvé. Ajoutez-en un nouveau avec le bouton ci-dessus.
          </Card>
        ) : (
          <section className="space-y-4">
            {worksites.map((worksite) => (
              <Card 
                key={worksite.id} 
                className="bg-white rounded-lg shadow-sm p-4 cursor-pointer"
                onClick={() => handleViewDetails(worksite.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="font-bold text-[#333333]">{worksite.name}</h2>
                    <p className="text-sm text-[#666666]">{worksite.address}</p>
                  </div>
                  {getStatusUI(worksite.status)}
                </div>
                <div className="text-sm text-[#666666] mb-4">
                  {worksite.startDate && worksite.endDate ? (
                    <p>Du {worksite.startDate} au {worksite.endDate}</p>
                  ) : (
                    <p>Dates non spécifiées</p>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    className="p-2 text-[#666666] hover:text-[#BD1E28]"
                    onClick={(e) => handleEdit(worksite.id, e)}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 text-[#666666] hover:text-[#BD1E28]"
                    onClick={(e) => handleDelete(worksite.id, e)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="gestion" />
    </div>
  );
};
