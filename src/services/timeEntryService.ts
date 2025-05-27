
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface TimeEntry {
  id: string;
  user_id: string;
  worksite_id: string;
  date: string;
  start_time: string;
  end_time?: string;
  start_coordinates?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    address?: string;
  };
  end_coordinates?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    address?: string;
  };
  comment?: string;
  breaks?: Array<{
    startTime: string;
    endTime?: string;
    duration?: number;
  }>;
  status: 'active' | 'completed' | 'pending_sync';
  created_at: string;
  updated_at: string;
}

export const createTimeEntry = async (entry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at'>): Promise<TimeEntry> => {
  try {
    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        user_id: entry.user_id,
        worksite_id: entry.worksite_id,
        date: entry.date,
        start_time: entry.start_time,
        start_coordinates: entry.start_coordinates,
        comment: entry.comment,
        breaks: entry.breaks || [],
        status: entry.status
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du pointage:', error);
      throw error;
    }

    return data as TimeEntry;
  } catch (error) {
    console.error('Erreur lors de la création du pointage:', error);
    throw error;
  }
};

export const updateTimeEntry = async (id: string, updates: Partial<TimeEntry>): Promise<TimeEntry> => {
  try {
    const { data, error } = await supabase
      .from('time_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du pointage:', error);
      throw error;
    }

    return data as TimeEntry;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du pointage:', error);
    throw error;
  }
};

export const getActiveTimeEntry = async (userId: string, date: string): Promise<TimeEntry | null> => {
  try {
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      console.error('Erreur lors de la récupération du pointage actif:', error);
      return null;
    }

    return data as TimeEntry | null;
  } catch (error) {
    console.error('Erreur lors de la récupération du pointage actif:', error);
    return null;
  }
};

export const getUserTimeEntries = async (userId: string, startDate?: string, endDate?: string): Promise<TimeEntry[]> => {
  try {
    let query = supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des pointages:', error);
      throw error;
    }

    return (data || []) as TimeEntry[];
  } catch (error) {
    console.error('Erreur lors de la récupération des pointages:', error);
    throw error;
  }
};
