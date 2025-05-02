
/**
 * Service pour gérer les retours haptiques sur appareils mobiles
 */

// Types de vibration
export type HapticPattern = "success" | "error" | "warning" | "info" | "click" | "long";

// Vérifie si l'appareil supporte les vibrations
export const supportsHapticFeedback = (): boolean => {
  return !!window.navigator && !!window.navigator.vibrate;
};

// Déclenche une vibration sur l'appareil si supporté
export const triggerHapticFeedback = (pattern: HapticPattern = "click"): boolean => {
  if (!supportsHapticFeedback()) {
    return false;
  }

  // Patterns de vibration en millisecondes
  const patterns: Record<HapticPattern, number | number[]> = {
    success: [100, 50, 100],     // Double pulse court
    error: [100, 50, 100, 50, 200], // Triple pulse avec un plus long à la fin
    warning: [150, 100, 150],    // Double pulse moyen
    info: 80,                    // Pulse très court
    click: 40,                   // Très court clic
    long: 300                    // Long feedback
  };

  try {
    window.navigator.vibrate(patterns[pattern]);
    return true;
  } catch (error) {
    console.error("Erreur lors de la vibration:", error);
    return false;
  }
};

// Méthodes spécifiques pour différents types de feedback
export const hapticFeedback = {
  success: () => triggerHapticFeedback("success"),
  error: () => triggerHapticFeedback("error"),
  warning: () => triggerHapticFeedback("warning"),
  info: () => triggerHapticFeedback("info"),
  click: () => triggerHapticFeedback("click"),
  long: () => triggerHapticFeedback("long"),
};
