import { NextResponse } from 'next/server';

interface LocationData {
  latitude: number;
  longitude: number;
}

export async function POST(request: Request) {
  try {
    const data: LocationData = await request.json();

    if (!data.latitude || !data.longitude) {
      return NextResponse.json(
        { error: 'Missing required location data' },
        { status: 400 }
      );
    }

    console.log('Received location:', {
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date().toISOString()
    });


    return NextResponse.json({
      success: true,
      message: 'Location received successfully'
    });

  } catch (error) {
    console.error('Error processing location:', error);
    
    return NextResponse.json(
      { error: 'Failed to process location data' },
      { status: 500 }
    );
  }
}

// Optional: Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}