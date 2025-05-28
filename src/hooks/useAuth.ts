
import { useState, useEffect } from 'react';
import { User, authenticateUser, getCurrentUser, setCurrentUser, clearCurrentUser, extendSession } from '@/lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté au chargement
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(extendSession(currentUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { user: authenticatedUser, error: authError } = authenticateUser(email, password);
      
      if (authError) {
        setError(authError);
        setLoading(false);
        throw new Error(authError);
      }
      
      if (authenticatedUser) {
        setCurrentUser(authenticatedUser);
        setUser(authenticatedUser);
        setLoading(false);
        return { user: authenticatedUser, error: null };
      }
      
      setLoading(false);
      throw new Error("Erreur d'authentification");
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      clearCurrentUser();
      setUser(null);
      setError(null);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  return {
    user,
    profile: user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatarUrl,
      phone: user.phone,
      active: true
    } : null,
    session: user ? { user } : null,
    loading,
    error,
    signIn,
    signOut,
  };
};
