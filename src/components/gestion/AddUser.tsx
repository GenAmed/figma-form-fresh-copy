
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
      
      console.log("📝 [AddUser] Création d'un utilisateur localement:", values);
      
      // Pour le moment, on simule la création en ajoutant simplement l'utilisateur aux données locales
      // En production, vous utiliseriez une vraie API ou base de données
      console.log("✅ [AddUser] Utilisateur créé (simulation):", values.name);
      
      toast.success(`Utilisateur "${values.name}" ajouté avec succès`);
      navigate("/gestion/users");
    } catch (error: any) {
      console.error("❌ [AddUser] Erreur détaillée:", error);
      
      // Enregistrer les détails de l'erreur pour affichage
      setErrorDetails(error instanceof Error ? error.message : JSON.stringify(error));
      
      toast.error(`Erreur lors de l'ajout de l'utilisateur: ${error.message || error}`);
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">Mode Démo</h3>
              <p className="text-xs text-yellow-700">
                Actuellement en mode démo avec authentification locale. Les utilisateurs créés ne seront pas persistés. 
                Pour une version production, connectez une vraie base de données.
              </p>
            </div>
            
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
