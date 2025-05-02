
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
    
    // Récupérer les données de l'utilisateur à créer
    const userData = await req.json();
    
    // Log pour debugging
    console.log("Attempting to create user:", JSON.stringify(userData));

    // Créer l'utilisateur avec l'API admin
    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.pin,
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        role: userData.role,
        pin: userData.pin,
        active: userData.active,
        phone: userData.phone || null,
      }
    });

    if (error) {
      console.error("Error creating user:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Insérer les données supplémentaires dans la table profiles si nécessaire
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone || null,
        pin: userData.pin
      });

    if (profileError) {
      console.error("Error creating profile:", profileError);
      // Continuer quand même car l'utilisateur a été créé
    }

    console.log("User created successfully:", data.user.id);
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
