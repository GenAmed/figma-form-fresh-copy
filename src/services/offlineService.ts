
// Service pour gérer le stockage et la synchronisation des pointages hors-ligne
import { toast } from "sonner";

// Types pour les données de pointage
export interface OfflineTimeEntry {
  id: string;
  userId: string;
  worksiteId: string;
  date: string;
  startTime: string;
  endTime: string | null;
  startCoordinates: { latitude: number; longitude: number; accuracy: number };
  endCoordinates?: { latitude: number; longitude: number; accuracy: number };
  status: "pending" | "synced";
  comment?: string;
}

// Clé pour le stockage local des pointages
const OFFLINE_ENTRIES_KEY = "avem_offline_time_entries";

// Récupérer les pointages stockés localement
export const getOfflineEntries = (): OfflineTimeEntry[] => {
  const entriesJson = localStorage.getItem(OFFLINE_ENTRIES_KEY);
  if (!entriesJson) return [];
  try {
    return JSON.parse(entriesJson) as OfflineTimeEntry[];
  } catch (e) {
    console.error("Erreur lors de la récupération des pointages hors-ligne", e);
    return [];
  }
};

// Sauvegarder un pointage en mode hors-ligne
export const saveOfflineEntry = (entry: OfflineTimeEntry): void => {
  const entries = getOfflineEntries();
  
  // Si un pointage avec le même ID existe déjà, le mettre à jour
  const existingEntryIndex = entries.findIndex(e => e.id === entry.id);
  if (existingEntryIndex >= 0) {
    entries[existingEntryIndex] = entry;
  } else {
    entries.push(entry);
  }
  
  localStorage.setItem(OFFLINE_ENTRIES_KEY, JSON.stringify(entries));
};

// Synchroniser les pointages hors-ligne avec le serveur
export const syncOfflineEntries = async (): Promise<boolean> => {
  const entries = getOfflineEntries().filter(entry => entry.status === "pending");
  
  if (entries.length === 0) {
    return true; // Rien à synchroniser
  }
  
  try {
    // Simulation de synchronisation (à remplacer par un appel API réel)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Marquer les entrées comme synchronisées
    const updatedEntries = getOfflineEntries().map(entry => {
      if (entry.status === "pending") {
        return { ...entry, status: "synced" };
      }
      return entry;
    });
    
    localStorage.setItem(OFFLINE_ENTRIES_KEY, JSON.stringify(updatedEntries));
    
    toast.success(`${entries.length} pointage(s) synchronisé(s) avec succès`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la synchronisation des pointages", error);
    toast.error("Échec de la synchronisation des pointages");
    return false;
  }
};

// Vérifier si l'appareil est en ligne
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Écouter les changements de connectivité
export const setupConnectivityListeners = (
  onOnline: () => void,
  onOffline: () => void
): () => void => {
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);
  
  // Retourner une fonction pour nettoyer les écouteurs
  return () => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  };
};

// Générer un ID unique pour les pointages hors-ligne
export const generateOfflineId = (): string => {
  return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
