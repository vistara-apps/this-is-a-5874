import React, { useState, useRef, useEffect } from 'react'
import { Play, Square, Pause, MapPin, Clock, Share2, Save } from 'lucide-react'
import { Card } from './ui/Card'
import { PrimaryButton } from './ui/PrimaryButton'
import { useUserStore } from '../stores/useUserStore'

interface RecordingInterfaceProps {
  onPremiumFeature: () => boolean
}

export const RecordingInterface: React.FC<RecordingInterfaceProps> = ({ onPremiumFeature }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [hasRecording, setHasRecording] = useState(false)
  const [location, setLocation] = useState<string>('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [notes, setNotes] = useState('')
  
  const { user, addEncounter } = useUserStore()
  const intervalRef = useRef<NodeJS.Timeout>()
  const mediaRecorderRef = useRef<MediaRecorder>()

  useEffect(() => {
    // Get location permission and current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        },
        () => {
          setLocation('Location unavailable')
        }
      )
    }
  }, [])

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRecording, isPaused])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: false 
      })
      
      mediaRecorderRef.current = new MediaRecorder(stream)
      setIsRecording(true)
      setRecordingTime(0)
      
      mediaRecorderRef.current.start()
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Unable to access microphone. Please check permissions.')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsPaused(!isPaused)
      if (isPaused) {
        mediaRecorderRef.current.resume()
      } else {
        mediaRecorderRef.current.pause()
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      setIsPaused(false)
      setHasRecording(true)
      setShowSaveDialog(true)
    }
  }

  const saveEncounter = () => {
    const encounter = addEncounter({
      timestamp: new Date(),
      location: location || undefined,
      recordingUrl: 'mock-recording-url', // In real app, this would be the actual file URL
      summaryContent: generateSummary(),
      sharedWith: []
    })

    setShowSaveDialog(false)
    setHasRecording(false)
    setRecordingTime(0)
    setNotes('')
    
    alert('Encounter saved successfully!')
  }

  const generateSummary = () => {
    const duration = Math.floor(recordingTime / 60)
    const summary = `Encounter recorded on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}. Duration: ${duration} minutes. ${location ? `Location: ${location}.` : ''} ${notes ? `Notes: ${notes}` : ''}`
    return summary
  }

  const shareEncounter = () => {
    if (onPremiumFeature()) {
      const summary = generateSummary()
      if (navigator.share) {
        navigator.share({
          title: 'CitizenShield Encounter',
          text: summary
        })
      } else {
        navigator.clipboard.writeText(summary)
        alert('Summary copied to clipboard!')
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Record Encounter
        </h2>
        <p className="text-white/80 text-base">
          One-tap recording for documentation
        </p>
      </div>

      {/* Recording Status */}
      <Card className="p-6 bg-white/10 border-white/20 text-center">
        <div className="mb-6">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
            isRecording 
              ? 'bg-danger/20 animate-pulse-record' 
              : 'bg-accent/20'
          }`}>
            {isRecording ? (
              <div className="w-8 h-8 bg-danger rounded-full" />
            ) : (
              <Play className="w-8 h-8 text-accent" />
            )}
          </div>
          
          <div className="text-3xl font-mono text-white mb-2">
            {formatTime(recordingTime)}
          </div>
          
          <div className="text-white/60 text-sm">
            {isRecording 
              ? (isPaused ? 'Recording Paused' : 'Recording Active')
              : 'Ready to Record'
            }
          </div>
        </div>

        {/* Recording Controls */}
        <div className="flex justify-center gap-4">
          {!isRecording ? (
            <PrimaryButton 
              onClick={startRecording}
              className="bg-accent hover:bg-accent/90 px-8"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Recording
            </PrimaryButton>
          ) : (
            <>
              <PrimaryButton 
                onClick={pauseRecording}
                variant="outline"
                className="px-6"
              >
                {isPaused ? (
                  <><Play className="w-5 h-5 mr-2" /> Resume</>
                ) : (
                  <><Pause className="w-5 h-5 mr-2" /> Pause</>
                )}
              </PrimaryButton>
              
              <PrimaryButton 
                onClick={stopRecording}
                className="bg-danger hover:bg-danger/90 px-6"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </PrimaryButton>
            </>
          )}
        </div>
      </Card>

      {/* Location & Time Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 bg-white/5 border-white/20">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-300" />
            <div>
              <div className="text-white/60 text-xs">Location</div>
              <div className="text-white text-sm">{location || 'Getting location...'}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/5 border-white/20">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-300" />
            <div>
              <div className="text-white/60 text-xs">Started</div>
              <div className="text-white text-sm">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Recordings */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Recordings</h3>
        <Card className="p-6 bg-white/5 border-white/20 text-center">
          <div className="text-white/40 mb-3">📱</div>
          <p className="text-white/60 text-sm">
            Your recordings will appear here after saving
          </p>
        </Card>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full bg-white p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Save Encounter
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border border-neutral-300 rounded-md"
                  rows={3}
                  placeholder="Add any additional details..."
                />
              </div>

              <div className="text-sm text-neutral-600">
                <p><strong>Duration:</strong> {formatTime(recordingTime)}</p>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
              </div>

              <div className="flex gap-3">
                <PrimaryButton onClick={saveEncounter} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </PrimaryButton>
                
                <PrimaryButton 
                  onClick={shareEncounter}
                  variant="outline" 
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </PrimaryButton>
              </div>

              <button
                onClick={() => setShowSaveDialog(false)}
                className="w-full text-neutral-500 hover:text-neutral-700 text-sm"
              >
                Cancel
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}