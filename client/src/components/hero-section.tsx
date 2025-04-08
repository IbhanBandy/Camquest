import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Professional Cameras for Rent</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Get access to high-quality cameras for your next project without the commitment of purchasing.
          </p>
          <div className="mt-8">
            <a 
              href="#camera-listings" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700"
            >
              View Available Cameras
              <ArrowRight className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
