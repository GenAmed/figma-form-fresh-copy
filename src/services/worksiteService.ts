
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
    const { data, error } = await supabase
      .from('worksites')
      .select('*')
      .eq('status', 'active')
      .order('name');

    if (error) {
      console.error('Erreur lors de la récupération des chantiers:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des chantiers:', error);
    throw error;
  }
};

export const getWorksiteById = async (id: string): Promise<Worksite | null> => {
  try {
    const { data, error } = await supabase
      .from('worksites')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du chantier:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération du chantier:', error);
    return null;
  }
};
