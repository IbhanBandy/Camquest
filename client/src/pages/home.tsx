import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCameras } from '@/lib/api';
import { Camera } from '@shared/schema';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/hero-section';
import CameraCard from '@/components/camera-card';
import FilterBar from '@/components/filter-bar';
import RentalModal from '@/components/rental-modal';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    availability: 'all',
    search: '',
  });
  
  const { data: cameras = [], isLoading } = useQuery({
    queryKey: ['/api/cameras'],
  });
  
  const handleRentClick = (camera: Camera) => {
    setSelectedCamera(camera);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleFilterChange = (newFilters: { category: string; availability: string; search: string }) => {
    setFilters(newFilters);
  };
  
  // Apply filters to cameras
  const filteredCameras = cameras.filter(camera => {
    // Category filter
    if (filters.category !== 'all' && camera.category !== filters.category) {
      return false;
    }
    
    // Availability filter
    if (filters.availability === 'available' && camera.availableUnits <= 0) {
      return false;
    }
    
    // Search filter
    if (filters.search && !camera.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !camera.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Generate camera card skeletons for loading state
  const skeletons = Array(3).fill(0).map((_, i) => (
    <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <Skeleton className="w-full h-48" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  ));
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        
        <section id="camera-listings" className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Available Cameras</h2>
              <p className="mt-2 text-gray-600">Browse our selection of high-quality cameras for rent</p>
            </div>
            
            <FilterBar onFilterChange={handleFilterChange} />
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skeletons}
              </div>
            ) : filteredCameras.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCameras.map(camera => (
                  <CameraCard 
                    key={camera.id} 
                    camera={camera} 
                    onRentClick={handleRentClick} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No cameras found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>
        
        <RentalModal 
          isOpen={isModalOpen} 
          camera={selectedCamera} 
          onClose={handleCloseModal} 
        />
      </main>
      <Footer />
    </div>
  );
}
