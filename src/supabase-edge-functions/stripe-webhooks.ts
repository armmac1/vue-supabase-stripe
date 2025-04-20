import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req)=>{
  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405
    });
  }

  const stripeSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const sigHeader = req.headers.get('Stripe-Signature');
  const rawBody = await req.text();

  if (!sigHeader || !stripeSecret) {
    return new Response('Missing signature or secret', {
      status: 400
    });
  }


  const [timestampPart, signaturePart] = sigHeader.split(',').map((part)=>part.split('='));
  const timestamp = timestampPart[1];
  const signature = signaturePart[1];
  const signedPayload = `${timestamp}.${rawBody}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(stripeSecret), {
    name: 'HMAC',
    hash: 'SHA-256'
  }, false, [
    'sign'
  ]);

  const signatureBytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload));
  const computedSignature = Array.from(new Uint8Array(signatureBytes)).map((b)=>b.toString(16).padStart(2, '0')).join('');

  if (computedSignature !== signature) {
    console.error('Invalid signature');
    return new Response('Invalid signature', {
      status: 400
    });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    return new Response('Invalid JSON body', {
      status: 400
    });
  }

  switch(event.type){
    case 'checkout.session.completed':
      {
        const session = event.data.object;
        const supabaseUserId = session.client_reference_id;
        const subscriptionId = session.subscription;

        if (!supabaseUserId || !subscriptionId) {
          console.error('Missing user ID or subscription ID');
          return new Response('Missing required fields', {
            status: 400
          });
        }
      
        const stripeRes = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
          headers: {
            Authorization: `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`
          }
        });

        const subscription = await stripeRes.json();
        const plan = subscription.items?.data?.[0]?.price?.lookup_key ?? 'unknown';
        const expiresAt = new Date(subscription.current_period_end * 1000);

        await supabase.from('subscriptions').insert({
          user_id: supabaseUserId,
          stripe_subscription_id: subscription.id,
          plan,
          status: subscription.status,
          created_at: new Date(),
          expires_at: expiresAt
        });

        break;
      }
    case 'customer.subscription.updated':
      {
        const subscription = event.data.object;
        const customerId = subscription.customer;
      
        const { data: profile } = await supabase.from('profiles').select('id').eq('stripe_customer_id', customerId).maybeSingle();

        if (!profile) {
          console.error('User not found for subscription update', customerId);
          return new Response('User not found', {
            status: 404
          });
        }

        const plan = subscription.items?.data?.[0]?.price?.lookup_key ?? 'unknown';
        const expiresAt = new Date(subscription.current_period_end * 1000);
        
        await supabase.from('subscriptions').update({
          plan,
          status: subscription.status,
          expires_at: expiresAt
        }).eq('stripe_subscription_id', subscription.id);
        break;
      }
    case 'customer.subscription.deleted':
      {
        const subscription = event.data.object;
        await supabase.from('subscriptions').delete().eq('stripe_subscription_id', subscription.id);
        break;
      }
    default:
      console.log(`Unhandled event type: ${event.type}`);
      return new Response('Unhandled event', {
        status: 400
      });
  }

  return new Response('Event processed', {
    status: 200
  });
});
