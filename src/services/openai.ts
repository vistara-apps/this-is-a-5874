import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
})

export interface ScriptRequest {
  situation: string
  state: string
  language: 'en' | 'es'
}

export interface SummaryRequest {
  encounterDetails: {
    timestamp: string
    location?: string
    duration: number
    notes?: string
  }
  language: 'en' | 'es'
}

// Generate what-to-say scripts for police encounters
export const generateScript = async ({ situation, state, language }: ScriptRequest) => {
  try {
    const prompt = `Generate a clear, concise script for a citizen during a police encounter in ${state}. 
    Situation: ${situation}
    Language: ${language === 'es' ? 'Spanish' : 'English'}
    
    Provide:
    1. What to say (2-3 key phrases)
    2. What NOT to say (2-3 things to avoid)
    3. Key rights to remember (2-3 points)
    
    Keep it practical and legally sound. Format as JSON with keys: whatToSay, whatNotToSay, keyRights`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a legal rights advisor helping citizens understand their rights during police encounters. Provide accurate, practical advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    })

    const response = completion.choices[0]?.message?.content
    if (!response) throw new Error('No response from OpenAI')

    return JSON.parse(response)
  } catch (error) {
    console.error('Error generating script:', error)
    throw new Error('Failed to generate script')
  }
}

// Generate encounter summary for sharing
export const generateEncounterSummary = async ({ encounterDetails, language }: SummaryRequest) => {
  try {
    const { timestamp, location, duration, notes } = encounterDetails
    
    const prompt = `Create a concise encounter summary for sharing with trusted contacts.
    
    Details:
    - Time: ${new Date(timestamp).toLocaleString()}
    - Location: ${location || 'Not specified'}
    - Duration: ${Math.floor(duration / 60)} minutes ${duration % 60} seconds
    - Notes: ${notes || 'None'}
    
    Language: ${language === 'es' ? 'Spanish' : 'English'}
    
    Create a brief, factual summary suitable for sharing via text/email. Keep it under 200 characters.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are helping create factual, concise summaries of police encounters for safety purposes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 100
    })

    const response = completion.choices[0]?.message?.content
    if (!response) throw new Error('No response from OpenAI')

    return response.trim()
  } catch (error) {
    console.error('Error generating summary:', error)
    throw new Error('Failed to generate summary')
  }
}

// Translate content to Spanish
export const translateToSpanish = async (text: string) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional translator. Translate the following text to Spanish, maintaining legal accuracy and clarity."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.1,
      max_tokens: 300
    })

    const response = completion.choices[0]?.message?.content
    if (!response) throw new Error('No response from OpenAI')

    return response.trim()
  } catch (error) {
    console.error('Error translating text:', error)
    throw new Error('Failed to translate text')
  }
}

// Generate state-specific rights information
export const generateStateRights = async (state: string, language: 'en' | 'es' = 'en') => {
  try {
    const prompt = `Provide specific legal rights information for citizens during police encounters in ${state}.
    
    Language: ${language === 'es' ? 'Spanish' : 'English'}
    
    Include:
    1. Right to remain silent
    2. Right to refuse searches (when applicable)
    3. Right to record (if legal in the state)
    4. State-specific considerations
    5. When you must provide ID
    
    Format as JSON with keys: silentRight, searchRights, recordingRights, stateSpecific, idRequirements`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a legal expert providing accurate information about citizen rights during police encounters. Focus on practical, legally sound advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 600
    })

    const response = completion.choices[0]?.message?.content
    if (!response) throw new Error('No response from OpenAI')

    return JSON.parse(response)
  } catch (error) {
    console.error('Error generating state rights:', error)
    throw new Error('Failed to generate state rights information')
  }
}
