import { getGenerationById } from '@/app/utils/leonardo';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { generationId: string } }
) {
  try {
    const response = await getGenerationById(params.generationId);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get generation status' },
      { status: 500 }
    );
  }
} 