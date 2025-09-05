import React, { useState } from 'react'
import { Globe, Lock, Crown, ChevronRight, Volume2 } from 'lucide-react'
import { Card } from './ui/Card'
import { PrimaryButton } from './ui/PrimaryButton'
import { useUserStore } from '../stores/useUserStore'

interface RightsGuideProps {
  onPremiumFeature: () => boolean
}

export const RightsGuide: React.FC<RightsGuideProps> = ({ onPremiumFeature }) => {
  const { user, updateUser } = useUserStore()
  const [selectedScript, setSelectedScript] = useState<string | null>(null)

  const toggleLanguage = () => {
    updateUser({ 
      languagePreference: user.languagePreference === 'en' ? 'es' : 'en' 
    })
  }

  const handlePremiumScript = (scriptId: string) => {
    if (onPremiumFeature()) {
      setSelectedScript(scriptId)
    }
  }

  const basicRights = user.languagePreference === 'en' ? {
    title: "Your Basic Rights",
    items: [
      "You have the right to remain silent",
      "You have the right to refuse searches",
      "You have the right to ask if you're free to leave",
      "You have the right to an attorney"
    ]
  } : {
    title: "Sus Derechos Básicos",
    items: [
      "Tienes derecho a permanecer en silencio",
      "Tienes derecho a rechazar registros",
      "Tienes derecho a preguntar si puedes irte",
      "Tienes derecho a un abogado"
    ]
  }

  const scripts = user.languagePreference === 'en' ? [
    {
      id: 'traffic-stop',
      title: 'Traffic Stop Script',
      premium: false,
      preview: '"I invoke my right to remain silent. Am I free to leave?"'
    },
    {
      id: 'search-request',
      title: 'Search Request Response',
      premium: false,
      preview: '"I do not consent to any searches. Am I being detained?"'
    },
    {
      id: 'arrest-situation',
      title: 'Arrest Situation',
      premium: true,
      preview: '"I invoke my right to remain silent and request an attorney."'
    },
    {
      id: 'home-visit',
      title: 'Home Visit Script',
      premium: true,
      preview: '"I do not consent to entry. Please provide a warrant."'
    }
  ] : [
    {
      id: 'traffic-stop',
      title: 'Parada de Tráfico',
      premium: false,
      preview: '"Invoco mi derecho a permanecer en silencio. ¿Puedo irme?"'
    },
    {
      id: 'search-request',
      title: 'Respuesta a Solicitud de Registro',
      premium: false,
      preview: '"No consiento a ningún registro. ¿Estoy detenido?"'
    },
    {
      id: 'arrest-situation',
      title: 'Situación de Arresto',
      premium: true,
      preview: '"Invoco mi derecho a permanecer en silencio y solicito un abogado."'
    },
    {
      id: 'home-visit',
      title: 'Visita Domiciliaria',
      premium: true,
      preview: '"No consiento la entrada. Por favor proporcione una orden."'
    }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Language Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Rights & Scripts</h2>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
        >
          <Globe className="w-4 h-4" />
          {user.languagePreference === 'en' ? 'ES' : 'EN'}
        </button>
      </div>

      {/* Basic Rights */}
      <Card className="p-6 bg-white/10 border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">{basicRights.title}</h3>
        <ul className="space-y-3">
          {basicRights.items.map((right, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2.5 flex-shrink-0" />
              <span className="text-white/80">{right}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Scripts Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          {user.languagePreference === 'en' ? 'What to Say Scripts' : 'Qué Decir - Guiones'}
        </h3>
        <div className="space-y-3">
          {scripts.map((script) => (
            <Card key={script.id} className="p-4 bg-white/5 border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-white">{script.title}</h4>
                    {script.premium && user.subscriptionStatus === 'free' && (
                      <Crown className="w-4 h-4 text-accent" />
                    )}
                  </div>
                  <p className="text-white/70 text-sm">{script.preview}</p>
                </div>
                <button
                  onClick={() => script.premium ? handlePremiumScript(script.id) : setSelectedScript(script.id)}
                  className="ml-4 p-2 text-white/60 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* State Laws Section */}
      <Card className="p-6 bg-white/5 border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {user.statePreference} State Laws
            </h3>
            {user.subscriptionStatus === 'free' && (
              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full mt-1 inline-block">
                Premium Feature
              </span>
            )}
          </div>
          <Lock className="w-5 h-5 text-white/40" />
        </div>
        <p className="text-white/70 text-sm mb-4">
          {user.languagePreference === 'en' 
            ? 'Access detailed state-specific laws and procedures'
            : 'Accede a leyes y procedimientos específicos del estado'
          }
        </p>
        <PrimaryButton 
          onClick={() => onPremiumFeature()}
          variant="outline"
          className="w-full"
        >
          {user.languagePreference === 'en' ? 'Unlock Premium' : 'Desbloquear Premium'}
        </PrimaryButton>
      </Card>

      {/* Script Detail Modal */}
      {selectedScript && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                {scripts.find(s => s.id === selectedScript)?.title}
              </h3>
              <button
                onClick={() => setSelectedScript(null)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-neutral-700">
                {scripts.find(s => s.id === selectedScript)?.preview}
              </p>
              <div className="flex gap-2">
                <PrimaryButton className="flex-1">
                  <Volume2 className="w-4 h-4 mr-2" />
                  {user.languagePreference === 'en' ? 'Listen' : 'Escuchar'}
                </PrimaryButton>
                <PrimaryButton variant="outline" className="flex-1">
                  {user.languagePreference === 'en' ? 'Copy' : 'Copiar'}
                </PrimaryButton>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}