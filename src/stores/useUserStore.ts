import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser, 
  getUserProfile, 
  updateUserProfile,
  createUserProfile,
  getUserEncounters,
  createEncounter as createEncounterAPI,
  type User as SupabaseUser,
  type Encounter as SupabaseEncounter
} from '../services/supabase'

export interface User {
  id: string
  email: string
  subscriptionStatus: 'free' | 'premium'
  statePreference: string
  languagePreference: 'en' | 'es'
}

export interface Encounter {
  id: string
  userId: string
  timestamp: Date
  location?: string
  recordingUrl?: string
  summaryContent: string
  sharedWith: string[]
  notes?: string
}

interface UserState {
  user: User | null
  encounters: Encounter[]
  isLoading: boolean
  error: string | null
  
  // Auth actions
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loadUser: () => Promise<void>
  
  // User actions
  updateUser: (updates: Partial<User>) => Promise<void>
  upgradeToPermium: () => void
  
  // Encounter actions
  loadEncounters: () => Promise<void>
  addEncounter: (encounter: Omit<Encounter, 'id' | 'userId'>) => Promise<Encounter>
  
  // Utility actions
  setError: (error: string | null) => void
  clearError: () => void
}

const defaultUser: User = {
  id: '1',
  email: 'demo@citizenshield.com',
  subscriptionStatus: 'free',
  statePreference: 'CA',
  languagePreference: 'en'
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: defaultUser, // Start with demo user for development
      encounters: [],
      isLoading: false,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await signIn(email, password)
          if (error) throw error
          
          if (data.user) {
            const { data: profile } = await getUserProfile(data.user.id)
            if (profile) {
              set({ 
                user: {
                  id: profile.id,
                  email: profile.email,
                  subscriptionStatus: profile.subscription_status,
                  statePreference: profile.state_preference,
                  languagePreference: profile.language_preference
                }
              })
            }
          }
        } catch (error: any) {
          set({ error: error.message })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      signUp: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await signUp(email, password)
          if (error) throw error
          
          if (data.user) {
            // Create user profile
            await createUserProfile(data.user.id, {
              email,
              subscription_status: 'free',
              state_preference: 'CA',
              language_preference: 'en'
            })
            
            set({ 
              user: {
                id: data.user.id,
                email,
                subscriptionStatus: 'free',
                statePreference: 'CA',
                languagePreference: 'en'
              }
            })
          }
        } catch (error: any) {
          set({ error: error.message })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      signOut: async () => {
        set({ isLoading: true })
        try {
          await signOut()
          set({ user: null, encounters: [] })
        } catch (error: any) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },

      loadUser: async () => {
        set({ isLoading: true })
        try {
          const user = await getCurrentUser()
          if (user) {
            const { data: profile } = await getUserProfile(user.id)
            if (profile) {
              set({ 
                user: {
                  id: profile.id,
                  email: profile.email,
                  subscriptionStatus: profile.subscription_status,
                  statePreference: profile.state_preference,
                  languagePreference: profile.language_preference
                }
              })
            }
          }
        } catch (error: any) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },

      updateUser: async (updates: Partial<User>) => {
        const { user } = get()
        if (!user) return
        
        set({ isLoading: true })
        try {
          const { data, error } = await updateUserProfile(user.id, {
            subscription_status: updates.subscriptionStatus,
            state_preference: updates.statePreference,
            language_preference: updates.languagePreference
          })
          
          if (error) throw error
          
          set({ 
            user: { 
              ...user, 
              ...updates 
            } 
          })
        } catch (error: any) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },

      upgradeToPermium: () => {
        const { user } = get()
        if (user) {
          set({ 
            user: { 
              ...user, 
              subscriptionStatus: 'premium' 
            } 
          })
        }
      },

      loadEncounters: async () => {
        const { user } = get()
        if (!user) return
        
        set({ isLoading: true })
        try {
          const { data, error } = await getUserEncounters(user.id)
          if (error) throw error
          
          const encounters = data?.map(encounter => ({
            id: encounter.id,
            userId: encounter.user_id,
            timestamp: new Date(encounter.timestamp),
            location: encounter.location,
            recordingUrl: encounter.recording_url,
            summaryContent: encounter.summary_content,
            sharedWith: encounter.shared_with,
            notes: encounter.notes
          })) || []
          
          set({ encounters })
        } catch (error: any) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },

      addEncounter: async (encounter: Omit<Encounter, 'id' | 'userId'>) => {
        const { user } = get()
        if (!user) throw new Error('User not authenticated')
        
        try {
          const { data, error } = await createEncounterAPI({
            user_id: user.id,
            timestamp: encounter.timestamp.toISOString(),
            location: encounter.location,
            recording_url: encounter.recordingUrl,
            summary_content: encounter.summaryContent,
            shared_with: encounter.sharedWith,
            notes: encounter.notes
          })
          
          if (error) throw error
          
          const newEncounter: Encounter = {
            id: data.id,
            userId: data.user_id,
            timestamp: new Date(data.timestamp),
            location: data.location,
            recordingUrl: data.recording_url,
            summaryContent: data.summary_content,
            sharedWith: data.shared_with,
            notes: data.notes
          }
          
          set(state => ({ 
            encounters: [newEncounter, ...state.encounters] 
          }))
          
          return newEncounter
        } catch (error: any) {
          set({ error: error.message })
          throw error
        }
      },

      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'user-store',
      partialize: (state) => ({ 
        user: state.user,
        encounters: state.encounters 
      })
    }
  )
)
