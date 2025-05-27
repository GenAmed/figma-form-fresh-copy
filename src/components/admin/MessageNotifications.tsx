
import React, { useEffect, useState } from "react";
import { Bell, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getAllMessages, InternalMessage } from "@/services/internalMessageService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const MessageNotifications: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState<InternalMessage[]>([]);

  useEffect(() => {
    loadUnreadMessages();
    setupRealtimeSubscription();
  }, []);

  const loadUnreadMessages = async () => {
    try {
      const messages = await getAllMessages();
      const unread = messages.filter(msg => msg.status === "new");
      setUnreadCount(unread.length);
      setRecentMessages(unread.slice(0, 5)); // Afficher les 5 plus récents
    } catch (error) {
      console.error("Erreur lors du chargement des messages non lus:", error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('message-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'internal_messages'
      }, (payload) => {
        const newMessage = payload.new as InternalMessage;
        setUnreadCount(prev => prev + 1);
        setRecentMessages(prev => [newMessage, ...prev.slice(0, 4)]);
        
        // Notification sonore/visuelle
        toast.info("Nouveau message reçu", {
          description: `${newMessage.sender_name}: ${newMessage.subject}`,
          duration: 5000
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'internal_messages'
      }, () => {
        loadUnreadMessages(); // Recharger pour mettre à jour les compteurs
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Messages non lus</h4>
            <Badge variant="secondary">{unreadCount}</Badge>
          </div>
          
          {recentMessages.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucun nouveau message
            </p>
          ) : (
            <div className="space-y-2">
              {recentMessages.map((message) => (
                <div key={message.id} className="p-2 bg-gray-50 rounded-md">
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{message.sender_name}</p>
                      <p className="text-xs text-gray-600 truncate">{message.subject}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    {message.priority === 'urgent' && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => window.location.hash = "#/gestion/messages"}
            >
              Voir tous les messages
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
