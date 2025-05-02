
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { WorksiteHeader } from "./worksites/WorksiteHeader";
import { WorksiteForm, WorksiteFormValues } from "./worksites/WorksiteForm";
import { WorksiteActions } from "./worksites/WorksiteActions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const EditWorksite: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<WorksiteFormValues | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorksite = async () => {
      try {
        setLoading(true);
        
        // Appel à l'API pour récupérer les détails du chantier
        const { data: functionData, error: functionError } = await supabase.functions.invoke("get-worksites");
        
        if (functionError) {
          throw functionError;
        }
        
        if (!functionData || !functionData.data) {
          throw new Error("Aucune donnée reçue");
        }
        
        const worksite = functionData.data.find((site: any) => site.id === id);
        
        if (!worksite) {
          throw new Error("Chantier non trouvé");
        }
        
        // Formatage des données pour le formulaire
        setInitialValues({
          name: worksite.name,
          address: worksite.address,
          startDate: worksite.start_date || "",
          endDate: worksite.end_date || "",
          status: worksite.status,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération du chantier:", error);
        toast.error("Erreur lors de la récupération du chantier");
        navigate("/gestion");
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorksite();
  }, [id, navigate]);

  const handleSubmit = async (values: WorksiteFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Appel à l'Edge Function pour mettre à jour le chantier
      const { error } = await supabase.functions.invoke("update-worksite", {
        body: {
          id,
          name: values.name,
          address: values.address,
          start_date: values.startDate || null,
          end_date: values.endDate || null,
          status: values.status,
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Chantier modifié avec succès !");
      navigate(`/gestion/details/${id}`);
    } catch (error) {
      console.error("Erreur lors de la modification du chantier:", error);
      toast.error("Erreur lors de la modification du chantier");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8]">
        <WorksiteHeader title="Modifier le chantier" />
        <div className="flex justify-center items-center h-[80vh]">
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <WorksiteHeader title="Modifier le chantier" />
      
      <main className="p-4 pb-24">
        {initialValues && (
          <WorksiteForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            initialValues={initialValues}
          />
        )}
      </main>
      
      <WorksiteActions 
        onSubmit={() => document.forms[0].requestSubmit()}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
