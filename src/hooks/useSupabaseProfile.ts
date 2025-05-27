
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
  const { user } = useSupabaseAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        console.log("🔍 Récupération du profil pour:", user.email);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("❌ Erreur lors de la récupération du profil:", error);
          setError(error.message);
          setProfile(null);
        } else if (data) {
          console.log("✅ Profil récupéré:", data);
          // Conversion sûre du type role
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
          setError(null);
        } else {
          console.log("ℹ️ Aucun profil trouvé pour cet utilisateur");
          setProfile(null);
          setError("Profil utilisateur non trouvé");
        }
      } catch (error: any) {
        console.error("❌ Erreur lors de la récupération du profil:", error);
        setError(error.message || "Erreur inconnue");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    user,
  };
};
