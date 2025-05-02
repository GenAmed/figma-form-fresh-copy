
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { User } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Building, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  // Sample worksites data
  const [worksites, setWorksites] = useState<Worksite[]>([
    {
      id: "1",
      name: "Tour Eiffel Rénovation",
      address: "7 Champ de Mars, 75007 Paris",
      startDate: "01/04/2025",
      endDate: "30/06/2025",
      status: "active"
    },
    {
      id: "2",
      name: "Arc de Triomphe",
      address: "Place Charles de Gaulle, 75008 Paris",
      startDate: "15/05/2025",
      endDate: "15/08/2025",
      status: "pending"
    },
    {
      id: "3",
      name: "Notre-Dame",
      address: "6 Parvis Notre-Dame, 75004 Paris",
      startDate: "01/01/2025",
      endDate: "31/03/2025",
      status: "completed"
    }
  ]);

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
    // Future implementation for editing a worksite
    console.log(`Editing worksite with id: ${id}`);
  };

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // Implementation for deleting a worksite
    toast.success("Chantier supprimé avec succès");
    setWorksites(worksites.filter(worksite => worksite.id !== id));
  };

  const handleAddWorksite = () => {
    navigate("/gestion/add");
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <header className="bg-[#BD1E28] text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">Gestion des chantiers</h1>
          <button 
            className="bg-white bg-opacity-20 px-4 py-2 rounded-md text-sm flex items-center"
            onClick={handleAddWorksite}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau chantier
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        {/* Worksites List */}
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
                <p>Du {worksite.startDate} au {worksite.endDate}</p>
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
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="gestion" />
    </div>
  );
};
