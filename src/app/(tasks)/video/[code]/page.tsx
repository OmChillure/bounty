"use client"
import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, PlayCircle, PauseCircle, RotateCw, Volume2, Volume1, VolumeX } from 'lucide-react'

const videos = [
  {
    id: 1,
    title: "Big Buck Bunny",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
]

const VideoTask = () => {
  const params = useParams()
  const code = params?.code as string

  const [currentVideo, setCurrentVideo] = useState(videos[Math.floor(Math.random() * videos.length)])
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [completedVideos, setCompletedVideos] = useState<number[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCompletionForm, setShowCompletionForm] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Form state initialized with code from URL
  const [formData, setFormData] = useState({
    code: code || '', // Pre-fill code from URL
    name: '',
    email: '',
    phoneNo: '',
    upiId: ''
  })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (code) {
      setFormData(prev => ({ ...prev, code }))
    }
  }, [code])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('loadedmetadata', () => setDuration(video.duration))
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('loadedmetadata', () => {})
      }
    }
  }, [currentVideo])

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleFormSubmit = async () => {
    try {
      setIsSubmitting(true)
      setFormError('')

      const response = await fetch('http://localhost:5001/api/code/complete-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          videoId: currentVideo.id,
          completedAt: new Date().toISOString(),
          watchDuration: videoRef.current?.duration || 0,
        }),
      })

      const data = await response.json()

      if (data.message === "Invalid Code" || data.message === "Code Already Used") {
        setFormError(data.message)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to submit completion details')
      }

      setCompletedVideos(prev => [...prev, currentVideo.id])
      setShowCompletionForm(false)
      
      if (completedVideos.length + 1 === videos.length) {
        return
      }
      selectRandomVideo()
    } catch (error) {
      setFormError('Failed to submit completion details. Please try again.')
      console.error('Error submitting completion:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleVideoEnd = () => {
    setIsPlaying(false)
    setShowCompletionForm(true)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleVolume = () => {
    if (videoRef.current) {
      const newVolume = volume === 0 ? 1 : 0
      videoRef.current.volume = newVolume
      setVolume(newVolume)
    }
  }

  const selectRandomVideo = () => {
    const unwatchedVideos = videos.filter(video => !completedVideos.includes(video.id))
    if (unwatchedVideos.length === 0) {
      setCompletedVideos([])
      setCurrentVideo(videos[Math.floor(Math.random() * videos.length)])
    } else {
      const randomVideo = unwatchedVideos[Math.floor(Math.random() * unwatchedVideos.length)]
      setCurrentVideo(randomVideo)
    }
    setProgress(0)
    setIsPlaying(false)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left
    const percentageClicked = (clickPosition / progressBar.offsetWidth) * 100
    if (videoRef.current) {
      const newTime = (percentageClicked / 100) * videoRef.current.duration
      videoRef.current.currentTime = newTime
      setProgress(percentageClicked)
    }
  }

  const allVideosCompleted = completedVideos.length === videos.length

  // If no code is provided, show an error
  if (!code) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Alert variant="destructive">
          <AlertDescription>Invalid URL. No code provided.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              src={currentVideo.url}
              onEnded={handleVideoEnd}
            />
            
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
              <div 
                className="px-4 cursor-pointer" 
                onClick={handleProgressClick}
              >
                <Progress value={progress} className="h-1 bg-gray-600" />
              </div>
            
              <div className="p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-white/10"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <PauseCircle className="h-6 w-6" />
                    ) : (
                      <PlayCircle className="h-6 w-6" />
                    )}
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-white/10"
                    onClick={toggleVolume}
                  >
                    {volume === 0 ? (
                      <VolumeX className="h-6 w-6" />
                    ) : volume < 0.5 ? (
                      <Volume1 className="h-6 w-6" />
                    ) : (
                      <Volume2 className="h-6 w-6" />
                    )}
                  </Button>
                  
                  <div className="text-sm font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {completedVideos.includes(currentVideo.id) && (
                    <span className="text-green-400 text-sm flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center text-white">
              <h3 className="text-xl font-semibold">{currentVideo.title}</h3>
              <div className="text-sm text-gray-400">
                {completedVideos.length} / {videos.length} Videos Completed
              </div>
            </div>

            {allVideosCompleted && (
              <Alert className="bg-green-900/50 border-green-500 text-green-300">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  Congratulations! You've completed all videos.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCompletionForm} onOpenChange={setShowCompletionForm}>
        <DialogContent className="bg-gray-800 text-white border border-gray-700/10">
          <DialogHeader>
            <DialogTitle>Complete Your Task</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                readOnly
                disabled
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNo">Phone Number</Label>
              <Input
                id="phoneNo"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                name="upiId"
                value={formData.upiId}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <Button 
              className="w-full"
              onClick={handleFormSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default VideoTask