
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
          details: "Please make sure to set the SERVICE_ROLE_KEY secret in the Supabase dashboard"
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
    
    // Récupérer les données du chantier à créer
    const worksiteData = await req.json();
    
    // Log pour debugging
    console.log("Attempting to create worksite:", JSON.stringify(worksiteData));

    // Insérer le chantier dans la table worksites
    const { data, error } = await supabase
      .from('worksites')
      .insert({
        name: worksiteData.name,
        address: worksiteData.address,
        start_date: worksiteData.start_date,
        end_date: worksiteData.end_date,
        status: worksiteData.status
      })
      .select();

    if (error) {
      console.error("Error creating worksite:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log("Worksite created successfully:", data);
    return new Response(
      JSON.stringify({ data }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
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
