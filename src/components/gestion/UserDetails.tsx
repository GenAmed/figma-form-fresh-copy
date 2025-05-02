
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2, Mail, Phone, UserPlus, CheckCircle, Plus } from "lucide-react";
import { toast } from "sonner";

export const UserDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Mock user data - in a real application this would be fetched from an API
  const user = {
    id: id || "1",
    name: "Jean Dupont",
    email: "jean.dupont@avem.fr",
    phone: "+33 6 12 34 56 78",
    role: "ouvrier",
    active: true,
    avatarUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
    assignments: [
      {
        id: "1",
        name: "Chantier Saint-Michel",
        startDate: "15/04/2025",
        endDate: "30/04/2025"
      },
      {
        id: "2",
        name: "Chantier Belleville",
        startDate: "02/05/2025",
        endDate: "15/05/2025"
      }
    ]
  };

  const handleBack = () => {
    navigate("/gestion/users");
  };

  const handleEdit = () => {
    // Future implementation for editing a user
    toast.info("Fonction de modification à venir");
  };

  const handleDelete = () => {
    // Implementation for deleting a user
    toast.success("Utilisateur supprimé avec succès");
    navigate("/gestion/users");
  };

  const handleAddAssignment = () => {
    navigate(`/gestion/users/details/${id}/add-assignment`);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Admin</span>;
      case "ouvrier":
        return <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Ouvrier</span>;
      default:
        return <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Inconnu</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <header className="bg-[#BD1E28] text-white p-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-3 p-0 hover:bg-transparent text-white"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">Détails de l'utilisateur</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* User Name */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#333333]">{user.name}</h2>
        </div>

        {/* Information Section */}
        <section className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-lg font-bold text-[#333333] mb-4">Informations</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="w-6 h-6 text-[#666666]" />
              <span className="ml-2 text-[#666666]">{user.email}</span>
            </div>
            
            <div className="flex items-center">
              <Phone className="w-6 h-6 text-[#666666]" />
              <span className="ml-2 text-[#666666]">{user.phone}</span>
            </div>
            
            <div className="flex items-center">
              <UserPlus className="w-6 h-6 text-[#666666]" />
              <div className="ml-2">
                {getRoleBadge(user.role)}
              </div>
            </div>
            
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-[#666666]" />
              <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {user.active ? "Actif" : "Inactif"}
              </span>
            </div>
          </div>
        </section>

        {/* Current Assignments Section */}
        <section className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#333333]">Assignations actuelles</h3>
            <Button 
              size="sm" 
              variant="outline"
              className="text-[#BD1E28] border-[#BD1E28]"
              onClick={handleAddAssignment}
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
          
          <div className="space-y-4">
            {user.assignments.map((assignment) => (
              <div key={assignment.id} className="border-b pb-3">
                <h4 className="font-bold text-[#333333]">{assignment.name}</h4>
                <p className="text-sm text-[#666666]">Du {assignment.startDate} au {assignment.endDate}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
        <div className="flex justify-between gap-4">
          <Button 
            type="button" 
            className="flex-1 bg-[#BD1E28] hover:bg-[#A01822] text-white"
            onClick={handleEdit}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button 
            type="button"
            variant="outline" 
            className="flex-1"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};
