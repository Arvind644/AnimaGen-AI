const LEONARDO_API_BASE = 'https://cloud.leonardo.ai/api/rest/v1';

export async function generateImage(prompt: string) {
  try {
    const response = await fetch(`${LEONARDO_API_BASE}/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        modelId: 'b2614463-296c-462a-9586-aafdb8f00e36',
        width: 512,
        height: 512
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Generate image error:', error);
    throw error;
  }
}

export async function generateVideo(generationId: string) {
  try {
    const response = await fetch(`${LEONARDO_API_BASE}/generations-motion-svd`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        imageId: generationId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Generate video error:', error);
    throw error;
  }
}

export async function getGenerationById(generationId: string) {
  try {
    const response = await fetch(`${LEONARDO_API_BASE}/generations/${generationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get generation status error:', error);
    throw error;
  }
}

export async function getVideoStatus(videoId: string) {
  try {
    const response = await fetch(`${LEONARDO_API_BASE}/generations-motion-svd/${videoId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
        'accept': 'application/json'
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get video status error:', error);
    throw error;
  }
}
