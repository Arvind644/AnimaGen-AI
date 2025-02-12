import { generateImage, getGenerationById } from '@/app/utils/leonardo';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Get the prompt and generate initial image
    const { prompt } = await request.json();
    console.log('Starting generation with prompt:', prompt);

    const genResponse = await generateImage(prompt);
    if (!genResponse?.sdGenerationJob?.generationId) {
      throw new Error('Failed to get generation ID');
    }

    const generationId = genResponse.sdGenerationJob.generationId;
    console.log('Got generation ID:', generationId);

    // 2. Wait for image to be ready
    let imageUrl = null;
    let imageId = null;
    const maxAttempts = 2;
    
    for (let i = 0; i < maxAttempts; i++) {
      // Wait 5 seconds between checks
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Check generation status
      const status = await getGenerationById(generationId);
      console.log(`Check ${i + 1}/${maxAttempts} - Status:`, status.generations_by_pk?.status);

      // If generation is complete and we have images
      if (status.generations_by_pk?.status === 'COMPLETE' && 
          status.generations_by_pk?.generated_images?.length > 0) {
        imageUrl = status.generations_by_pk.generated_images[0].url;
        imageId = status.generations_by_pk.generated_images[0].id;
        break;
      }

      // If generation failed
      if (status.generations_by_pk?.status === 'FAILED') {
        throw new Error('Generation failed');
      }
    }

    // 3. Return the result
    if (imageUrl && imageId) {
      return NextResponse.json({ 
        success: true, 
        imageUrl,
        imageId
      });
    } else {
      throw new Error('Generation timed out');
    }

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate image'
    }, { 
      status: 500 
    });
  }
} 