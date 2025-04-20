
import { supabase } from '../supabase'
import stripePromise from '../stripe'


const PRODUCT_IDS = {
    starter: 'prod_S9EKlWm1zOojFa',
    pro: 'prod_S9EL2nl0C7GLAk',
    enterprise: 'prod_S9EM8Fge9G2OSi'
}


export async function createCheckoutSession(lookupKey) {
    try {

        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
            throw new Error('User not authenticated');
        }


        const jwt = sessionData.session.access_token;


        const response = await fetch('https://geyjmgyqcstpqbsasalv.supabase.co/functions/v1/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
                lookup_key: lookupKey,
                successUrl: window.location.origin,
                cancelUrl: window.location.origin
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create checkout session');
        }

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
}


export async function redirectToCheckout(urlOrSessionId) {
    try {

        if (urlOrSessionId.startsWith('http')) {
            window.location.href = urlOrSessionId;
            return;
        }


        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({ sessionId: urlOrSessionId });

        if (error) throw error;
    } catch (error) {
        console.error('Error redirecting to checkout:', error);
        throw error;
    }
}


export function getProductId(tierName) {
    const tier = tierName.toLowerCase();
    return PRODUCT_IDS[tier] || null;
} 