import { useState } from 'react'

export interface User {
  userId: string
  email: string
  subscriptionStatus: 'free' | 'premium'
  statePreference: string
  languagePreference: 'en' | 'es'
}

export interface Encounter {
  encounterId: string
  userId: string
  timestamp: Date
  location?: string
  recordingUrl?: string
  summaryContent: string
  sharedWith: string[]
}

const defaultUser: User = {
  userId: '1',
  email: 'user@example.com',
  subscriptionStatus: 'free',
  statePreference: 'CA',
  languagePreference: 'en'
}

export const useUserStore = () => {
  const [user, setUser] = useState<User>(defaultUser)
  const [encounters, setEncounters] = useState<Encounter[]>([])

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  const addEncounter = (encounter: Omit<Encounter, 'encounterId' | 'userId'>) => {
    const newEncounter: Encounter = {
      ...encounter,
      encounterId: Date.now().toString(),
      userId: user.userId
    }
    setEncounters(prev => [newEncounter, ...prev])
    return newEncounter
  }

  const upgradeToPermium = () => {
    updateUser({ subscriptionStatus: 'premium' })
  }

  return {
    user,
    encounters,
    updateUser,
    addEncounter,
    upgradeToPermium
  }
}