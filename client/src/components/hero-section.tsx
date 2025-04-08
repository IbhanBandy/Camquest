import { ArrowRight, Camera } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Camera className="h-12 w-12 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">CamQuest</span>
            </h1>
          </div>
          <p className="text-2xl font-medium mb-4">Premier Sports Camera Rental</p>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            Experience the unmatched quality of the <span className="font-bold">Veo Cam Three</span> - 
            the AI-powered sports camera that automatically tracks and records your game.
            <span className="block mt-2 text-yellow-300 font-semibold">Limited availability - only one unit in stock!</span>
          </p>
          <div className="mt-8">
            <a 
              href="#camera-listings" 
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all"
            >
              Reserve Your Camera Now
              <ArrowRight className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
