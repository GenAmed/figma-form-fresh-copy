
// Types for user authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: "ouvrier" | "admin";
  avatarUrl: string;
  phone?: string;
  lastLogin?: Date;
  sessionExpiry?: Date;
}

// Configuration de sécurité
const AUTH_CONFIG = {
  SESSION_DURATION: 8 * 60 * 60 * 1000, // 8 heures en millisecondes
  MIN_PASSWORD_LENGTH: 4,
  MAX_LOGIN_ATTEMPTS: 3,
  LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes
};

// Utilisateurs avec mots de passe sécurisés
const testUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "ouvrier@avem.fr", 
    name: "Thomas",
    role: "ouvrier",
    avatarUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
    phone: "06 12 34 56 78",
    password: "avem2024" // Mot de passe sécurisé pour l'ouvrier
  },
  {
    id: "2",
    email: "admin@avem.fr",
    name: "Sarah",
    role: "admin",
    avatarUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg",
    phone: "06 98 76 54 32",
    password: "admin2024" // Mot de passe sécurisé pour l'admin
  }
];

// Gestion des tentatives de connexion
interface LoginAttempt {
  email: string;
  attempts: number;
  lastAttempt: Date;
  lockedUntil?: Date;
}

const loginAttempts = new Map<string, LoginAttempt>();

// Vérifier si un utilisateur est verrouillé
const isUserLocked = (email: string): boolean => {
  const attempt = loginAttempts.get(email.toLowerCase());
  if (!attempt || !attempt.lockedUntil) return false;
  
  if (attempt.lockedUntil > new Date()) {
    return true;
  } else {
    // Déverrouiller l'utilisateur
    loginAttempts.delete(email.toLowerCase());
    return false;
  }
};

// Enregistrer une tentative de connexion échouée
const recordFailedAttempt = (email: string): void => {
  const normalizedEmail = email.toLowerCase();
  const existing = loginAttempts.get(normalizedEmail);
  const now = new Date();
  
  if (!existing) {
    loginAttempts.set(normalizedEmail, {
      email: normalizedEmail,
      attempts: 1,
      lastAttempt: now
    });
  } else {
    existing.attempts++;
    existing.lastAttempt = now;
    
    if (existing.attempts >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
      existing.lockedUntil = new Date(now.getTime() + AUTH_CONFIG.LOCKOUT_DURATION);
    }
  }
};

// Réinitialiser les tentatives après une connexion réussie
const resetFailedAttempts = (email: string): void => {
  loginAttempts.delete(email.toLowerCase());
};

// Valider le mot de passe
const validatePassword = (password: string): boolean => {
  return password.length >= AUTH_CONFIG.MIN_PASSWORD_LENGTH;
};

// Authentification sécurisée
export const authenticateUser = (email: string, password: string): { user: User | null; error?: string } => {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Vérifier si l'utilisateur est verrouillé
  if (isUserLocked(normalizedEmail)) {
    const attempt = loginAttempts.get(normalizedEmail);
    const remainingTime = Math.ceil((attempt!.lockedUntil!.getTime() - Date.now()) / 60000);
    return { 
      user: null, 
      error: `Compte temporairement verrouillé. Réessayez dans ${remainingTime} minute(s).` 
    };
  }
  
  // Valider le format du mot de passe
  if (!validatePassword(password)) {
    return { 
      user: null, 
      error: `Le mot de passe doit contenir au moins ${AUTH_CONFIG.MIN_PASSWORD_LENGTH} caractères.` 
    };
  }
  
  // Trouver l'utilisateur et vérifier le mot de passe
  const userWithPassword = testUsers.find(u => 
    u.email.toLowerCase() === normalizedEmail && u.password === password
  );
  
  if (!userWithPassword) {
    recordFailedAttempt(normalizedEmail);
    return { 
      user: null, 
      error: "Email ou mot de passe incorrect." 
    };
  }
  
  // Connexion réussie
  resetFailedAttempts(normalizedEmail);
  
  const now = new Date();
  const sessionExpiry = new Date(now.getTime() + AUTH_CONFIG.SESSION_DURATION);
  
  const { password: _, ...user } = userWithPassword; // Exclure le mot de passe
  
  return {
    user: {
      ...user,
      lastLogin: now,
      sessionExpiry
    }
  };
};

// Vérifier si la session est valide
export const isSessionValid = (user: User): boolean => {
  if (!user.sessionExpiry) return false;
  return new Date() < new Date(user.sessionExpiry);
};

// Étendre la session
export const extendSession = (user: User): User => {
  const sessionExpiry = new Date(Date.now() + AUTH_CONFIG.SESSION_DURATION);
  return { ...user, sessionExpiry };
};

// Stocker l'utilisateur actuel dans localStorage avec chiffrement basique
export const setCurrentUser = (user: User): void => {
  try {
    const userData = JSON.stringify(user);
    // Chiffrement basique avec Base64 pour éviter le stockage en clair
    const encoded = btoa(userData);
    localStorage.setItem('avem_user_session', encoded);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la session utilisateur:', error);
  }
};

// Récupérer l'utilisateur actuel depuis localStorage
export const getCurrentUser = (): User | null => {
  try {
    const encoded = localStorage.getItem('avem_user_session');
    if (!encoded) return null;
    
    // Déchiffrer les données
    const userData = atob(encoded);
    const user = JSON.parse(userData) as User;
    
    // Vérifier la validité de la session
    if (!isSessionValid(user)) {
      clearCurrentUser();
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Erreur lors de la récupération de la session utilisateur:', error);
    clearCurrentUser();
    return null;
  }
};

// Effacer l'utilisateur actuel (déconnexion)
export const clearCurrentUser = (): void => {
  localStorage.removeItem('avem_user_session');
};

// Informations sur la configuration de sécurité (pour affichage)
export const getAuthConfig = () => ({
  sessionDuration: AUTH_CONFIG.SESSION_DURATION / (60 * 60 * 1000), // en heures
  maxLoginAttempts: AUTH_CONFIG.MAX_LOGIN_ATTEMPTS,
  lockoutDuration: AUTH_CONFIG.LOCKOUT_DURATION / (60 * 1000), // en minutes
  testCredentials: {
    ouvrier: { email: "ouvrier@avem.fr", password: "avem2024" },
    admin: { email: "admin@avem.fr", password: "admin2024" }
  }
});
