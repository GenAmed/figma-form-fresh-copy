
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MessageSquare, AlertTriangle, Clock, CheckCircle, Eye, MessageCircle } from "lucide-react";
import { getAllMessages, updateMessageStatus, InternalMessage } from "@/services/internalMessageService";
import { supabase } from "@/integrations/supabase/client";

export const InternalMessagesManager: React.FC = () => {
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<InternalMessage | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadMessages();
    setupRealtimeSubscription();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getAllMessages();
      setMessages(data);
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
      toast.error("Erreur lors du chargement des messages");
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('internal-messages-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'internal_messages'
      }, (payload) => {
        const newMessage = payload.new as InternalMessage;
        setMessages(prev => [newMessage, ...prev]);
        
        toast.success("Nouveau message reçu", {
          description: `De: ${newMessage.sender_name} - ${newMessage.subject}`,
          action: {
            label: "Voir",
            onClick: () => setSelectedMessage(newMessage)
          }
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'internal_messages'
      }, (payload) => {
        const updatedMessage = payload.new as InternalMessage;
        setMessages(prev => prev.map(msg => 
          msg.id === updatedMessage.id ? updatedMessage : msg
        ));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleStatusChange = async (messageId: string, status: string) => {
    try {
      const success = await updateMessageStatus(messageId, status as any);
      if (success) {
        toast.success("Statut mis à jour");
        loadMessages();
      } else {
        toast.error("Erreur lors de la mise à jour du statut");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "normal":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "low":
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="destructive">Nouveau</Badge>;
      case "read":
        return <Badge variant="secondary">Lu</Badge>;
      case "in_progress":
        return <Badge variant="default">En cours</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Résolu</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === "all") return true;
    return message.status === filter;
  });

  const newMessagesCount = messages.filter(msg => msg.status === "new").length;

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages Internes</h1>
          <p className="text-gray-600">Gestion des signalements et messages des employés</p>
        </div>
        <div className="flex items-center space-x-4">
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-bold">{messages.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Nouveaux</p>
                <p className="font-bold text-red-600">{newMessagesCount}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex space-x-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les messages</SelectItem>
            <SelectItem value="new">Nouveaux</SelectItem>
            <SelectItem value="read">Lus</SelectItem>
            <SelectItem value="in_progress">En cours</SelectItem>
            <SelectItem value="resolved">Résolus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table des messages */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Priorité</TableHead>
              <TableHead>Expéditeur</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Aucun message trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getPriorityIcon(message.priority)}
                      <span className="capitalize">{message.priority}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{message.sender_name}</p>
                      <p className="text-sm text-gray-500">{message.sender_email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                  <TableCell>
                    {new Date(message.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>{getStatusBadge(message.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMessage(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              {getPriorityIcon(message.priority)}
                              <span>{message.subject}</span>
                            </DialogTitle>
                          </DialogHeader>
                          {selectedMessage && (
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p><strong>De:</strong> {selectedMessage.sender_name}</p>
                                  <p><strong>Email:</strong> {selectedMessage.sender_email}</p>
                                  <p><strong>Date:</strong> {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}</p>
                                  <p><strong>Priorité:</strong> <span className="capitalize">{selectedMessage.priority}</span></p>
                                </div>
                                {getStatusBadge(selectedMessage.status)}
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Message:</h4>
                                <div className="bg-gray-50 p-4 rounded-md">
                                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Select
                                  value={selectedMessage.status}
                                  onValueChange={(value) => handleStatusChange(selectedMessage.id, value)}
                                >
                                  <SelectTrigger className="w-[150px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">Nouveau</SelectItem>
                                    <SelectItem value="read">Lu</SelectItem>
                                    <SelectItem value="in_progress">En cours</SelectItem>
                                    <SelectItem value="resolved">Résolu</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
