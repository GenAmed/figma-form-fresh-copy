
import React, { useEffect } from "react";
import { useSessionMonitoring } from "@/services/sessionService";

interface SessionManagerProps {
  children: React.ReactNode;
}

/**
 * Composant de gestion de session globale
 * À inclure au niveau racine de l'application pour surveiller automatiquement les sessions
 */
export const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const { startMonitoring, stopMonitoring, isAuthenticated } = useSessionMonitoring();

  useEffect(() => {
    // Démarrer la surveillance si l'utilisateur est connecté
    if (isAuthenticated()) {
      startMonitoring();
    }

    // Nettoyer à la destruction du composant
    return () => {
      stopMonitoring();
    };
  }, []);

  // Surveiller les changements d'authentification
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'avem_user_session') {
        if (e.newValue) {
          // Session créée/mise à jour
          startMonitoring();
        } else {
          // Session supprimée
          stopMonitoring();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return <>{children}</>;
};
