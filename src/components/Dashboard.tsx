import React from 'react'
import { Play, FileText, Share2, ChevronRight, Clock, MapPin } from 'lucide-react'
import { Card } from './ui/Card'
import { PrimaryButton } from './ui/PrimaryButton'
import { useUserStore } from '../stores/useUserStore'

interface DashboardProps {
  onViewChange: (view: 'dashboard' | 'rights' | 'recording') => void
  onPremiumFeature: () => boolean
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange, onPremiumFeature }) => {
  const { user, encounters } = useUserStore()

  const handleQuickRecord = () => {
    onViewChange('recording')
  }

  const handleViewRights = () => {
    onViewChange('rights')
  }

  const handleStateSpecificRights = () => {
    if (onPremiumFeature()) {
      // Show state-specific content
      onViewChange('rights')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome to CitizenShield
        </h2>
        <p className="text-white/80 text-base">
          Know your rights, protect yourself
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="p-6 bg-white/10 border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Quick Record</h3>
            <Play className="w-6 h-6 text-accent" />
          </div>
          <p className="text-white/70 text-sm mb-4">
            One-tap recording for immediate documentation
          </p>
          <PrimaryButton 
            onClick={handleQuickRecord}
            className="w-full bg-accent hover:bg-accent/90"
          >
            Start Recording
          </PrimaryButton>
        </Card>

        <Card className="p-6 bg-white/10 border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Know Your Rights</h3>
            <FileText className="w-6 h-6 text-blue-300" />
          </div>
          <p className="text-white/70 text-sm mb-4">
            Access your rights and scripts in {user.languagePreference === 'en' ? 'English' : 'Spanish'}
          </p>
          <PrimaryButton 
            onClick={handleViewRights}
            variant="outline"
            className="w-full"
          >
            View Rights Guide
          </PrimaryButton>
        </Card>
      </div>

      {/* State-Specific Section */}
      <Card className="p-6 bg-white/5 border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {user.statePreference} State Laws
            </h3>
            {user.subscriptionStatus === 'free' && (
              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                Premium Feature
              </span>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-white/60" />
        </div>
        <p className="text-white/70 text-sm mb-4">
          Access state-specific laws and procedures
        </p>
        <button
          onClick={handleStateSpecificRights}
          className="text-accent hover:text-accent/80 text-sm font-medium"
        >
          Learn More →
        </button>
      </Card>

      {/* Recent Encounters */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Encounters</h3>
        {encounters.length > 0 ? (
          <div className="space-y-3">
            {encounters.slice(0, 3).map((encounter) => (
              <Card key={encounter.id} className="p-4 bg-white/5 border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Clock className="w-4 h-4" />
                      {encounter.timestamp.toLocaleDateString()}
                    </div>
                    {encounter.location && (
                      <div className="flex items-center gap-2 text-white/60 text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        {encounter.location}
                      </div>
                    )}
                  </div>
                  <Share2 className="w-4 h-4 text-white/60" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 bg-white/5 border-white/20 text-center">
            <FileText className="w-8 h-8 text-white/40 mx-auto mb-3" />
            <p className="text-white/60 text-sm">
              No encounters recorded yet
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
