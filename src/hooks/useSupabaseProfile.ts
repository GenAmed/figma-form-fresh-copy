
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
      if (!user) {
        if (mounted) {
          setProfile(null);
          setError(null);
        }
        return;
      }

      setProfileLoading(true);
      setError(null);

      try {
        console.log("🔍 Récupération du profil pour:", user.email);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (!mounted) return;

        if (error) {
          console.error("❌ Erreur lors de la récupération du profil:", error);
          setError(error.message);
          setProfile(null);
        } else if (data) {
          console.log("✅ Profil récupéré:", data);
          const profileData: UserProfile = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: (data.role === "admin" || data.role === "ouvrier") ? data.role : "ouvrier",
            avatar_url: data.avatar_url,
            phone: data.phone,
            active: data.active
          };
          setProfile(profileData);
        } else {
          console.log("ℹ️ Aucun profil trouvé pour cet utilisateur");
          setError("Profil non trouvé");
          setProfile(null);
        }
      } catch (error: any) {
        if (!mounted) return;
        console.error("❌ Erreur lors de la récupération du profil:", error);
        setError(error.message || "Erreur inconnue");
        setProfile(null);
      } finally {
        if (mounted) {
          setProfileLoading(false);
        }
      }
    };

    // Ne récupérer le profil que si l'auth n'est pas en cours de chargement et qu'il y a un utilisateur
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
