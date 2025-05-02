
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserHeader } from "./users/UserHeader";
import { UserForm, UserFormValues } from "./users/UserForm";
import { UserActions } from "./users/UserActions";
import { FeedbackAlert } from "@/components/ui/feedback-alert";

export const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification au chargement du composant
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  // Configuration du listener d'authentification
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    setErrorDetails(null);
    
    try {
      // Vérifier si l'utilisateur est authentifié
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Vous devez être connecté pour effectuer cette action");
      }
      
      // Appeler la function Edge pour créer l'utilisateur
      const response = await supabase.functions.invoke("create-user", {
        body: values,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
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
      setErrorDetails(JSON.stringify(error, null, 2));
      
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

  const handleFormSubmit = (formData: UserFormValues) => {
    return handleSubmit(formData);
  };

  // Afficher un message si l'authentification est en cours de vérification
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BD1E28]"></div>
        <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <UserHeader title="Ajouter un utilisateur" />

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        {!isAuthenticated ? (
          <FeedbackAlert
            type="error"
            title="Non authentifié"
            description="Vous devez être connecté pour ajouter un utilisateur. Veuillez vous reconnecter."
            className="mb-4"
            autoClose={false}
          />
        ) : (
          <>
            <UserForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
            
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
