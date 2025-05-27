
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "ouvrier" | "admin";
  avatar_url?: string;
  phone?: string;
  active: boolean;
}

export const useSupabaseProfile = () => {
  const { user, loading: authLoading } = useSupabaseAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      // Reset des états précédents
      setError(null);
      
      if (!user) {
        if (mounted) {
          setProfile(null);
          setProfileLoading(false);
        }
        return;
      }

      setProfileLoading(true);

      try {
        console.log("🔍 [useSupabaseProfile] Récupération profil pour:", user.email);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (!mounted) return;

        if (error) {
          console.error("❌ [useSupabaseProfile] Erreur Supabase:", error);
          setError(`Erreur de base de données: ${error.message}`);
          setProfile(null);
        } else if (data) {
          console.log("✅ [useSupabaseProfile] Profil trouvé:", data);
          const profileData: UserProfile = {
            id: data.id,
            name: data.name || 'Utilisateur',
            email: data.email,
            role: (data.role === "admin" || data.role === "ouvrier") ? data.role : "ouvrier",
            avatar_url: data.avatar_url,
            phone: data.phone,
            active: data.active !== false // Par défaut true si null/undefined
          };
          setProfile(profileData);
          setError(null);
        } else {
          console.log("⚠️ [useSupabaseProfile] Aucun profil trouvé");
          setError("Profil utilisateur non trouvé");
          setProfile(null);
        }
      } catch (error: any) {
        if (!mounted) return;
        console.error("❌ [useSupabaseProfile] Exception:", error);
        setError(`Erreur de connexion: ${error.message || "Erreur inconnue"}`);
        setProfile(null);
      } finally {
        if (mounted) {
          setProfileLoading(false);
        }
      }
    };

    // Ne fetch que si l'auth n'est pas en cours de chargement
    if (!authLoading) {
      fetchProfile();
    }

    return () => {
      mounted = false;
    };
  }, [user, authLoading]);

  return {
    profile,
    loading: authLoading || profileLoading,
    error,
    user,
  };
};
