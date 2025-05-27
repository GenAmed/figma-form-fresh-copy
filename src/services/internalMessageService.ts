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
 * Générer un UUID v4 déterministe à partir d'un string
 */
const generateTempUUID = (userId: string): string => {
  // Créer un hash simple à partir de l'ID utilisateur
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir en 32-bit integer
  }
  
  // Assurer que le hash est positif
  const positiveHash = Math.abs(hash);
  
  // Générer des valeurs pseudo-aléatoires basées sur le hash
  const random = () => {
    hash = ((hash * 9301) + 49297) % 233280;
    return hash / 233280;
  };
  
  // Initialiser le générateur avec notre hash
  hash = positiveHash;
  
  // Générer un UUID v4 valide
  const chars = '0123456789abcdef';
  let uuid = '';
  
  for (let i = 0; i < 32; i++) {
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    
    if (i === 12) {
      // Version 4
      uuid += '4';
    } else if (i === 16) {
      // Variant (8, 9, a, or b)
      uuid += chars[8 + Math.floor(random() * 4)];
    } else {
      uuid += chars[Math.floor(random() * 16)];
    }
  }
  
  return uuid;
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
    console.log(`UUID temporaire généré: ${senderId}`);
    console.log(`UUID valide? ${isValidUUID(senderId)}`);
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
