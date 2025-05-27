
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Alert {
  id: number;
  type: "warning" | "danger" | "info";
  message: string;
  date: string;
  status: "open" | "resolved" | "pending";
}

export const useAlertsData = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        
        // Récupérer les entrées de temps pour détecter les anomalies
        const { data: timeEntries, error } = await supabase
          .from('time_entries')
          .select(`
            *,
            profiles!inner(name),
            worksites!inner(name)
          `)
          .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

        if (error) {
          throw error;
        }

        const generatedAlerts: Alert[] = [];
        let alertId = 1;

        // Analyser les entrées pour générer des alertes
        timeEntries?.forEach(entry => {
          if (entry.start_time && entry.end_time) {
            const startTime = new Date(`1970-01-01T${entry.start_time}`);
            const endTime = new Date(`1970-01-01T${entry.end_time}`);
            const heures = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

            // Alerte pour plus de 10h de travail
            if (heures > 10) {
              generatedAlerts.push({
                id: alertId++,
                type: "warning",
                message: `${entry.profiles.name} a travaillé ${Math.round(heures * 10) / 10}h le ${new Date(entry.date).toLocaleDateString()}`,
                date: entry.date,
                status: "open"
              });
            }
          }

          // Alerte pour entrée sans sortie
          if (entry.start_time && !entry.end_time) {
            generatedAlerts.push({
              id: alertId++,
              type: "danger",
              message: `Pointage de sortie manquant pour ${entry.profiles.name} le ${new Date(entry.date).toLocaleDateString()}`,
              date: entry.date,
              status: "open"
            });
          }
        });

        // Vérifier les absences (profils actifs sans entrées récentes)
        const { data: activeProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('name')
          .eq('active', true)
          .eq('role', 'ouvrier');

        if (!profilesError && activeProfiles) {
          const workersWithEntries = new Set(timeEntries?.map(entry => entry.profiles.name) || []);
          
          activeProfiles.forEach(profile => {
            if (!workersWithEntries.has(profile.name)) {
              generatedAlerts.push({
                id: alertId++,
                type: "info",
                message: `Aucune activité récente pour ${profile.name}`,
                date: new Date().toISOString().split('T')[0],
                status: "pending"
              });
            }
          });
        }

        setAlerts(generatedAlerts);

      } catch (error) {
        console.error('Erreur lors du chargement des alertes:', error);
        toast.error('Erreur lors du chargement des alertes');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return { alerts, setAlerts, loading };
};
