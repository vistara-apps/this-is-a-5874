import React from 'react'
import { Shield, Menu, User, Settings } from 'lucide-react'
import { useUserStore } from '../stores/useUserStore'

interface HeaderProps {
  currentView: string
  onViewChange: (view: 'dashboard' | 'rights' | 'recording') => void
  onShowSubscription: () => void
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, onShowSubscription }) => {
  const { user } = useUserStore()

  return (
    <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onViewChange('dashboard')}
          >
            <Shield className="w-8 h-8 text-white" />
            <h1 className="text-xl font-bold text-white">CitizenShield</h1>
          </div>

          <div className="flex items-center gap-2">
            {user.subscriptionStatus === 'premium' && (
              <span className="px-2 py-1 bg-accent text-white text-xs rounded-full">
                Premium
              </span>
            )}
            
            <button 
              onClick={onShowSubscription}
              className="p-2 text-white/80 hover:text-white transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="mt-4">
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                currentView === 'dashboard' 
                  ? 'bg-white text-primary' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onViewChange('rights')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                currentView === 'rights' 
                  ? 'bg-white text-primary' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Rights
            </button>
            <button
              onClick={() => onViewChange('recording')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                currentView === 'recording' 
                  ? 'bg-white text-primary' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Record
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}