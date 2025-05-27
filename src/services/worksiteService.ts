
import { supabase } from "@/integrations/supabase/client";

export interface Worksite {
  id: string;
  name: string;
  address: string;
  status: string;
  start_date?: string;
  end_date?: string;
}

export const getWorksites = async (): Promise<Worksite[]> => {
  try {
    console.log("🔍 Récupération des chantiers...");
    
    const { data, error } = await supabase
      .from('worksites')
      .select('*')
      .order('name');

    if (error) {
      console.error('❌ Erreur lors de la récupération des chantiers:', error);
      throw error;
    }

    console.log("✅ Chantiers récupérés:", data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des chantiers:', error);
    // Ne pas lancer l'erreur pour éviter les notifications d'erreur
    return [];
  }
};

export const getWorksiteById = async (id: string): Promise<Worksite | null> => {
  try {
    console.log("🔍 Récupération du chantier:", id);
    
    const { data, error } = await supabase
      .from('worksites')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('❌ Erreur lors de la récupération du chantier:', error);
      return null;
    }

    if (data) {
      console.log("✅ Chantier récupéré:", data);
      return data;
    } else {
      console.log("ℹ️ Chantier non trouvé:", id);
      return null;
    }
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération du chantier:', error);
    return null;
  }
};

export const createWorksite = async (worksite: Omit<Worksite, 'id'>): Promise<Worksite> => {
  try {
    console.log("🔍 Création du chantier:", worksite.name);
    
    const { data, error } = await supabase
      .from('worksites')
      .insert(worksite)
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la création du chantier:', error);
      throw error;
    }

    console.log("✅ Chantier créé:", data);
    return data;
  } catch (error: any) {
    console.error('❌ Erreur lors de la création du chantier:', error);
    throw error;
  }
};

export const updateWorksite = async (id: string, updates: Partial<Worksite>): Promise<Worksite> => {
  try {
    console.log("🔍 Mise à jour du chantier:", id);
    
    const { data, error } = await supabase
      .from('worksites')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de la mise à jour du chantier:', error);
      throw error;
    }

    console.log("✅ Chantier mis à jour:", data);
    return data;
  } catch (error: any) {
    console.error('❌ Erreur lors de la mise à jour du chantier:', error);
    throw error;
  }
};

export const deleteWorksite = async (id: string): Promise<void> => {
  try {
    console.log("🔍 Suppression du chantier:", id);
    
    const { error } = await supabase
      .from('worksites')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Erreur lors de la suppression du chantier:', error);
      throw error;
    }

    console.log("✅ Chantier supprimé");
  } catch (error: any) {
    console.error('❌ Erreur lors de la suppression du chantier:', error);
    throw error;
  }
};
