
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Attempting sign in for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Sign in error:', error);
      throw error;
    }
    
    // Après la connexion réussie, récupérer le profil utilisateur et mettre à jour les métadonnées
    if (data.user) {
      console.log('✅ Sign in successful, fetching user profile...');
      
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile && !profileError) {
          console.log('📝 Updating user metadata with role:', profile.role);
          
          // Mettre à jour les métadonnées utilisateur avec le rôle
          const { error: updateError } = await supabase.auth.updateUser({
            data: { role: profile.role }
          });

          if (updateError) {
            console.error('❌ Error updating user metadata:', updateError);
          } else {
            console.log('✅ User metadata updated successfully');
          }
        }
      } catch (error) {
        console.error('❌ Error fetching user profile:', error);
      }
    }
    
    console.log('✅ Sign in successful:', data.user?.email);
    return data;
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    console.log('📝 Attempting sign up for:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    
    if (error) {
      console.error('❌ Sign up error:', error);
      throw error;
    }
    
    console.log('✅ Sign up successful:', data.user?.email);
    return data;
  };

  const signOut = async () => {
    console.log('🚪 Signing out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
    console.log('✅ Sign out successful');
  };

  const resetPassword = async (email: string) => {
    console.log('🔄 Requesting password reset for:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error('❌ Password reset error:', error);
      throw error;
    }
    console.log('✅ Password reset email sent');
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
