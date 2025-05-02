import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserHeader } from "./users/UserHeader";
import { UserForm, UserFormValues } from "./users/UserForm";
import { UserActions } from "./users/UserActions";

export const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Récupérer le token de session actuel
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
      
      if (response.error) {
        throw new Error(response.error.message || "Échec de la création de l'utilisateur");
      }
      
      // Si l'utilisateur est créé avec succès
      toast.success("Utilisateur ajouté avec succès");
      navigate("/gestion/users");
    } catch (error: any) {
      console.error("Erreur détaillée:", error);
      
      // Gestion des erreurs spécifiques
      if (error.message && error.message.includes("User already registered")) {
        toast.error("Un utilisateur avec cette adresse email existe déjà");
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

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <UserHeader title="Ajouter un utilisateur" />

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        <UserForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
      </main>

      {/* Bottom Actions */}
      <UserActions
        onSubmit={() => document.querySelector('form')?.requestSubmit()}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
