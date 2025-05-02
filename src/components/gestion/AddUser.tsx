
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserHeader } from "./users/UserHeader";
import { UserForm, UserFormValues } from "./users/UserForm";
import { UserActions } from "./users/UserActions";
import { FeedbackAlert } from "@/components/ui/feedback-alert";
import { getCurrentUser } from "@/lib/auth";

export const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  // Vérifier l'authentification avec le système local actuel
  const currentUser = getCurrentUser();
  const isAuthenticated = !!currentUser && currentUser.role === "admin";

  const handleSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    setErrorDetails(null);
    
    try {
      // Vérifier si l'utilisateur est authentifié selon le système local
      if (!isAuthenticated) {
        throw new Error("Vous devez être connecté en tant qu'administrateur pour effectuer cette action");
      }
      
      // Appeler la function Edge pour créer l'utilisateur sans passer de token
      const response = await supabase.functions.invoke("create-user", {
        body: values
      });
      
      // Vérifier s'il y a une erreur dans la réponse
      if (response.error) {
        console.error("Erreur de l'Edge Function:", response.error);
        throw new Error(response.error.message || "Échec de la création de l'utilisateur");
      }
      
      // Vérifier si le corps de la réponse contient une erreur
      if (response.data && response.data.error) {
        console.error("Erreur retournée par l'API:", response.data.error);
        throw new Error(response.data.error || "Échec de la création de l'utilisateur");
      }
      
      // Si l'utilisateur est créé avec succès
      toast.success("Utilisateur ajouté avec succès");
      navigate("/gestion/users");
    } catch (error: any) {
      console.error("Erreur détaillée:", error);
      
      // Enregistrer les détails de l'erreur pour affichage
      setErrorDetails(error instanceof Error ? error.message : JSON.stringify(error));
      
      // Gestion des erreurs spécifiques
      if (error.message && error.message.includes("User already registered")) {
        toast.error("Un utilisateur avec cette adresse email existe déjà");
      } else if (error.message && error.message.includes("Admin access required")) {
        toast.error("Vous devez être administrateur pour créer un utilisateur");
      } else if (error.message && error.message.includes("service_role")) {
        toast.error("Erreur de configuration: clé de service manquante");
      } else if (error.message && error.message.includes("connecté")) {
        toast.error("Vous devez être connecté pour effectuer cette action");
      } else {
        toast.error(`Erreur lors de l'ajout de l'utilisateur: ${error.message || error}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <UserHeader title="Ajouter un utilisateur" />

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        {!isAuthenticated ? (
          <FeedbackAlert
            type="error"
            title="Accès non autorisé"
            description="Vous devez être connecté en tant qu'administrateur pour ajouter un utilisateur."
            className="mb-4"
            autoClose={false}
          />
        ) : (
          <>
            <UserForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            
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
      <UserActions
        onSubmit={() => document.querySelector('form')?.requestSubmit()}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
