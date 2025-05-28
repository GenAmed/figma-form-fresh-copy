
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { WorksiteHeader } from "./worksites/WorksiteHeader";
import { WorksiteForm, WorksiteFormValues } from "./worksites/WorksiteForm";
import { WorksiteActions } from "./worksites/WorksiteActions";
import { FeedbackAlert } from "@/components/ui/feedback-alert";
import { useAuth } from "@/hooks/useAuth";
import { createWorksite } from "@/services/worksiteService";

export const AddWorksite: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const handleSubmit = async (values: WorksiteFormValues) => {
    setIsSubmitting(true);
    setErrorDetails(null);
    
    try {
      console.log("🏗️ [AddWorksite] Création d'un chantier avec Supabase:", values);
      
      const newWorksite = await createWorksite({
        name: values.name,
        address: values.address,
        start_date: values.startDate || null,
        end_date: values.endDate || null,
        status: values.status
      });
      
      console.log("✅ [AddWorksite] Chantier créé avec succès:", newWorksite);
      toast.success(`Chantier "${values.name}" ajouté avec succès`);
      navigate("/gestion");
    } catch (error: any) {
      console.error("❌ [AddWorksite] Erreur détaillée:", error);
      
      setErrorDetails(error instanceof Error ? error.message : JSON.stringify(error));
      toast.error(`Erreur lors de l'ajout du chantier: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
        <WorksiteHeader title="Ajouter un chantier" />
        <main className="flex-1 p-4 pb-24">
          <FeedbackAlert
            type="error"
            title="Accès non autorisé"
            description="Vous devez être connecté pour accéder à cette page."
            className="mb-4"
            autoClose={false}
          />
        </main>
      </div>
    );
  }

  if (profile.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
        <WorksiteHeader title="Ajouter un chantier" />
        <main className="flex-1 p-4 pb-24">
          <FeedbackAlert
            type="error"
            title="Accès non autorisé"
            description="Vous devez être administrateur pour ajouter un chantier."
            className="mb-4"
            autoClose={false}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <WorksiteHeader title="Ajouter un chantier" />

      <main className="flex-1 p-4 pb-24">
        <WorksiteForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        
        {errorDetails && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-sm font-semibold text-red-700 mb-2">Détails de l'erreur (pour le débogage):</h3>
            <pre className="text-xs overflow-auto p-2 bg-red-100 rounded max-h-40">
              {errorDetails}
            </pre>
          </div>
        )}
      </main>

      <WorksiteActions
        onSubmit={() => document.querySelector('form')?.requestSubmit()}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
