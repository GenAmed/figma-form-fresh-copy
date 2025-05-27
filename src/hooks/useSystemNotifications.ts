
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SystemNotification {
  id: string;
  type: "system" | "user" | "alert";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  user_id?: string;
}

export const useSystemNotifications = () => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    setupRealtimeSubscription();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Simuler des notifications système basées sur les données réelles
      const systemNotifications: SystemNotification[] = [];
      
      // Vérifier les alertes récentes pour créer des notifications
      const { data: timeEntries, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          profiles!inner(name),
          worksites!inner(name)
        `)
        .gte('date', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (!error && timeEntries) {
        // Créer des notifications pour les pointages récents
        timeEntries.slice(0, 5).forEach((entry, index) => {
          if (entry.start_time && !entry.end_time) {
            systemNotifications.push({
              id: `missing-exit-${entry.id}`,
              type: "alert",
              title: "Pointage de sortie manquant",
              message: `${entry.profiles.name} n'a pas pointé de sortie sur ${entry.worksites.name}`,
              read: false,
              created_at: entry.created_at,
              user_id: entry.user_id
            });
          } else if (entry.start_time && entry.end_time) {
            systemNotifications.push({
              id: `activity-${entry.id}`,
              type: "system",
              title: "Activité récente",
              message: `${entry.profiles.name} a terminé sa journée sur ${entry.worksites.name}`,
              read: Math.random() > 0.5, // Simuler des notifications lues/non lues
              created_at: entry.updated_at || entry.created_at
            });
          }
        });
      }

      // Vérifier les nouveaux messages
      const { data: messages, error: messagesError } = await supabase
        .from('internal_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (!messagesError && messages) {
        messages.forEach(message => {
          systemNotifications.push({
            id: `message-${message.id}`,
            type: "user",
            title: "Nouveau message",
            message: `${message.sender_name}: ${message.subject}`,
            read: message.status === 'read',
            created_at: message.created_at
          });
        });
      }

      // Trier par date et prendre les plus récentes
      const sortedNotifications = systemNotifications
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

      setNotifications(sortedNotifications);
      setUnreadCount(sortedNotifications.filter(n => !n.read).length);

    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      toast.error('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('system-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'time_entries'
      }, () => {
        loadNotifications(); // Recharger quand de nouvelles entrées sont ajoutées
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'internal_messages'
      }, () => {
        loadNotifications(); // Recharger quand de nouveaux messages arrivent
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications
  };
};
