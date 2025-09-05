import React, { useState } from 'react'
import { Header } from './components/Header'
import { Dashboard } from './components/Dashboard'
import { RightsGuide } from './components/RightsGuide'
import { RecordingInterface } from './components/RecordingInterface'
import { SubscriptionModal } from './components/SubscriptionModal'
import { useUserStore } from './stores/useUserStore'

type View = 'dashboard' | 'rights' | 'recording'

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const { user } = useUserStore()

  const handlePremiumFeature = () => {
    if (!user?.subscriptionStatus || user.subscriptionStatus === 'free') {
      setShowSubscriptionModal(true)
      return false
    }
    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className="max-w-screen-md mx-auto min-h-screen">
        <Header 
          currentView={currentView} 
          onViewChange={setCurrentView}
          onShowSubscription={() => setShowSubscriptionModal(true)}
        />
        
        <main className="px-4 pb-8">
          {currentView === 'dashboard' && (
            <Dashboard 
              onViewChange={setCurrentView}
              onPremiumFeature={handlePremiumFeature}
            />
          )}
          {currentView === 'rights' && (
            <RightsGuide onPremiumFeature={handlePremiumFeature} />
          )}
          {currentView === 'recording' && (
            <RecordingInterface onPremiumFeature={handlePremiumFeature} />
          )}
        </main>

        {showSubscriptionModal && (
          <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
        )}
      </div>
    </div>
  )
}

export default App