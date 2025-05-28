
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserHeader } from "./users/UserHeader";
import { UserForm, UserFormValues } from "./users/UserForm";
import { UserActions } from "./users/UserActions";
import { FeedbackAlert } from "@/components/ui/feedback-alert";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const handleSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    setErrorDetails(null);
    
    try {
      console.log("📝 [AddUser] Création d'un utilisateur avec Supabase:", values);
      
      // Créer l'utilisateur avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.password || 'tempPassword123', // Valeur par défaut si pas de mot de passe
        user_metadata: {
          name: values.name,
          role: values.role,
          phone: values.phone,
          pin: values.pin
        }
      });

      if (authError) {
        throw authError;
      }

      console.log("✅ [AddUser] Utilisateur créé avec succès:", authData.user?.email);
      toast.success(`Utilisateur "${values.name}" ajouté avec succès`);
      navigate("/gestion/users");
    } catch (error: any) {
      console.error("❌ [AddUser] Erreur détaillée:", error);
      
      setErrorDetails(error instanceof Error ? error.message : JSON.stringify(error));
      toast.error(`Erreur lors de l'ajout de l'utilisateur: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
        <UserHeader title="Ajouter un utilisateur" />
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
        <UserHeader title="Ajouter un utilisateur" />
        <main className="flex-1 p-4 pb-24">
          <FeedbackAlert
            type="error"
            title="Accès non autorisé"
            description="Vous devez être administrateur pour ajouter un utilisateur."
            className="mb-4"
            autoClose={false}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <UserHeader title="Ajouter un utilisateur" />

      <main className="flex-1 p-4 pb-24">
        <UserForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        
        {errorDetails && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-sm font-semibold text-red-700 mb-2">Détails de l'erreur (pour le débogage):</h3>
            <pre className="text-xs overflow-auto p-2 bg-red-100 rounded max-h-40">
              {errorDetails}
            </pre>
          </div>
        )}
      </main>

      <UserActions
        onSubmit={() => document.querySelector('form')?.requestSubmit()}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
