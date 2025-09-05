import React from 'react'
import { Check, X, Crown } from 'lucide-react'
import { Card } from './ui/Card'
import { PrimaryButton } from './ui/PrimaryButton'
import { useUserStore } from '../stores/useUserStore'

interface SubscriptionModalProps {
  onClose: () => void
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose }) => {
  const { user, upgradeToPermium } = useUserStore()

  const handleUpgrade = () => {
    // In a real app, this would integrate with Stripe
    upgradeToPermium()
    alert('Upgraded to Premium! 🎉')
    onClose()
  }

  const features = [
    { name: 'Basic Rights & Scripts', free: true, premium: true },
    { name: 'One-tap Recording', free: true, premium: true },
    { name: 'Encounter Summaries', free: true, premium: true },
    { name: 'State-Specific Laws', free: false, premium: true },
    { name: 'Multilingual Support', free: false, premium: true },
    { name: 'Encrypted Storage', free: false, premium: true },
    { name: 'Advanced Scripts', free: false, premium: true },
    { name: 'Priority Support', free: false, premium: true },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-lg w-full bg-white p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-accent" />
            <h3 className="text-xl font-bold text-neutral-900">
              Upgrade to Premium
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Status */}
        {user.subscriptionStatus === 'premium' ? (
          <div className="bg-accent/10 p-4 rounded-lg mb-6 text-center">
            <Crown className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-accent font-semibold">You're already a Premium member!</p>
          </div>
        ) : (
          <>
            {/* Pricing */}
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-neutral-900 mb-2">
                $4.99<span className="text-lg font-normal text-neutral-600">/month</span>
              </div>
              <p className="text-neutral-600">
                Full access to all CitizenShield features
              </p>
            </div>

            {/* Features Comparison */}
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-neutral-700 pb-2 border-b">
                <div>Features</div>
                <div className="text-center">Free</div>
                <div className="text-center">Premium</div>
              </div>
              
              {features.map((feature, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-neutral-900">{feature.name}</div>
                  <div className="text-center">
                    {feature.free ? (
                      <Check className="w-4 h-4 text-accent mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-neutral-400 mx-auto" />
                    )}
                  </div>
                  <div className="text-center">
                    {feature.premium ? (
                      <Check className="w-4 h-4 text-accent mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-neutral-400 mx-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <PrimaryButton 
              onClick={handleUpgrade}
              className="w-full bg-accent hover:bg-accent/90 mb-4"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to Premium
            </PrimaryButton>
            
            <p className="text-xs text-neutral-500 text-center">
              Cancel anytime. No hidden fees.
            </p>
          </>
        )}
      </Card>
    </div>
  )
}