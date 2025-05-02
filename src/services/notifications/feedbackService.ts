
// Service for providing feedback on various operations
import { showToast } from "./toastService";
import type { NotificationType } from "./types";

// Feedback for tracking actions (pointage)
export const showPointageFeedback = (
  action: "start" | "end" | "sync",
  success: boolean,
  details?: string
): void => {
  if (success) {
    switch (action) {
      case "start":
        showToast("Pointage démarré", details || "Votre journée de travail a bien démarré", "success");
        break;
      case "end":
        showToast("Pointage terminé", details || "Votre journée de travail est terminée", "success");
        break;
      case "sync":
        showToast("Synchronisation réussie", details || "Toutes vos données sont synchronisées", "success");
        break;
    }
  } else {
    switch (action) {
      case "start":
        showToast("Erreur de pointage", details || "Impossible de démarrer le pointage", "error");
        break;
      case "end":
        showToast("Erreur de pointage", details || "Impossible de terminer le pointage", "error");
        break;
      case "sync":
        showToast("Erreur de synchronisation", details || "Impossible de synchroniser vos données", "error");
        break;
    }
  }
};

// Feedback for location actions
export const showLocationFeedback = (
  success: boolean,
  accuracy?: number,
  details?: string
): void => {
  if (success) {
    let message = "Localisation récupérée avec succès";
    if (accuracy) {
      message += ` (précision: ${accuracy.toFixed(0)}m)`;
    }
    showToast("Localisation", message, "info");
  } else {
    showToast(
      "Problème de localisation", 
      details || "Impossible de récupérer votre position", 
      "warning"
    );
  }
};

// Feedback for worksite actions
export const showWorksiteFeedback = (
  action: "select" | "add" | "update" | "delete",
  success: boolean,
  name?: string,
  details?: string
): void => {
  const worksiteName = name ? `"${name}"` : "";
  
  if (success) {
    switch (action) {
      case "select":
        showToast("Chantier sélectionné", `Vous travaillez maintenant sur ${worksiteName}`, "success");
        break;
      case "add":
        showToast("Chantier ajouté", `Le chantier ${worksiteName} a été créé`, "success");
        break;
      case "update":
        showToast("Chantier mis à jour", details || `Le chantier ${worksiteName} a été modifié`, "success");
        break;
      case "delete":
        showToast("Chantier supprimé", `Le chantier ${worksiteName} a été supprimé`, "info");
        break;
    }
  } else {
    switch (action) {
      case "select":
        showToast("Erreur de sélection", `Impossible de sélectionner le chantier ${worksiteName}`, "error");
        break;
      case "add":
        showToast("Erreur de création", details || `Impossible de créer le chantier`, "error");
        break;
      case "update":
        showToast("Erreur de mise à jour", details || `Impossible de modifier le chantier ${worksiteName}`, "error");
        break;
      case "delete":
        showToast("Erreur de suppression", details || `Impossible de supprimer le chantier ${worksiteName}`, "error");
        break;
    }
  }
};
