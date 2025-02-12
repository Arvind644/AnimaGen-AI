import GenerationForm from './components/GenerationForm';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {/* Leonardo AI Image & Video Generator */}
      </h1>
      <GenerationForm />
    </main>
  );
}
