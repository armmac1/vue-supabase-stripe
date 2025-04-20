import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@latest";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
  apiVersion: "2022-11-15"
});

function corsHeaders(req) {
  const origin = req.headers.get("Origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": req.headers.get("Access-Control-Request-Headers") || "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin"
  };
}

Deno.serve(async (req)=>{
  const headers = corsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers
    });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers
    });
  }

  try {
    // User auth supabase client
    const authSupabase = createClient(
      Deno.env.get("SUPABASE_URL"), 
      Deno.env.get("SUPABASE_ANON_KEY"), 
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization")
          }
        }
      }
    );

    // Service supabase client - for editing tables
    const serviceSupabase = createClient(
      Deno.env.get("SUPABASE_URL"), 
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    const { data: { user }, error: userError } = await authSupabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({
        error: "Unauthorized"
      }), {
        status: 401,
        headers
      });
    }

    const { lookup_key, successUrl, cancelUrl } = await req.json();

    if (!lookup_key || !successUrl || !cancelUrl) {
      return new Response(JSON.stringify({
        error: "Missing parameters"
      }), {
        status: 400,
        headers
      });
    }

    const { data: profile } = await serviceSupabase.from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle();
    let stripeCustomerId = profile?.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id
        }
      });
      stripeCustomerId = customer.id;
      if (!profile) {
        await serviceSupabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          stripe_customer_id: stripeCustomerId
        });
      } else {
        await serviceSupabase.from("profiles").update({
          stripe_customer_id: stripeCustomerId
        }).eq("id", user.id);
      }
    }

    const prices = await stripe.prices.list({
      lookup_keys: [
        lookup_key
      ],
      expand: [
        "data.product"
      ]
    });

    const price = prices.data?.[0];

    if (!price) {
      return new Response(JSON.stringify({
        error: "Price not found"
      }), {
        status: 404,
        headers
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      client_reference_id: user.id,
      billing_address_collection: "auto",
      line_items: [
        {
          price: price.id,
          quantity: 1
        }
      ],
      mode: "subscription",
      success_url: `${successUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cancelUrl}/cancel.html`
    });
    
    return new Response(JSON.stringify({
      url: session.url
    }), {
      status: 200,
      headers: {
        ...headers,
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 400,
      headers: {
        ...headers,
        "Content-Type": "application/json"
      }
    });
  }
});
