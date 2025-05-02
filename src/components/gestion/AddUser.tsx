
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
      // Créer le profil directement dans la table profiles
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: crypto.randomUUID(), // Générer un UUID pour l'utilisateur
          name: values.name,
          email: values.email,
          pin: values.pin,
          role: values.role,
          active: values.active,
          phone: values.phone || null,
        })
        .select();
      
      if (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur:", error);
        throw error;
      }
      
      toast.success("Utilisateur ajouté avec succès");
      navigate("/gestion/users");
    } catch (error: any) {
      console.error("Erreur détaillée:", error);
      toast.error("Erreur lors de l'ajout de l'utilisateur");
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
