
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Récupération du profil pour:", user.email);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("❌ Erreur lors de la récupération du profil:", error);
          setProfile(null);
        } else {
          console.log("✅ Profil récupéré:", data);
          setProfile(data);
        }
      } catch (error) {
        console.error("❌ Erreur lors de la récupération du profil:", error);
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
    user,
  };
};
