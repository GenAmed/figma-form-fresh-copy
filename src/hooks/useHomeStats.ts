
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface HomeStats {
  employesActifs: number;
  chantiersActifs: number;
}

export const useHomeStats = () => {
  const [stats, setStats] = useState<HomeStats>({
    employesActifs: 0,
    chantiersActifs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Récupérer le nombre d'employés actifs
        const { data: employeesData, error: employeesError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('active', true);

        if (employeesError) {
          console.error('Erreur lors du comptage des employés:', employeesError);
        }

        // Récupérer le nombre de chantiers actifs
        const { data: worksitesData, error: worksitesError } = await supabase
          .from('worksites')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active');

        if (worksitesError) {
          console.error('Erreur lors du comptage des chantiers:', worksitesError);
        }

        setStats({
          employesActifs: employeesData?.length || 0,
          chantiersActifs: worksitesData?.length || 0
        });

      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
        toast.error('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};
