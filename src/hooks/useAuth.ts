
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "ouvrier";
  avatar_url?: string;
  phone?: string;
  active: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 [useAuth] Auth state change:', event, !!session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Charger le profil utilisateur
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profileError) {
              console.error('❌ [useAuth] Erreur lors du chargement du profil:', profileError);
            } else if (profileData) {
              setProfile({
                id: profileData.id,
                name: profileData.name,
                email: profileData.email,
                role: profileData.role as "admin" | "ouvrier",
                avatar_url: profileData.avatar_url,
                phone: profileData.phone,
                active: profileData.active
              });
            }
          } catch (error) {
            console.error('❌ [useAuth] Erreur lors du chargement du profil:', error);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Vérifier la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 [useAuth] Session existante:', !!session);
      // L'événement onAuthStateChange se déclenchera automatiquement
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        setError(signInError.message);
        throw signInError;
      }
      
      return { user: data.user, error: null };
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
        throw error;
      }
      
      setUser(null);
      setSession(null);
      setProfile(null);
      setError(null);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    error,
    signIn,
    signOut,
  };
};
