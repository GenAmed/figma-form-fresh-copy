
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const AddWorksite: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    startDate: "",
    endDate: "",
    status: "pending"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.address) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("worksites")
        .insert({
          name: formData.name,
          address: formData.address,
          start_date: formData.startDate || null,
          end_date: formData.endDate || null,
          status: formData.status
        });
        
      if (error) throw error;
      
      toast.success("Chantier ajouté avec succès");
      navigate("/gestion");
    } catch (error) {
      console.error("Erreur lors de l'ajout du chantier:", error);
      toast.error("Erreur lors de l'ajout du chantier");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <header className="bg-[#BD1E28] text-white p-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4 p-0 hover:bg-transparent text-white"
            onClick={() => navigate("/gestion")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">Ajouter un chantier</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Worksite Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-bold text-[#333333]">
              Nom du chantier *
            </label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3"
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-bold text-[#333333]">
              Adresse *
            </label>
            <Input 
              id="address" 
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3"
              required
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label htmlFor="startDate" className="block text-sm font-bold text-[#333333]">
              Date de début
            </label>
            <div className="relative">
              <Input 
                id="startDate" 
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label htmlFor="endDate" className="block text-sm font-bold text-[#333333]">
              Date de fin
            </label>
            <div className="relative">
              <Input 
                id="endDate" 
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#333333]">
              Statut
            </label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full px-4 py-3">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 flex justify-between gap-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 px-6 py-3"
              onClick={() => navigate("/gestion")}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="flex-1 px-6 py-3 bg-[#BD1E28] hover:bg-[#A01822] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Chargement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
