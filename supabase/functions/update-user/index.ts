
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
    
    // Récupérer les données de l'utilisateur à mettre à jour
    const userData = await req.json();
    const { id, ...updateData } = userData;
    
    // Log pour debugging
    console.log("Mise à jour de l'utilisateur:", id);
    console.log("Données:", JSON.stringify(updateData));

    // Mettre à jour l'utilisateur dans la table profiles
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log("Utilisateur mis à jour avec succès:", data);
    return new Response(
      JSON.stringify({ data }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erreur inattendue:", error);
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
