import React from 'react'
import { X, Shield, MessageSquare, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PrimaryButton } from './PrimaryButton'

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
  variant: 'rights' | 'script'
  title: string
  content: {
    whatToSay?: string[]
    whatNotToSay?: string[]
    keyRights?: string[]
    silentRight?: string
    searchRights?: string
    recordingRights?: string
    stateSpecific?: string
    idRequirements?: string
  }
  language?: 'en' | 'es'
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  variant,
  title,
  content,
  language = 'en'
}) => {
  const texts = {
    en: {
      close: 'Close',
      whatToSay: 'What to Say',
      whatNotToSay: 'What NOT to Say',
      keyRights: 'Key Rights',
      rightToSilence: 'Right to Remain Silent',
      searchRights: 'Search Rights',
      recordingRights: 'Recording Rights',
      stateSpecific: 'State-Specific Information',
      idRequirements: 'ID Requirements'
    },
    es: {
      close: 'Cerrar',
      whatToSay: 'Qué Decir',
      whatNotToSay: 'Qué NO Decir',
      keyRights: 'Derechos Clave',
      rightToSilence: 'Derecho a Permanecer en Silencio',
      searchRights: 'Derechos de Búsqueda',
      recordingRights: 'Derechos de Grabación',
      stateSpecific: 'Información Específica del Estado',
      idRequirements: 'Requisitos de Identificación'
    }
  }

  const t = texts[language]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg max-h-[80vh] overflow-hidden bg-white rounded-lg shadow-card"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <div className="flex items-center space-x-3">
                {variant === 'rights' ? (
                  <Shield className="w-6 h-6 text-primary" />
                ) : (
                  <MessageSquare className="w-6 h-6 text-accent" />
                )}
                <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {variant === 'script' && (
                <div className="space-y-6">
                  {/* What to Say */}
                  {content.whatToSay && (
                    <div>
                      <h3 className="flex items-center text-lg font-semibold text-accent mb-3">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        {t.whatToSay}
                      </h3>
                      <ul className="space-y-2">
                        {content.whatToSay.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-neutral-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What NOT to Say */}
                  {content.whatNotToSay && (
                    <div>
                      <h3 className="flex items-center text-lg font-semibold text-danger mb-3">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        {t.whatNotToSay}
                      </h3>
                      <ul className="space-y-2">
                        {content.whatNotToSay.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-danger rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-neutral-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key Rights */}
                  {content.keyRights && (
                    <div>
                      <h3 className="flex items-center text-lg font-semibold text-primary mb-3">
                        <Shield className="w-5 h-5 mr-2" />
                        {t.keyRights}
                      </h3>
                      <ul className="space-y-2">
                        {content.keyRights.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-neutral-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {variant === 'rights' && (
                <div className="space-y-6">
                  {/* Right to Remain Silent */}
                  {content.silentRight && (
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        {t.rightToSilence}
                      </h3>
                      <p className="text-neutral-700">{content.silentRight}</p>
                    </div>
                  )}

                  {/* Search Rights */}
                  {content.searchRights && (
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        {t.searchRights}
                      </h3>
                      <p className="text-neutral-700">{content.searchRights}</p>
                    </div>
                  )}

                  {/* Recording Rights */}
                  {content.recordingRights && (
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        {t.recordingRights}
                      </h3>
                      <p className="text-neutral-700">{content.recordingRights}</p>
                    </div>
                  )}

                  {/* State-Specific Information */}
                  {content.stateSpecific && (
                    <div>
                      <h3 className="text-lg font-semibold text-accent mb-2">
                        {t.stateSpecific}
                      </h3>
                      <p className="text-neutral-700">{content.stateSpecific}</p>
                    </div>
                  )}

                  {/* ID Requirements */}
                  {content.idRequirements && (
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        {t.idRequirements}
                      </h3>
                      <p className="text-neutral-700">{content.idRequirements}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-100">
              <PrimaryButton
                onClick={onClose}
                className="w-full"
              >
                {t.close}
              </PrimaryButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
