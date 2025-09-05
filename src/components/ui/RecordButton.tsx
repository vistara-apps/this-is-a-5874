import React from 'react'
import { Play, Square, Pause } from 'lucide-react'
import { motion } from 'framer-motion'

interface RecordButtonProps {
  variant: 'prominent'
  isRecording: boolean
  isPaused: boolean
  onStart: () => void
  onStop: () => void
  onPause: () => void
  onResume: () => void
  disabled?: boolean
  className?: string
}

export const RecordButton: React.FC<RecordButtonProps> = ({
  variant,
  isRecording,
  isPaused,
  onStart,
  onStop,
  onPause,
  onResume,
  disabled = false,
  className = ''
}) => {
  const handleClick = () => {
    if (disabled) return
    
    if (!isRecording) {
      onStart()
    } else if (isPaused) {
      onResume()
    } else {
      onPause()
    }
  }

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled) {
      onStop()
    }
  }

  if (variant === 'prominent') {
    return (
      <div className={`flex flex-col items-center space-y-4 ${className}`}>
        {/* Main Record Button */}
        <motion.button
          onClick={handleClick}
          disabled={disabled}
          className={`
            relative w-24 h-24 rounded-full flex items-center justify-center
            transition-all duration-200 shadow-lg
            ${isRecording 
              ? isPaused 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-danger hover:bg-red-600' 
              : 'bg-accent hover:bg-green-600'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            focus:outline-none focus:ring-4 focus:ring-white/30
          `}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          animate={isRecording && !isPaused ? {
            boxShadow: [
              '0 0 0 0 rgba(239, 68, 68, 0.7)',
              '0 0 0 20px rgba(239, 68, 68, 0)',
            ]
          } : {}}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }
          }}
        >
          {/* Recording pulse animation */}
          {isRecording && !isPaused && (
            <motion.div
              className="absolute inset-0 rounded-full bg-danger"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          )}
          
          {/* Icon */}
          <div className="relative z-10">
            {!isRecording ? (
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            ) : isPaused ? (
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            ) : (
              <Pause className="w-8 h-8 text-white" fill="currentColor" />
            )}
          </div>
        </motion.button>

        {/* Stop Button (only visible when recording) */}
        {isRecording && (
          <motion.button
            onClick={handleStop}
            disabled={disabled}
            className={`
              w-12 h-12 rounded-full bg-neutral-700 hover:bg-neutral-800
              flex items-center justify-center transition-colors
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              focus:outline-none focus:ring-2 focus:ring-white/30
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileTap={!disabled ? { scale: 0.95 } : {}}
          >
            <Square className="w-5 h-5 text-white" fill="currentColor" />
          </motion.button>
        )}

        {/* Status Text */}
        <div className="text-center">
          <p className="text-white font-medium">
            {!isRecording 
              ? 'Tap to Record' 
              : isPaused 
                ? 'Paused - Tap to Resume' 
                : 'Recording...'
            }
          </p>
          {isRecording && (
            <p className="text-white/70 text-sm mt-1">
              Tap square to stop
            </p>
          )}
        </div>
      </div>
    )
  }

  return null
}
