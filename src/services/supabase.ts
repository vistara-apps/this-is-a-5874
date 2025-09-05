import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  subscription_status: 'free' | 'premium'
  state_preference: string
  language_preference: 'en' | 'es'
  created_at: string
  updated_at: string
}

export interface Encounter {
  id: string
  user_id: string
  timestamp: string
  location?: string
  recording_url?: string
  summary_content: string
  shared_with: string[]
  notes?: string
  created_at: string
}

export interface RightsContent {
  id: string
  state: string
  language: 'en' | 'es'
  rights_text: string
  script_text: string
  guide_steps: string[]
  created_at: string
  updated_at: string
}

// Auth functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// User profile functions
export const createUserProfile = async (userId: string, profile: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ id: userId, ...profile }])
    .select()
    .single()
  
  return { data, error }
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

// Encounter functions
export const createEncounter = async (encounter: Omit<Encounter, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('encounters')
    .insert([encounter])
    .select()
    .single()
  
  return { data, error }
}

export const getUserEncounters = async (userId: string) => {
  const { data, error } = await supabase
    .from('encounters')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const updateEncounter = async (encounterId: string, updates: Partial<Encounter>) => {
  const { data, error } = await supabase
    .from('encounters')
    .update(updates)
    .eq('id', encounterId)
    .select()
    .single()
  
  return { data, error }
}

// Rights content functions
export const getRightsContent = async (state: string, language: 'en' | 'es' = 'en') => {
  const { data, error } = await supabase
    .from('rights_content')
    .select('*')
    .eq('state', state)
    .eq('language', language)
    .single()
  
  return { data, error }
}

// File upload functions
export const uploadRecording = async (file: File, userId: string, encounterId: string) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${encounterId}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('recordings')
    .upload(fileName, file)
  
  if (error) return { data: null, error }
  
  const { data: { publicUrl } } = supabase.storage
    .from('recordings')
    .getPublicUrl(fileName)
  
  return { data: { path: fileName, url: publicUrl }, error: null }
}
