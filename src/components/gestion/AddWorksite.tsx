
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WorksiteHeader } from "./worksites/WorksiteHeader";
import { WorksiteForm, WorksiteFormValues } from "./worksites/WorksiteForm";
import { WorksiteActions } from "./worksites/WorksiteActions";

export const AddWorksite: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: WorksiteFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("worksites")
        .insert({
          name: values.name,
          address: values.address,
          start_date: values.startDate || null,
          end_date: values.endDate || null,
          status: values.status
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

  const handleFormSubmit = (formData: WorksiteFormValues) => {
    return handleSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <WorksiteHeader title="Ajouter un chantier" />

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        <WorksiteForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
      </main>

      {/* Bottom Actions */}
      <WorksiteActions
        onSubmit={() => document.querySelector('form')?.requestSubmit()}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
