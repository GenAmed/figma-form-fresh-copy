
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WorksiteHeader } from "./worksites/WorksiteHeader";
import { WorksiteForm, WorksiteFormValues } from "./worksites/WorksiteForm";
import { WorksiteActions } from "./worksites/WorksiteActions";
import { FeedbackAlert } from "@/components/ui/feedback-alert";
import { getCurrentUser } from "@/lib/auth";

export const AddWorksite: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  // Vérifier l'authentification avec le système local actuel
  const currentUser = getCurrentUser();
  const isAuthenticated = !!currentUser && currentUser.role === "admin";

  const handleSubmit = async (values: WorksiteFormValues) => {
    setIsSubmitting(true);
    setErrorDetails(null);
    
    try {
      // Vérifier si l'utilisateur est authentifié selon le système local
      if (!isAuthenticated) {
        throw new Error("Vous devez être connecté en tant qu'administrateur pour effectuer cette action");
      }

      console.log("Tentative d'ajout de chantier:", values);
      
      // Appeler directement la fonction Edge pour contourner les problèmes de RLS
      const response = await supabase.functions.invoke("create-worksite", {
        body: {
          name: values.name,
          address: values.address,
          start_date: values.startDate || null,
          end_date: values.endDate || null,
          status: values.status
        }
      });

      console.log("Réponse de la fonction Edge:", response);
      
      // Vérifier s'il y a une erreur dans la réponse
      if (response.error) {
        console.error("Erreur de l'Edge Function:", response.error);
        throw new Error(response.error.message || "Échec de la création du chantier");
      }
      
      // Vérifier si le corps de la réponse contient une erreur
      if (response.data && response.data.error) {
        console.error("Erreur retournée par l'API:", response.data.error);
        throw new Error(response.data.error || "Échec de la création du chantier");
      }
      
      toast.success("Chantier ajouté avec succès");
      navigate("/gestion");
    } catch (error: any) {
      console.error("Erreur détaillée:", error);
      
      // Enregistrer les détails de l'erreur pour affichage
      setErrorDetails(error instanceof Error ? error.message : JSON.stringify(error));
      
      toast.error(`Erreur lors de l'ajout du chantier: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <WorksiteHeader title="Ajouter un chantier" />

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        {!isAuthenticated ? (
          <FeedbackAlert
            type="error"
            title="Accès non autorisé"
            description="Vous devez être connecté en tant qu'administrateur pour ajouter un chantier."
            className="mb-4"
            autoClose={false}
          />
        ) : (
          <>
            <WorksiteForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            
            {/* Affichage des détails de l'erreur pour le débogage */}
            {errorDetails && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <h3 className="text-sm font-semibold text-red-700 mb-2">Détails de l'erreur (pour le débogage):</h3>
                <pre className="text-xs overflow-auto p-2 bg-red-100 rounded max-h-40">
                  {errorDetails}
                </pre>
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Actions */}
      <WorksiteActions
        onSubmit={() => document.querySelector('form')?.requestSubmit()}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
