import { generateVideo, getGenerationById } from '@/app/utils/leonardo';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { imageId } = await request.json();
    if (!imageId) {
      throw new Error('No image ID provided');
    }

    // Generate video generation using the image ID
    const videoResponse = await generateVideo(imageId);
    
    if (!videoResponse.motionSvdGenerationJob?.generationId) {
      throw new Error('No video generation ID received');
    }

    const videoGenerationId = videoResponse.motionSvdGenerationJob.generationId;

    // Wait for video generation to complete
    let attempts = 0;
    const maxAttempts = 8;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const data = await getGenerationById(videoGenerationId);

      const videoData = data.generations_by_pk;
      const motionMP4URL = videoData.generated_images?.[0]?.motionMP4URL; 

      if (videoData.status === 'COMPLETE' && motionMP4URL) {
        return NextResponse.json({
          success: true,
          videoUrl: motionMP4URL,
          videoGenerationId: videoGenerationId
        });
      }

      if (videoData.status === 'FAILED') {
        throw new Error('Video generation failed');
      }

      attempts++;
    }

    throw new Error('Video generation timed out');

  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate video'
    }, { 
      status: 500 
    });
  }
}
