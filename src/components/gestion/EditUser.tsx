
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserHeader } from "./users/UserHeader";
import { UserForm, UserFormValues } from "./users/UserForm";
import { UserActions } from "./users/UserActions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<UserFormValues | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les données de l'utilisateur depuis Supabase
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          throw new Error("Utilisateur non trouvé");
        }
        
        // Formatage des données pour le formulaire
        setInitialValues({
          name: data.name,
          email: data.email,
          pin: data.pin,
          role: data.role,
          active: data.active,
          phone: data.phone || "",
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast.error("Erreur lors de la récupération des données");
        navigate("/gestion/users");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [id, navigate]);

  const handleSubmit = async (values: UserFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Appel à l'Edge Function pour mettre à jour l'utilisateur
      const { error } = await supabase.functions.invoke("update-user", {
        body: {
          id,
          name: values.name,
          email: values.email,
          pin: values.pin,
          role: values.role,
          active: values.active,
          phone: values.phone || null,
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Utilisateur modifié avec succès !");
      navigate(`/gestion/users/details/${id}`);
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      toast.error("Erreur lors de la modification de l'utilisateur");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8]">
        <UserHeader title="Modifier l'utilisateur" />
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="h-8 w-8 text-[#BD1E28] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <UserHeader title="Modifier l'utilisateur" />
      
      <main className="p-4 pb-24">
        {initialValues && (
          <UserForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            initialValues={initialValues}
          />
        )}
      </main>
      
      <UserActions 
        onSubmit={() => document.forms[0].requestSubmit()}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
