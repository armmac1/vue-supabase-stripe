import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';
import PricingCards from '../components/PricingCards.vue';
import SignUpForm from '../components/SignUpForm.vue';
import CheckoutSuccess from '../components/CheckoutSuccess.vue';
import CheckoutCancel from '../components/CheckoutCancel.vue';
import MembersArea from '../components/MembersArea.vue';
import { supabase } from '../supabase';


const routes = [
    { path: '/', name: 'Login', component: LoginForm },
    { path: '/signup', name: 'SignUp', component: SignUpForm },
    { path: '/pricing', name: 'Pricing', component: PricingCards },
    { path: '/success', name: 'CheckoutSuccess', component: CheckoutSuccess },
    { path: '/cancel', name: 'CheckoutCancel', component: CheckoutCancel },
    {
        path: '/members',
        name: 'MembersArea',
        component: MembersArea,
        meta: {
            requiresAuth: true,
            requiresSubscription: true
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


router.beforeEach(async (to, from, next) => {

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresSubscription = to.matched.some(record => record.meta.requiresSubscription);

    if (!requiresAuth && !requiresSubscription) {

        return next();
    }


    const { data: { session } } = await supabase.auth.getSession();
    const isAuthenticated = !!session;

    if (requiresAuth && !isAuthenticated) {

        return next({ name: 'Login' });
    }


    if (requiresSubscription) {

        const { data: subscription, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        const hasActiveSubscription = subscription && subscription.status === 'active';

        if (!hasActiveSubscription) {

            return next({ name: 'Pricing' });
        }
    }


    next();
});

export default router; 