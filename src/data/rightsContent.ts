export interface RightsContent {
  state: string
  language: 'en' | 'es'
  rightsText: string
  scriptText: string
  guideSteps: string[]
  silentRight: string
  searchRights: string
  recordingRights: string
  stateSpecific: string
  idRequirements: string
}

// Default rights content for all states (English)
export const defaultRightsContent: Omit<RightsContent, 'state'> = {
  language: 'en',
  rightsText: 'You have fundamental constitutional rights during any police encounter.',
  scriptText: 'Key phrases to remember during police encounters.',
  guideSteps: [
    'Stay calm and keep your hands visible',
    'Clearly state: "I am exercising my right to remain silent"',
    'Ask: "Am I free to leave?" If yes, calmly walk away',
    'If detained, ask: "What am I being detained for?"',
    'Do not consent to searches: "I do not consent to any searches"',
    'If recording is legal in your state, announce: "I am recording this interaction"'
  ],
  silentRight: 'You have the right to remain silent under the Fifth Amendment. You are not required to answer questions beyond providing identification when legally required. Clearly state: "I am exercising my right to remain silent."',
  searchRights: 'You have the right to refuse consent to searches of your person, vehicle, or property. Police may still conduct searches if they have probable cause or a warrant, but you should never consent. Say: "I do not consent to any searches."',
  recordingRights: 'In most states, you have the right to record police officers performing their duties in public. However, laws vary by state. Do not interfere with police work while recording.',
  stateSpecific: 'Laws may vary by state regarding specific requirements and rights. Consult local legal resources for state-specific information.',
  idRequirements: 'Requirements to provide identification vary by state. Some states have "stop and identify" laws that require you to provide ID when lawfully detained.'
}

// State-specific rights content
export const stateRightsContent: Record<string, RightsContent> = {
  'CA': {
    state: 'CA',
    language: 'en',
    rightsText: 'California provides strong protections for citizen rights during police encounters.',
    scriptText: 'California-specific phrases and rights to remember.',
    guideSteps: [
      'Stay calm and keep your hands visible',
      'You are not required to provide ID unless driving or lawfully arrested',
      'Clearly state: "I am exercising my right to remain silent"',
      'California is a two-party consent state for audio recording',
      'You may record video of police in public without consent',
      'Do not consent to searches: "I do not consent to any searches"'
    ],
    silentRight: 'Under California law and the Fifth Amendment, you have the right to remain silent. You are not required to answer questions about where you are going, where you came from, or what you are doing.',
    searchRights: 'California requires clear consent for searches. Police cannot search you, your car, or your home without a warrant, probable cause, or your consent. Never consent to searches.',
    recordingRights: 'In California, you may record video of police officers in public. However, California requires two-party consent for audio recording, so be careful about recording audio without permission.',
    stateSpecific: 'California does not have a "stop and identify" law. You are only required to provide ID if you are driving, lawfully arrested, or in specific circumstances like purchasing alcohol.',
    idRequirements: 'California does not require you to carry or show ID unless you are driving a vehicle, have been lawfully arrested, or are in certain regulated activities.'
  },
  'NY': {
    state: 'NY',
    language: 'en',
    rightsText: 'New York provides constitutional protections during police encounters.',
    scriptText: 'New York-specific rights and phrases to remember.',
    guideSteps: [
      'Stay calm and keep your hands visible',
      'You are not required to provide ID unless lawfully arrested',
      'Clearly state: "I am exercising my right to remain silent"',
      'New York is a one-party consent state for recording',
      'You may record police officers in public',
      'Do not consent to searches: "I do not consent to any searches"'
    ],
    silentRight: 'You have the right to remain silent under the Fifth Amendment. In New York, you are not required to answer questions beyond providing identification when lawfully required.',
    searchRights: 'New York law requires probable cause or a warrant for most searches. You have the right to refuse consent to searches. Police may still search if they have legal justification.',
    recordingRights: 'New York is a one-party consent state, meaning you can record conversations you are part of. You may also record police officers performing duties in public.',
    stateSpecific: 'New York has specific laws regarding police encounters. The NYPD has specific protocols for stops and searches that officers must follow.',
    idRequirements: 'New York does not have a general "stop and identify" law. You are only required to provide ID when lawfully arrested or in specific circumstances.'
  },
  'TX': {
    state: 'TX',
    language: 'en',
    rightsText: 'Texas law provides specific protections and requirements during police encounters.',
    scriptText: 'Texas-specific rights and legal requirements.',
    guideSteps: [
      'Stay calm and keep your hands visible',
      'Texas has a "stop and identify" law - you must provide name if lawfully detained',
      'Clearly state: "I am exercising my right to remain silent"',
      'Texas is a one-party consent state for recording',
      'You may record police officers in public',
      'Do not consent to searches: "I do not consent to any searches"'
    ],
    silentRight: 'You have the right to remain silent under the Fifth Amendment. However, Texas has a "stop and identify" law requiring you to provide your name if lawfully detained.',
    searchRights: 'Texas law requires probable cause or consent for searches. You have the right to refuse consent, but police may search if they have probable cause or other legal justification.',
    recordingRights: 'Texas is a one-party consent state. You may record police officers performing their duties in public places without their consent.',
    stateSpecific: 'Texas Penal Code Section 38.02 requires you to provide your name (but not ID) if lawfully detained and the officer requests it. Failure to provide your name can result in arrest.',
    idRequirements: 'Texas law requires you to provide your name if lawfully detained and asked by an officer. You are not required to provide physical ID unless driving or under arrest.'
  },
  'FL': {
    state: 'FL',
    language: 'en',
    rightsText: 'Florida provides constitutional protections with specific state requirements.',
    scriptText: 'Florida-specific rights and legal considerations.',
    guideSteps: [
      'Stay calm and keep your hands visible',
      'Florida has a "stop and identify" law in certain circumstances',
      'Clearly state: "I am exercising my right to remain silent"',
      'Florida is a two-party consent state for audio recording',
      'You may record video of police in public',
      'Do not consent to searches: "I do not consent to any searches"'
    ],
    silentRight: 'You have the right to remain silent under the Fifth Amendment. Florida law may require identification in certain circumstances when lawfully detained.',
    searchRights: 'Florida requires probable cause, a warrant, or consent for searches. You have the right to refuse consent to searches of your person, vehicle, or property.',
    recordingRights: 'Florida is a two-party consent state for audio recording, but you may record video of police officers in public. Be careful about recording audio without consent.',
    stateSpecific: 'Florida Statute 856.021 allows officers to demand identification from persons reasonably suspected of criminal activity. This is more limited than general "stop and identify" laws.',
    idRequirements: 'Florida requires identification only when you are reasonably suspected of criminal activity and lawfully detained. The requirement is more limited than in some other states.'
  }
}

// Spanish translations for California (example)
export const spanishRightsContent: Record<string, RightsContent> = {
  'CA': {
    state: 'CA',
    language: 'es',
    rightsText: 'California proporciona fuertes protecciones para los derechos ciudadanos durante encuentros policiales.',
    scriptText: 'Frases específicas de California y derechos a recordar.',
    guideSteps: [
      'Mantén la calma y mantén las manos visibles',
      'No estás obligado a proporcionar identificación a menos que estés conduciendo o arrestado legalmente',
      'Declara claramente: "Estoy ejerciendo mi derecho a permanecer en silencio"',
      'California requiere consentimiento de ambas partes para grabación de audio',
      'Puedes grabar video de la policía en público sin consentimiento',
      'No consientas a registros: "No consiento a ningún registro"'
    ],
    silentRight: 'Bajo la ley de California y la Quinta Enmienda, tienes el derecho a permanecer en silencio. No estás obligado a responder preguntas sobre a dónde vas, de dónde vienes, o qué estás haciendo.',
    searchRights: 'California requiere consentimiento claro para registros. La policía no puede registrarte a ti, tu auto, o tu hogar sin una orden, causa probable, o tu consentimiento. Nunca consientas a registros.',
    recordingRights: 'En California, puedes grabar video de oficiales de policía en público. Sin embargo, California requiere consentimiento de ambas partes para grabación de audio.',
    stateSpecific: 'California no tiene una ley de "parar e identificar". Solo estás obligado a proporcionar identificación si estás conduciendo, arrestado legalmente, o en circunstancias específicas.',
    idRequirements: 'California no requiere que portes o muestres identificación a menos que estés conduciendo un vehículo, hayas sido arrestado legalmente, o estés en ciertas actividades reguladas.'
  }
}

// Utility functions
export const getRightsContent = (state: string, language: 'en' | 'es' = 'en'): RightsContent => {
  if (language === 'es' && spanishRightsContent[state]) {
    return spanishRightsContent[state]
  }
  
  if (stateRightsContent[state]) {
    return stateRightsContent[state]
  }
  
  // Return default content with the requested state
  return {
    ...defaultRightsContent,
    state,
    language
  }
}

export const getAvailableStates = (): string[] => {
  return Object.keys(stateRightsContent).sort()
}

export const isStateSupported = (state: string): boolean => {
  return state in stateRightsContent
}

// Common situations and scripts
export const commonSituations = {
  en: {
    'traffic-stop': {
      title: 'Traffic Stop',
      whatToSay: [
        '"I am exercising my right to remain silent"',
        '"Am I free to leave?"',
        '"I do not consent to any searches"'
      ],
      whatNotToSay: [
        'Don\'t admit to speeding or violations',
        'Don\'t argue about the stop',
        'Don\'t consent to vehicle searches'
      ],
      keyRights: [
        'Right to remain silent',
        'Right to refuse consent to search',
        'Right to ask if you are free to leave'
      ]
    },
    'pedestrian-stop': {
      title: 'Pedestrian Stop',
      whatToSay: [
        '"Am I being detained or am I free to go?"',
        '"I am exercising my right to remain silent"',
        '"I do not consent to any searches"'
      ],
      whatNotToSay: [
        'Don\'t run or resist',
        'Don\'t lie about your identity',
        'Don\'t consent to searches'
      ],
      keyRights: [
        'Right to know if you are being detained',
        'Right to remain silent',
        'Right to refuse consent to search'
      ]
    },
    'home-encounter': {
      title: 'Police at Your Home',
      whatToSay: [
        '"Do you have a warrant?"',
        '"I do not consent to you entering my home"',
        '"I am exercising my right to remain silent"'
      ],
      whatNotToSay: [
        'Don\'t let them in without a warrant',
        'Don\'t consent to searches',
        'Don\'t answer questions without a lawyer'
      ],
      keyRights: [
        'Right to see a warrant',
        'Right to refuse entry without warrant',
        'Right to remain silent'
      ]
    }
  },
  es: {
    'traffic-stop': {
      title: 'Parada de Tráfico',
      whatToSay: [
        '"Estoy ejerciendo mi derecho a permanecer en silencio"',
        '"¿Soy libre de irme?"',
        '"No consiento a ningún registro"'
      ],
      whatNotToSay: [
        'No admitas exceso de velocidad o violaciones',
        'No discutas sobre la parada',
        'No consientas a registros del vehículo'
      ],
      keyRights: [
        'Derecho a permanecer en silencio',
        'Derecho a rechazar consentimiento para registro',
        'Derecho a preguntar si eres libre de irte'
      ]
    }
  }
}

export const getSituationScript = (situation: string, language: 'en' | 'es' = 'en') => {
  return commonSituations[language]?.[situation] || null
}
