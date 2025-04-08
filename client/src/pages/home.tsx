import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCameras, deleteCamera, updateCamera } from '@/lib/api';
import { Camera } from '@shared/schema';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/hero-section';
import CameraCard from '@/components/camera-card';
import FilterBar from '@/components/filter-bar';
import RentalModal from '@/components/rental-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Link } from 'wouter';

export default function Home() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cameraToEdit, setCameraToEdit] = useState<Camera | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    availability: 'all',
    search: '',
  });
  
  const { data: cameras = [], isLoading } = useQuery<Camera[]>({
    queryKey: ['/api/cameras'],
  });
  
  // Mutation for deleting a camera
  const deleteMutation = useMutation({
    mutationFn: deleteCamera,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cameras'] });
      toast({
        title: "Camera Deleted",
        description: "The camera has been removed from inventory.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete camera",
        variant: "destructive",
      });
    }
  });
  
  // Handle camera rental
  const handleRentClick = (camera: Camera) => {
    setSelectedCamera(camera);
    setIsModalOpen(true);
  };
  
  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // Handle editing a camera
  const handleEditClick = (camera: Camera) => {
    // For now, redirect to admin panel
    window.location.href = "/admin";
  };
  
  // Handle deleting a camera
  const handleDeleteClick = (camera: Camera) => {
    if (window.confirm(`Are you sure you want to delete ${camera.name}?`)) {
      deleteMutation.mutate(camera.id);
    }
  };
  
  const handleFilterChange = (newFilters: { category: string; availability: string; search: string }) => {
    setFilters(newFilters);
  };
  
  // Apply filters to cameras
  const filteredCameras = (cameras as Camera[]).filter((camera: Camera) => {
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
            
            <div className="flex items-center justify-between mb-6">
              <FilterBar onFilterChange={handleFilterChange} />
              
              {isAdmin && (
                <Link href="/admin">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Camera</span>
                  </Button>
                </Link>
              )}
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skeletons}
              </div>
            ) : filteredCameras.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCameras.map((camera: Camera) => (
                  <CameraCard 
                    key={camera.id} 
                    camera={camera} 
                    onRentClick={handleRentClick}
                    onEditClick={isAdmin ? handleEditClick : undefined}
                    onDeleteClick={isAdmin ? handleDeleteClick : undefined} 
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
