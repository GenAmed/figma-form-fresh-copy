
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
 * Valider si une chaîne est un UUID valide
 */
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Générer un UUID temporaire pour les utilisateurs avec des IDs non-UUID
 */
const generateTempUUID = (userId: string): string => {
  // Créer un UUID déterministe basé sur l'ID utilisateur
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Convertir en UUID format (simple mais déterministe)
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex.slice(0, 8)}-${hex.slice(0, 4)}-4${hex.slice(1, 4)}-8${hex.slice(0, 3)}-${hex.slice(0, 12).padEnd(12, '0')}`;
};

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

  // Vérifier et ajuster l'ID utilisateur si nécessaire
  let senderId = user.id;
  if (!isValidUUID(senderId)) {
    console.warn(`ID utilisateur "${senderId}" n'est pas un UUID valide, génération d'un UUID temporaire`);
    senderId = generateTempUUID(senderId);
  }

  try {
    const { error } = await supabase
      .from('internal_messages')
      .insert({
        sender_id: senderId,
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

    console.log("Message envoyé avec succès");
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

  // Vérifier et ajuster l'ID utilisateur si nécessaire
  let senderId = user.id;
  if (!isValidUUID(senderId)) {
    senderId = generateTempUUID(senderId);
  }

  try {
    const { data, error } = await supabase
      .from('internal_messages')
      .select('*')
      .eq('sender_id', senderId)
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
