
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ReportData {
  heuresParChantier: { name: string; heures: number }[];
  heuresParJour: { name: string; heures: number }[];
  totalHeures: number;
  employesActifs: number;
  chantiersActifs: number;
  moyenneHeuresEmploye: number;
}

export const useReportsData = (dateRange: { from: Date; to: Date }) => {
  const [data, setData] = useState<ReportData>({
    heuresParChantier: [],
    heuresParJour: [],
    totalHeures: 0,
    employesActifs: 0,
    chantiersActifs: 0,
    moyenneHeuresEmploye: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les entrées de temps dans la plage de dates
        const { data: timeEntries, error: timeError } = await supabase
          .from('time_entries')
          .select(`
            *,
            profiles!inner(name),
            worksites!inner(name)
          `)
          .gte('date', dateRange.from.toISOString().split('T')[0])
          .lte('date', dateRange.to.toISOString().split('T')[0]);

        if (timeError) {
          throw timeError;
        }

        // Calculer les heures par chantier
        const heuresParChantierMap = new Map<string, number>();
        const heuresParJourMap = new Map<string, number>();
        let totalHeures = 0;
        const employesSet = new Set<string>();
        const chantiersSet = new Set<string>();

        timeEntries?.forEach(entry => {
          if (entry.start_time && entry.end_time) {
            // Calculer les heures travaillées
            const startTime = new Date(`1970-01-01T${entry.start_time}`);
            const endTime = new Date(`1970-01-01T${entry.end_time}`);
            const heures = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

            // Heures par chantier
            const chantierName = entry.worksites.name;
            heuresParChantierMap.set(
              chantierName,
              (heuresParChantierMap.get(chantierName) || 0) + heures
            );

            // Heures par jour
            const dateKey = new Date(entry.date).toLocaleDateString('fr-FR', { weekday: 'short' });
            heuresParJourMap.set(
              dateKey,
              (heuresParJourMap.get(dateKey) || 0) + heures
            );

            totalHeures += heures;
            employesSet.add(entry.profiles.name);
            chantiersSet.add(chantierName);
          }
        });

        // Convertir en tableaux pour les graphiques
        const heuresParChantier = Array.from(heuresParChantierMap.entries()).map(([name, heures]) => ({
          name,
          heures: Math.round(heures * 10) / 10
        }));

        const heuresParJour = Array.from(heuresParJourMap.entries()).map(([name, heures]) => ({
          name,
          heures: Math.round(heures * 10) / 10
        }));

        const employesActifs = employesSet.size;
        const chantiersActifs = chantiersSet.size;
        const moyenneHeuresEmploye = employesActifs > 0 ? Math.round((totalHeures / employesActifs) * 10) / 10 : 0;

        setData({
          heuresParChantier,
          heuresParJour,
          totalHeures: Math.round(totalHeures * 10) / 10,
          employesActifs,
          chantiersActifs,
          moyenneHeuresEmploye
        });

      } catch (error) {
        console.error('Erreur lors du chargement des données de rapport:', error);
        toast.error('Erreur lors du chargement des données de rapport');
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, [dateRange]);

  return { data, loading };
};
