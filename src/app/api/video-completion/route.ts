import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { videoId, completedAt, watchDuration } = body

    if (!videoId || !completedAt || watchDuration === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    console.log('Video Completed:', {
      videoId,
      completedAt,
      watchDuration: `${Math.floor(watchDuration)} seconds`,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Video completion logged successfully',
      data: {
        videoId,
        completedAt,
        watchDuration
      }
    })

  } catch (error) {
    console.error('Error logging video completion:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}