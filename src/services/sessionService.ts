
import { getCurrentUser, clearCurrentUser, extendSession, setCurrentUser } from "@/lib/auth";
import { toast } from "sonner";

// Service de gestion de session
class SessionService {
  private checkInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 60000; // Vérifier chaque minute
  private readonly WARNING_TIME = 10 * 60 * 1000; // Avertir 10 minutes avant expiration

  /**
   * Démarre la surveillance de session
   */
  startSessionMonitoring(): void {
    // Nettoyer l'ancien intervalle s'il existe
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.checkSessionStatus();
    }, this.CHECK_INTERVAL);

    // Vérification initiale
    this.checkSessionStatus();
  }

  /**
   * Arrête la surveillance de session
   */
  stopSessionMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Vérifie le statut de la session actuelle
   */
  private checkSessionStatus(): void {
    const user = getCurrentUser();
    
    if (!user || !user.sessionExpiry) {
      return;
    }

    const now = new Date();
    const expiry = new Date(user.sessionExpiry);
    const timeLeft = expiry.getTime() - now.getTime();

    // Session expirée
    if (timeLeft <= 0) {
      this.handleSessionExpiry();
      return;
    }

    // Avertissement avant expiration
    if (timeLeft <= this.WARNING_TIME && timeLeft > this.WARNING_TIME - this.CHECK_INTERVAL) {
      this.showExpiryWarning(Math.ceil(timeLeft / 60000)); // en minutes
    }
  }

  /**
   * Gère l'expiration de session
   */
  private handleSessionExpiry(): void {
    clearCurrentUser();
    this.stopSessionMonitoring();
    
    toast.error("Session expirée", {
      description: "Votre session a expiré. Veuillez vous reconnecter.",
      duration: 6000,
    });

    // Rediriger vers la page de connexion
    setTimeout(() => {
      window.location.hash = "#/";
    }, 2000);
  }

  /**
   * Affiche un avertissement d'expiration imminente
   */
  private showExpiryWarning(minutesLeft: number): void {
    toast.warning("Session bientôt expirée", {
      description: `Votre session expirera dans ${minutesLeft} minute(s). Cliquez pour prolonger.`,
      duration: 8000,
      action: {
        label: "Prolonger",
        onClick: () => this.extendCurrentSession()
      }
    });
  }

  /**
   * Prolonge la session actuelle
   */
  extendCurrentSession(): boolean {
    const user = getCurrentUser();
    if (!user) return false;

    const extendedUser = extendSession(user);
    setCurrentUser(extendedUser);

    toast.success("Session prolongée", {
      description: "Votre session a été prolongée avec succès.",
      duration: 3000,
    });

    return true;
  }

  /**
   * Vérifie si l'utilisateur est connecté et a une session valide
   */
  isUserAuthenticated(): boolean {
    const user = getCurrentUser();
    return !!user;
  }

  /**
   * Obtient les informations de session
   */
  getSessionInfo() {
    const user = getCurrentUser();
    if (!user || !user.sessionExpiry) return null;

    const now = new Date();
    const expiry = new Date(user.sessionExpiry);
    const timeLeft = expiry.getTime() - now.getTime();

    return {
      user,
      expiresAt: expiry,
      timeLeft,
      isValid: timeLeft > 0
    };
  }
}

// Instance singleton
export const sessionService = new SessionService();

// Hook pour l'initialisation dans les composants React
export const useSessionMonitoring = () => {
  const startMonitoring = () => sessionService.startSessionMonitoring();
  const stopMonitoring = () => sessionService.stopSessionMonitoring();
  const extendSession = () => sessionService.extendCurrentSession();
  const isAuthenticated = () => sessionService.isUserAuthenticated();
  const getSessionInfo = () => sessionService.getSessionInfo();

  return {
    startMonitoring,
    stopMonitoring,
    extendSession,
    isAuthenticated,
    getSessionInfo
  };
};
