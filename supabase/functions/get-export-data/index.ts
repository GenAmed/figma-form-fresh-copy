
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = "https://jhxhhccqgbpfxwhbosdm.supabase.co";
const supabaseServiceRole = Deno.env.get("SERVICE_ROLE_KEY");

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    // Vérifier si la clé de service est disponible
    if (!supabaseServiceRole) {
      console.error("SERVICE_ROLE_KEY is not set");
      return new Response(
        JSON.stringify({ 
          error: "Configuration error: SERVICE_ROLE_KEY is not set",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Créer un client Supabase avec le rôle de service
    const supabase = createClient(supabaseUrl, supabaseServiceRole, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    const { filters } = await req.json();
    
    console.log("Filtres reçus:", JSON.stringify(filters));
    
    // Par défaut, récupérer toutes les données
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    let endDate = new Date();
    
    if (filters?.dateRange) {
      startDate = new Date(filters.dateRange.from);
      endDate = new Date(filters.dateRange.to);
    }

    // Format ISO pour les dates (YYYY-MM-DD)
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    // Récupérer les données des pointages (simulation pour l'exemple)
    const mockedData = [
      { employé: "Jean Dupont", chantier: "Bordeaux Centre", date: "02/05/2025", entrée: "08:00", sortie: "17:00", total: "9h" },
      { employé: "Marie Martin", chantier: "Mérignac", date: "02/05/2025", entrée: "07:30", sortie: "16:30", total: "9h" },
      { employé: "Pierre Durand", chantier: "Paris", date: "02/05/2025", entrée: "08:30", sortie: "18:00", total: "9.5h" },
      { employé: "Jean Dupont", chantier: "Bordeaux Centre", date: "01/05/2025", entrée: "08:15", sortie: "16:45", total: "8.5h" },
      { employé: "Sophie Lefebvre", chantier: "Lyon", date: "01/05/2025", entrée: "07:45", sortie: "17:15", total: "9.5h" },
    ];
    
    // Dans une version réelle, nous ferions une requête à la base de données
    // Exemple:
    // const { data: timeEntries, error } = await supabase
    //  .from('time_entries')
    //  .select('*, profiles(name), worksites(name)')
    //  .gte('date', formattedStartDate)
    //  .lte('date', formattedEndDate);

    // Filtrer par chantier si spécifié
    let filteredData = [...mockedData];
    if (filters?.selectedChantiers && filters.selectedChantiers.length > 0) {
      // En production, ajoutez cette condition à la requête SQL
      console.log(`Filtrage par chantiers: ${filters.selectedChantiers.join(', ')}`);
      
      // Simulation du filtrage
      // Dans une version réelle, on utiliserait les IDs pour filtrer dans la requête
    }

    // Filtrer par employé si spécifié
    if (filters?.selectedEmployes && filters.selectedEmployes.length > 0) {
      // En production, ajoutez cette condition à la requête SQL
      console.log(`Filtrage par employés: ${filters.selectedEmployes.join(', ')}`);
      
      // Simulation du filtrage
      // Dans une version réelle, on utiliserait les IDs pour filtrer dans la requête
    }

    return new Response(
      JSON.stringify({ 
        data: filteredData,
        filters: {
          startDate: formattedStartDate,
          endDate: formattedEndDate
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
