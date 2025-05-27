
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RecentActivity {
  id: string;
  user_name: string;
  worksite_name: string;
  action: "entry" | "exit";
  timestamp: string;
  time_ago: string;
}

export const useRecentActivity = () => {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        
        // Récupérer les entrées de temps récentes avec les informations utilisateur et chantier
        const { data: timeEntries, error } = await supabase
          .from('time_entries')
          .select(`
            id,
            start_time,
            end_time,
            created_at,
            updated_at,
            profiles!inner(name),
            worksites!inner(name)
          `)
          .order('updated_at', { ascending: false })
          .limit(10);

        if (error) {
          throw error;
        }

        const recentActivities: RecentActivity[] = [];

        timeEntries?.forEach(entry => {
          // Ajouter l'activité d'entrée
          if (entry.start_time) {
            const timeDiff = Math.floor((Date.now() - new Date(entry.created_at).getTime()) / (1000 * 60));
            recentActivities.push({
              id: `${entry.id}-entry`,
              user_name: entry.profiles.name,
              worksite_name: entry.worksites.name,
              action: "entry",
              timestamp: entry.created_at,
              time_ago: timeDiff < 60 ? `Il y a ${timeDiff} minutes` : `Il y a ${Math.floor(timeDiff / 60)} heures`
            });
          }

          // Ajouter l'activité de sortie si elle existe et est différente de l'entrée
          if (entry.end_time && entry.updated_at !== entry.created_at) {
            const timeDiff = Math.floor((Date.now() - new Date(entry.updated_at).getTime()) / (1000 * 60));
            recentActivities.push({
              id: `${entry.id}-exit`,
              user_name: entry.profiles.name,
              worksite_name: entry.worksites.name,
              action: "exit",
              timestamp: entry.updated_at,
              time_ago: timeDiff < 60 ? `Il y a ${timeDiff} minutes` : `Il y a ${Math.floor(timeDiff / 60)} heures`
            });
          }
        });

        // Trier par timestamp et prendre les 4 plus récentes
        const sortedActivities = recentActivities
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 4);

        setActivities(sortedActivities);

      } catch (error) {
        console.error('Erreur lors du chargement des activités récentes:', error);
        toast.error('Erreur lors du chargement des activités récentes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  return { activities, loading };
};
