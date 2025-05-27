
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Fonction pour mettre à jour l'état d'authentification
    const setAuthData = (session: Session | null) => {
      if (!mounted) return;
      
      console.log('🔐 [useSupabaseAuth] Setting auth data:', session?.user?.email || 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 [useSupabaseAuth] Auth state changed:', event, 'User:', session?.user?.email || 'No user');
        setAuthData(session);
      }
    );

    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ [useSupabaseAuth] Erreur lors de la récupération de la session:', error);
      } else {
        console.log('🔍 [useSupabaseAuth] Session initiale récupérée:', session?.user?.email || 'Aucune session');
      }
      setAuthData(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 [signIn] Attempting sign in for:', email);
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ [signIn] Sign in error:', error);
      setLoading(false);
      throw error;
    }
    
    console.log('✅ [signIn] Sign in successful:', data.user?.email, 'Session:', !!data.session);
    return data;
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    console.log('📝 [signUp] Attempting sign up for:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    
    if (error) {
      console.error('❌ [signUp] Sign up error:', error);
      throw error;
    }
    
    console.log('✅ [signUp] Sign up successful:', data.user?.email);
    return data;
  };

  const signOut = async () => {
    console.log('🚪 [signOut] Signing out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ [signOut] Sign out error:', error);
      throw error;
    }
    console.log('✅ [signOut] Sign out successful');
  };

  const resetPassword = async (email: string) => {
    console.log('🔄 [resetPassword] Requesting password reset for:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error('❌ [resetPassword] Password reset error:', error);
      throw error;
    }
    console.log('✅ [resetPassword] Password reset email sent');
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
};
