import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    price: 4.99,
    interval: 'month',
    features: [
      'State-specific legal information',
      'Multilingual support (English & Spanish)',
      'Encrypted cloud storage for recordings',
      'Advanced sharing options',
      'Priority customer support'
    ]
  },
  {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    price: 49.99,
    interval: 'year',
    features: [
      'State-specific legal information',
      'Multilingual support (English & Spanish)',
      'Encrypted cloud storage for recordings',
      'Advanced sharing options',
      'Priority customer support',
      '2 months free (save 17%)'
    ]
  }
]

// Create checkout session
export const createCheckoutSession = async (planId: string, userId: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId,
        userId,
        successUrl: `${window.location.origin}/subscription-success`,
        cancelUrl: `${window.location.origin}/subscription-cancelled`,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const { sessionId } = await response.json()
    
    const stripe = await stripePromise
    if (!stripe) {
      throw new Error('Stripe failed to load')
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error('Failed to start checkout process')
  }
}

// Create customer portal session for managing subscription
export const createCustomerPortalSession = async (customerId: string) => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: window.location.origin,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create portal session')
    }

    const { url } = await response.json()
    window.location.href = url
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw new Error('Failed to open customer portal')
  }
}

// Mock functions for development (replace with actual API calls in production)
export const mockCreateCheckoutSession = async (planId: string, userId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In development, just simulate successful upgrade
  console.log(`Mock checkout for plan ${planId} and user ${userId}`)
  return { success: true, message: 'Subscription activated (mock)' }
}

export const mockCreatePortalSession = async (customerId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  console.log(`Mock portal session for customer ${customerId}`)
  alert('Customer portal would open here (mock)')
}

// Validate subscription status
export const validateSubscription = async (userId: string) => {
  try {
    const response = await fetch(`/api/validate-subscription/${userId}`)
    
    if (!response.ok) {
      throw new Error('Failed to validate subscription')
    }

    const { isActive, plan, expiresAt } = await response.json()
    
    return {
      isActive,
      plan,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    }
  } catch (error) {
    console.error('Error validating subscription:', error)
    return { isActive: false, plan: null, expiresAt: null }
  }
}

// Mock subscription validation for development
export const mockValidateSubscription = async (userId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Return mock data based on user ID for testing
  const mockSubscriptions: Record<string, any> = {
    '1': { isActive: false, plan: null, expiresAt: null }, // Free user
    '2': { isActive: true, plan: 'premium_monthly', expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // Premium user
  }
  
  return mockSubscriptions[userId] || { isActive: false, plan: null, expiresAt: null }
}
