
import React, { useEffect, useState } from "react";
import { Bell, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InternalMessage {
  id: string;
  sender_name: string;
  subject: string;
  content: string;
  priority: 'normal' | 'urgent';
  status: 'new' | 'read';
  created_at: string;
}

export const MessageNotifications: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState<InternalMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnreadMessages();
    setupRealtimeSubscription();
  }, []);

  const loadUnreadMessages = async () => {
    try {
      setLoading(true);
      
      const { data: messages, error } = await supabase
        .from('internal_messages')
        .select('*')
        .eq('status', 'new')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Erreur lors du chargement des messages:", error);
        return;
      }

      // Convert the data to match our interface with proper type casting
      const typedMessages: InternalMessage[] = (messages || []).map(message => ({
        id: message.id,
        sender_name: message.sender_name,
        subject: message.subject,
        content: message.content,
        priority: (message.priority === 'urgent' ? 'urgent' : 'normal') as 'normal' | 'urgent',
        status: (message.status === 'read' ? 'read' : 'new') as 'new' | 'read',
        created_at: message.created_at
      }));

      setUnreadCount(typedMessages.length);
      setRecentMessages(typedMessages);
    } catch (error) {
      console.error("Erreur lors du chargement des messages non lus:", error);
    } finally {
      setLoading(false);
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
        const newMessage = payload.new;
        const typedNewMessage: InternalMessage = {
          id: newMessage.id,
          sender_name: newMessage.sender_name,
          subject: newMessage.subject,
          content: newMessage.content,
          priority: (newMessage.priority === 'urgent' ? 'urgent' : 'normal') as 'normal' | 'urgent',
          status: (newMessage.status === 'read' ? 'read' : 'new') as 'new' | 'read',
          created_at: newMessage.created_at
        };
        
        setUnreadCount(prev => prev + 1);
        setRecentMessages(prev => [typedNewMessage, ...prev.slice(0, 4)]);
        
        // Notification sonore/visuelle
        toast.info("Nouveau message reçu", {
          description: `${typedNewMessage.sender_name}: ${typedNewMessage.subject}`,
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

  const handleViewAllMessages = () => {
    window.location.hash = "#/gestion/messages";
  };

  if (loading) {
    return (
      <Button variant="ghost" size="sm" className="relative" disabled>
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

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
              {unreadCount > 99 ? "99+" : unreadCount}
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
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentMessages.map((message) => (
                <div key={message.id} className="p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                  <div className="flex items-start space-x-2">
                    <MessageCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{message.sender_name}</p>
                      <p className="text-xs text-gray-600 truncate">{message.subject}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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
              onClick={handleViewAllMessages}
            >
              Voir tous les messages ({unreadCount})
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
