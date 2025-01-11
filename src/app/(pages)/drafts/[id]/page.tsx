'use client'

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, AlertCircle, CheckCircle2, Download, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface Campaign {
  name: string
  publishPin: string
  reward_type: string
  zipUrl: string
}
export default function PayoutPage() {
  const router = useRouter()
  const { id } = useParams()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [payoutPin, setPayoutPin] = useState("")
  const [isPinCorrect, setIsPinCorrect] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          router.push("/sign-in")
          return
        }

        const response = await fetch(
          `http://localhost:5001/api/campaigns/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(errorData?.message || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const campaignData = data.campaign

        setCampaign({
          name: campaignData.name,
          publishPin: campaignData.publishPin,
          reward_type: campaignData.reward_type,
          zipUrl: campaignData.zipUrl,
        })
      } catch (err: any) {
        console.error("Fetch campaign error:", err)
        setError(err.message || "An error occurred while fetching the campaign")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchCampaign()
    }
  }, [id, router])

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      if (campaign && payoutPin === campaign.publishPin) {
        setIsPinCorrect(true)
      } else {
        setError("Incorrect payout pin. Please try again.")
      }
    } catch (err) {
      setError("An error occurred while verifying the pin")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/sign-in")
        return
      }

      console.log("Publishing campaign with pin:", payoutPin)

      const response = await fetch(
        `http://localhost:5001/api/campaigns/${id}/publish`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pin: payoutPin })
        }
      )

      console.log("Publish response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error("Publish error response:", errorData)
        throw new Error(
          errorData?.message || 
          `Publishing failed with status: ${response.status}`
        )
      }

      const data = await response.json()
      console.log("Publish success response:", data) 
      setIsPublished(true)
    } catch (err: any) {
      console.error("Publish error:", err)
      setError(err.message || "An error occurred while publishing the campaign")
    } finally {
      setIsPublishing(false)
    }
  }


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-lg text-gray-600">Loading payout details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-md mx-auto mt-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!campaign) {
    return null
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-medium tracking-tight text-gray-200">
            Campaign Payout Verification
          </h1>
        </div>

        <Card className="bg-[#1e2128] border-[#2a2d35] shadow-xl">
          <CardHeader>
            <CardTitle className="text-gray-200">
              {isPinCorrect ? "Publish and Download Campaign Files" : "Enter Payout Pin"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {isPinCorrect
                ? "Please publish your campaign before downloading"
                : "Please enter the payout pin to access campaign files"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isPinCorrect ? (
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="text-white">{campaign.publishPin}</div>
                  <div className="relative">
                    <Input
                      id="payoutPin"
                      type="password"
                      value={payoutPin}
                      onChange={(e) => setPayoutPin(e.target.value)}
                      className="pl-10 bg-[#13151a] border-[#2a2d35] text-gray-200 placeholder-gray-500"
                      placeholder="Enter your pin"
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Pin"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <Alert className="bg-green-900/20 border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-400">Success!</AlertTitle>
                  <AlertDescription className="text-green-300">
                    Your payout pin has been verified successfully.
                  </AlertDescription>
                </Alert>

                {!isPublished ? (
                  <Button
                    onClick={handlePublish}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isPublishing}
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      "Publish Campaign"
                    )}
                  </Button>
                ) : campaign.zipUrl ? (
                  <div className="text-center">
                    <Alert className="bg-green-900/20 border-green-800 mb-4">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <AlertTitle className="text-green-400">Published!</AlertTitle>
                      <AlertDescription className="text-green-300">
                        Your campaign has been published successfully.
                      </AlertDescription>
                    </Alert>
                    
                    <Button
                      asChild
                      size="lg"
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      <a
                        href={campaign.zipUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download Campaign Files
                      </a>
                    </Button>
                    <p className="mt-2 text-sm text-gray-400">
                      Click the button above to download your files
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}