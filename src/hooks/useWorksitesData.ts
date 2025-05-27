
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Worksite {
  id: string;
  name: string;
  address: string;
  status: string;
  start_date?: string;
  end_date?: string;
}

export const useWorksitesData = () => {
  const [worksites, setWorksites] = useState<Worksite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorksites = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('worksites')
          .select('*')
          .eq('status', 'active')
          .order('name');

        if (error) {
          throw error;
        }

        setWorksites(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des chantiers:', error);
        toast.error('Erreur lors du chargement des chantiers');
      } finally {
        setLoading(false);
      }
    };

    fetchWorksites();
  }, []);

  return { worksites, loading };
};
