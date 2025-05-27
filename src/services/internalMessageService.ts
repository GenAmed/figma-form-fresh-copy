
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/lib/auth";

export interface InternalMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: "new" | "read" | "in_progress" | "resolved";
  created_at: string;
  updated_at: string;
}

/**
 * Envoyer un message interne
 */
export const sendInternalMessage = async (
  subject: string,
  content: string,
  priority: "low" | "normal" | "high" | "urgent" = "normal"
): Promise<boolean> => {
  const user = getCurrentUser();
  
  if (!user) {
    console.error("Utilisateur non connecté");
    return false;
  }

  try {
    const { error } = await supabase
      .from('internal_messages')
      .insert({
        sender_id: user.id,
        sender_name: user.name,
        sender_email: user.email,
        subject,
        content,
        priority,
        status: 'new'
      });

    if (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    return false;
  }
};

/**
 * Récupérer tous les messages (pour les admins)
 */
export const getAllMessages = async (): Promise<InternalMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('internal_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des messages:", error);
      return [];
    }

    // Type assertion pour assurer la compatibilité avec notre interface
    return (data || []).map(item => ({
      ...item,
      priority: item.priority as "low" | "normal" | "high" | "urgent",
      status: item.status as "new" | "read" | "in_progress" | "resolved"
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    return [];
  }
};

/**
 * Récupérer les messages de l'utilisateur actuel
 */
export const getUserMessages = async (): Promise<InternalMessage[]> => {
  const user = getCurrentUser();
  
  if (!user) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('internal_messages')
      .select('*')
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des messages utilisateur:", error);
      return [];
    }

    // Type assertion pour assurer la compatibilité avec notre interface
    return (data || []).map(item => ({
      ...item,
      priority: item.priority as "low" | "normal" | "high" | "urgent",
      status: item.status as "new" | "read" | "in_progress" | "resolved"
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des messages utilisateur:", error);
    return [];
  }
};

/**
 * Mettre à jour le statut d'un message (pour les admins)
 */
export const updateMessageStatus = async (
  messageId: string,
  status: "new" | "read" | "in_progress" | "resolved"
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('internal_messages')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return false;
  }
};
