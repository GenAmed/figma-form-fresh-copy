
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RecentAlert {
  id: string;
  type: "warning" | "danger" | "info";
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
}

export const useRecentAlerts = () => {
  const [alerts, setAlerts] = useState<RecentAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentAlerts = async () => {
      try {
        setLoading(true);
        
        // Récupérer les entrées de temps pour analyser les anomalies
        const { data: timeEntries, error } = await supabase
          .from('time_entries')
          .select(`
            *,
            profiles!inner(name),
            worksites!inner(name)
          `)
          .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('date', { ascending: false });

        if (error) {
          throw error;
        }

        const recentAlerts: RecentAlert[] = [];

        // Analyser les heures supplémentaires
        const dailyHours = new Map<string, number>();
        timeEntries?.forEach(entry => {
          if (entry.start_time && entry.end_time) {
            const startTime = new Date(`1970-01-01T${entry.start_time}`);
            const endTime = new Date(`1970-01-01T${entry.end_time}`);
            const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
            
            const key = `${entry.profiles.name}-${entry.date}`;
            dailyHours.set(key, (dailyHours.get(key) || 0) + hours);
          }
        });

        // Générer des alertes pour les heures excessives
        let alertId = 1;
        dailyHours.forEach((hours, key) => {
          const [userName] = key.split('-');
          if (hours > 10) {
            recentAlerts.push({
              id: `overtime-${alertId++}`,
              type: "warning",
              title: "Heures supplémentaires excessives",
              description: `${userName} - +${Math.round((hours - 8) * 10) / 10}h au delà du seuil`,
              severity: "high"
            });
          }
        });

        // Vérifier les absences (entrées sans sortie)
        timeEntries?.forEach(entry => {
          if (entry.start_time && !entry.end_time) {
            recentAlerts.push({
              id: `missing-exit-${entry.id}`,
              type: "danger",
              title: "Pointage de sortie manquant",
              description: `${entry.profiles.name} - ${entry.worksites.name}`,
              severity: "high"
            });
          }
        });

        // Prendre seulement les 3 alertes les plus importantes
        setAlerts(recentAlerts.slice(0, 3));

      } catch (error) {
        console.error('Erreur lors du chargement des alertes récentes:', error);
        toast.error('Erreur lors du chargement des alertes récentes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAlerts();
  }, []);

  return { alerts, loading };
};
