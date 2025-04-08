import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCameras, updateCamera, deleteCamera } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Camera } from '@shared/schema';
import { Pencil, Trash, Minus, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function InventoryTab() {
  const { toast } = useToast();
  const [editingPrices, setEditingPrices] = useState<Record<number, number>>({});
  const [updatedInventory, setUpdatedInventory] = useState<Record<number, { totalUnits: number }>>({});
  
  const { data: cameras = [], isLoading } = useQuery({
    queryKey: ['/api/cameras'],
    refetchOnWindowFocus: true,
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number, updates: Partial<Camera> }) => 
      updateCamera(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cameras'] });
      toast({
        title: 'Changes saved',
        description: 'The camera inventory has been updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update camera inventory.',
        variant: 'destructive',
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteCamera,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cameras'] });
      toast({
        title: 'Camera deleted',
        description: 'The camera has been removed from inventory.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete camera.',
        variant: 'destructive',
      });
    }
  });
  
  const handlePriceChange = (camera: Camera, value: string) => {
    const price = parseFloat(value);
    if (!isNaN(price) && price >= 0) {
      setEditingPrices({
        ...editingPrices,
        [camera.id]: price
      });
    }
  };
  
  const handleUnitChange = (camera: Camera, amount: number) => {
    const currentTotal = updatedInventory[camera.id]?.totalUnits ?? camera.totalUnits;
    const newTotal = Math.max(0, currentTotal + amount);
    
    setUpdatedInventory({
      ...updatedInventory,
      [camera.id]: {
        totalUnits: newTotal
      }
    });
  };
  
  const saveChanges = () => {
    // Process price changes
    Object.entries(editingPrices).forEach(([cameraId, price]) => {
      updateMutation.mutate({
        id: parseInt(cameraId),
        updates: { pricePerDay: price }
      });
    });
    
    // Process inventory changes
    Object.entries(updatedInventory).forEach(([cameraId, { totalUnits }]) => {
      const camera = cameras.find(c => c.id === parseInt(cameraId));
      if (camera) {
        // Calculate available units based on the change in total units
        const currentRented = camera.totalUnits - camera.availableUnits;
        const newAvailable = Math.max(0, totalUnits - currentRented);
        
        updateMutation.mutate({
          id: parseInt(cameraId),
          updates: { 
            totalUnits, 
            availableUnits: newAvailable 
          }
        });
      }
    });
    
    // Reset state
    setEditingPrices({});
    setUpdatedInventory({});
  };
  
  const handleDeleteCamera = (id: number) => {
    if (window.confirm('Are you sure you want to delete this camera?')) {
      deleteMutation.mutate(id);
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-8">Loading inventory...</div>;
  }
  
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Camera
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Units
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Available
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price/Day
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cameras.map((camera) => {
              const totalUnits = updatedInventory[camera.id]?.totalUnits ?? camera.totalUnits;
              const currentRented = camera.totalUnits - camera.availableUnits;
              const calculatedAvailable = Math.max(0, totalUnits - currentRented);
              
              return (
                <tr key={camera.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={camera.imageUrl} 
                          alt={camera.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {camera.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: CAM-{String(1000 + camera.id).substring(1)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUnitChange(camera, -1)}
                        disabled={totalUnits <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-2">{totalUnits}</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleUnitChange(camera, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {calculatedAvailable > 0 ? (
                      <Badge variant="success">
                        {calculatedAvailable} Available
                      </Badge>
                    ) : (
                      <Badge variant="danger">
                        Out of Stock
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editingPrices[camera.id] ?? camera.pricePerDay}
                        onChange={(e) => handlePriceChange(camera, e.target.value)}
                        className="w-20 p-1"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost" 
                      className="text-primary hover:text-blue-700 mr-2"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteCamera(camera.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <Button 
          onClick={saveChanges}
          disabled={
            Object.keys(editingPrices).length === 0 && 
            Object.keys(updatedInventory).length === 0
          }
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
