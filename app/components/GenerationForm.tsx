'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GenerationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  // Get generationId from URL on component mount
  useEffect(() => {
    const imageUrl = searchParams.get('imageUrl');
    const generationId = searchParams.get('generationId');
    if (imageUrl) {
      setImageUrl(imageUrl);
    }
  }, [searchParams]);

  const MAX_ATTEMPTS = 30; // 1 minute timeout

  const generateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setStatus('Generating image... This may take up to a minute');
    setImageUrl(null);
    setVideoUrl(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();

      if (!data.success || !data.imageUrl) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setImageUrl(data.imageUrl);
      
      // Update URL with image ID instead of generation ID
      router.push(`/?id=${data.imageId}`);
      
      setStatus('Image generated successfully!');

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('Failed');
    } finally {
      setLoading(false);
    }
  };

  const generateVideo = async () => {
    const imageId = searchParams.get('id');
    if (!imageId) {
      setError('No image ID found');
      return;
    }

    // console.log("Received imageId:", imageId);
    
    setLoading(true);
    setError(null);
    setStatus('Generating video... This may take few seconds');
    setVideoUrl(null);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId }), // Pass imageId instead of generationId
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate video');
      }

      setVideoUrl(data.videoUrl);
      setStatus('Video generated successfully!');

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('Video generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
            AnimaGen AI
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            Transform your imagination into living art with AI-powered image and video generation
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <form onSubmit={generateContent} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-lg font-medium text-gray-700">
                Describe your imagination
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Be creative! The more detailed your description, the better the result.
              </p>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                rows={4}
                placeholder="Example: A majestic snow leopard sitting on a mountain peak at sunset..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : 'Generate Image'}
            </button>
          </form>
        </div>

        {status && (
          <div className="mb-6 text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              status.includes('failed') ? 'bg-red-100 text-red-800' : 
              status.includes('success') ? 'bg-green-100 text-green-800' : 
              'bg-blue-100 text-blue-800'
            }`}>
              {status}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {imageUrl && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Creation</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
              <img 
                src={imageUrl} 
                alt="Generated" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {!videoUrl && !loading && searchParams.get('id') && (
              <button
                onClick={generateVideo}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-150 ease-in-out"
              >
                Bring it to Life 🎬
              </button>
            )}
          </div>
        )}

        {videoUrl && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Animated Creation</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <video controls className="w-full h-full object-cover">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 