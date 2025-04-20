import { ref, computed } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'
const user = ref(null)

const subscription = ref(undefined)
const isLoadingSubscription = ref(false)
const isLoadingUser = ref(false)
const userLoginError = ref(null)
export function useSession() {
    const router = useRouter()

    async function fetchUser() {
        try {
            const { data } = await supabase.auth.getUser()

            user.value = data.user
        } catch (error) {
            console.error('Error fetching user:', error)
        }
    }

    async function fetchSubscription() {
        if (!user.value) return

        try {
            isLoadingSubscription.value = true

            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.value.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            if (error) {
                console.error('Error fetching subscription:', error)
                subscription.value = null
            } else {
                subscription.value = data
                console.log('Subscription data:', data)
            }
        } catch (error) {
            console.error('Error in fetchSubscription:', error)
            subscription.value = null
        } finally {
            isLoadingSubscription.value = true
        }
    }

    const hasActiveSubscription = computed(() => {
        return subscription.value && subscription.value.status === 'active'
    })

    const handleLogin = async (email, password) => {
        isLoadingUser.value = true
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (loginError) {
            userLoginError.value = loginError.message
        }

        user.value = data.user;
        isLoadingUser.value = false
        await fetchSubscription()

        if (subscription.value) {
            return router.push('/members')
        }

        router.push('/pricing')
    }

    const clearUserSession = async () => {
        await supabase.auth.signOut()
        user.value = null
        subscription.value = null
    }

    return {
        user,
        subscription,
        isLoadingSubscription,
        hasActiveSubscription,
        fetchSubscription,
        fetchUser,
        clearUserSession,
        handleLogin,
        userLoginError,
        isLoadingUser
    }
} 