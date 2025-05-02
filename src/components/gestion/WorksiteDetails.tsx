
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Pencil, Trash2, ArrowLeft, MapPin, Calendar, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type Assignment = {
  id: string;
  workerName: string;
  avatarUrl: string;
  startDate: string;
  endDate: string;
};

export const WorksiteDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // This would normally come from an API or state management
  // Mock data for the selected worksite
  const worksite = {
    id: id || "1",
    name: "Rénovation Immeuble A",
    address: "123 Rue de la Construction, 75001 Paris",
    startDate: "15 Mars 2025",
    endDate: "30 Juin 2025",
    status: "active"
  };
  
  // Mock data for assignments
  const assignments: Assignment[] = [
    {
      id: "1",
      workerName: "Jean Dupont",
      avatarUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
      startDate: "15 Mars",
      endDate: "30 Mars 2025"
    },
    {
      id: "2",
      workerName: "Marc Martin",
      avatarUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
      startDate: "1 Avril",
      endDate: "15 Avril 2025"
    }
  ];

  const handleGoBack = () => {
    navigate("/gestion");
  };

  const handleEdit = () => {
    // Future implementation for editing a worksite
    toast.info("Fonctionnalité de modification à venir");
  };

  const handleDelete = () => {
    toast.success("Chantier supprimé avec succès");
    navigate("/gestion");
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

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <header className="bg-[#BD1E28] text-white p-4">
        <div className="flex items-center">
          <button onClick={handleGoBack} className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Détails du chantier</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6 pb-20">
        {/* Project Title */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-[#333333]">{worksite.name}</h2>
        </Card>

        {/* Information Section */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-[#333333] mb-4">Informations</h3>
          
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-[#BD1E28] mt-1" />
            <p className="text-[#666666]">{worksite.address}</p>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-[#BD1E28] mt-1" />
            <div className="text-[#666666]">
              <p>Début: {worksite.startDate}</p>
              <p>Fin: {worksite.endDate}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-[#BD1E28]" />
            {getStatusUI(worksite.status)}
          </div>
        </Card>

        {/* Assignments Section */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-[#333333] mb-4">Assignations</h3>
          
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <img src={assignment.avatarUrl} alt={assignment.workerName} className="w-10 h-10 rounded-full" />
                    </Avatar>
                    <div>
                      <p className="font-bold text-[#333333]">{assignment.workerName}</p>
                      <p className="text-sm text-[#666666]">{assignment.startDate} - {assignment.endDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions Section */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-[#333333] mb-4">Actions</h3>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full border-[#BD1E28] text-[#BD1E28] hover:bg-[#BD1E28]/10"
              onClick={handleEdit}
            >
              <Pencil className="w-4 h-4 mr-2" />
              <span>Modifier</span>
            </Button>
            
            <Button 
              className="w-full bg-[#BD1E28] hover:bg-[#BD1E28]/80 text-white"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span>Supprimer</span>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};
