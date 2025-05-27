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
  console.log("Génération d'un UUID temporaire pour:", userId);
  
  // Si c'est déjà un UUID valide, le retourner tel quel
  if (isValidUUID(userId)) {
    console.log("L'ID utilisateur est déjà un UUID valide");
    return userId;
  }
  
  // Créer un hash simple à partir de l'ID utilisateur
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir en 32-bit integer
  }
  
  // Assurer que le hash est positif
  const positiveHash = Math.abs(hash);
  
  // Utiliser crypto.getRandomValues pour plus de randomness, avec le hash comme seed
  const array = new Uint8Array(16);
  const seedValue = positiveHash;
  
  // Remplir le tableau avec des valeurs basées sur le hash
  for (let i = 0; i < 16; i++) {
    array[i] = (seedValue + i * 37) % 256;
  }
  
  // Convertir en UUID v4
  array[6] = (array[6] & 0x0f) | 0x40; // Version 4
  array[8] = (array[8] & 0x3f) | 0x80; // Variant
  
  const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  const uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  
  console.log("UUID généré:", uuid);
  console.log("UUID valide?", isValidUUID(uuid));
  
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
  
  console.log("=== DÉBUT sendInternalMessage ===");
  console.log("Utilisateur récupéré:", user);
  
  if (!user) {
    console.error("Utilisateur non connecté");
    return false;
  }

  // Générer un UUID valide pour l'utilisateur
  const senderId = generateTempUUID(user.id);
  console.log("ID utilisateur final pour l'envoi:", senderId);

  const messageData = {
    sender_id: senderId,
    sender_name: user.name,
    sender_email: user.email,
    subject,
    content,
    priority,
    status: 'new' as const
  };

  console.log("Données du message à envoyer:", messageData);

  try {
    console.log("Tentative d'insertion dans Supabase...");
    const { data, error } = await supabase
      .from('internal_messages')
      .insert(messageData)
      .select();

    if (error) {
      console.error("Erreur Supabase détaillée:", error);
      console.error("Code d'erreur:", error.code);
      console.error("Message d'erreur:", error.message);
      console.error("Détails:", error.details);
      return false;
    }

    console.log("Message inséré avec succès:", data);
    console.log("=== FIN sendInternalMessage (SUCCÈS) ===");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    console.log("=== FIN sendInternalMessage (ERREUR) ===");
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
