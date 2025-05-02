
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
      // 1. Créer un utilisateur via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.pin, // Utiliser le PIN comme mot de passe initial
        email_confirm: true, // Ne pas exiger de vérification d'email
        user_metadata: {
          name: values.name,
          role: values.role,
          pin: values.pin,
          active: values.active,
          phone: values.phone || null,
        }
      });
      
      if (authError) {
        console.error("Erreur lors de la création de l'utilisateur:", authError);
        throw authError;
      }
      
      // 2. Si l'utilisateur est créé avec succès
      if (authData.user) {
        // Le profil sera automatiquement créé via le trigger handle_new_user dans Supabase
        toast.success("Utilisateur ajouté avec succès");
        navigate("/gestion/users");
      } else {
        throw new Error("Échec de la création de l'utilisateur");
      }
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
