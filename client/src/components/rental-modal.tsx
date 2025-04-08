import { useState, useEffect } from 'react';
import { Camera, InsertRentalRequest } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { createRentalRequest } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { X } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { differenceInDays, addDays } from 'date-fns';
import RequestSuccessModal from './request-success-modal';

interface RentalModalProps {
  isOpen: boolean;
  camera: Camera | null;
  onClose: () => void;
}

export default function RentalModal({ isOpen, camera, onClose }: RentalModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  const [startDate, setStartDate] = useState<string>(today.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(tomorrow.toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  
  // Calculate rental details
  const rentalDays = startDate && endDate ? 
    Math.max(differenceInDays(new Date(endDate), new Date(startDate)), 1) : 1;
  const dailyRate = camera?.pricePerDay || 0;
  const totalPrice = dailyRate * rentalDays * quantity;
  
  // Reset form when modal opens with a new camera
  useEffect(() => {
    if (isOpen && camera) {
      setStartDate(today.toISOString().split('T')[0]);
      setEndDate(tomorrow.toISOString().split('T')[0]);
      setQuantity(1);
      
      // Auto-fill user information if logged in
      if (user) {
        setCustomerName(user.displayName || '');
        setCustomerEmail(user.email || '');
        // Phone number is not available from Google auth, so leave it blank
        setCustomerPhone('');
      } else {
        // Reset fields if not logged in
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
      }
    }
  }, [isOpen, camera, user]);
  
  // Generate quantity options based on available units
  const quantityOptions = camera ? Array.from({ length: camera.availableUnits }, (_, i) => i + 1) : [];
  
  const rentalMutation = useMutation({
    mutationFn: createRentalRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cameras'] });
      // Show success modal instead of closing
      setShowSuccessModal(true);
    },
    onError: (error) => {
      toast({
        title: "Failed to submit rental request",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!camera) return;
    
    // Format dates properly to avoid validation errors
    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);
    
    // Ensure the dates are valid before submission
    if (isNaN(formattedStartDate.getTime()) || isNaN(formattedEndDate.getTime())) {
      toast({
        title: "Invalid Dates",
        description: "Please select valid start and end dates",
        variant: "destructive",
      });
      return;
    }
    
    const rentalRequest: InsertRentalRequest = {
      cameraId: camera.id,
      customerName,
      customerEmail,
      customerPhone,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      quantity,
      totalPrice,
      status: 'pending'
    };
    
    rentalMutation.mutate(rentalRequest);
  };
  
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose(); // Close the rental modal when success modal is closed
  };
  
  if (!camera) return null;
  
  return (
    <>
      {/* Success Modal */}
      <RequestSuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleSuccessModalClose} 
        customerEmail={customerEmail}
      />
      
      {/* Rental Request Modal */}
      <Dialog open={isOpen && !showSuccessModal} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-medium">Rent Camera</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
            <div className="text-sm text-gray-500 mt-2">
              Fill out this form to submit your rental request. All requests are stored in the system and an email notification will be sent to the administrator.
            </div>
          </DialogHeader>
        
          <form onSubmit={handleSubmit} className="overflow-y-auto">
            <div className="mb-4">
              <div className="flex items-center mb-4">
                <img 
                  src={camera.imageUrl} 
                  alt={camera.name} 
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0" 
                />
                <div className="ml-3 sm:ml-4">
                  <h4 className="font-medium text-gray-900">{camera.name}</h4>
                  <p className="text-sm text-gray-500">${camera.pricePerDay}/day</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="rental-start-date">Start Date</Label>
                  <Input
                    type="date"
                    id="rental-start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={today.toISOString().split('T')[0]}
                    className="w-full touch-manipulation" 
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="rental-end-date">End Date</Label>
                  <Input
                    type="date"
                    id="rental-end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full touch-manipulation"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="rental-quantity">Quantity</Label>
                <Select
                  value={quantity.toString()}
                  onValueChange={(value) => setQuantity(parseInt(value))}
                >
                  <SelectTrigger id="rental-quantity">
                    <SelectValue placeholder="Select quantity" />
                  </SelectTrigger>
                  <SelectContent>
                    {quantityOptions.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customer-name">Full Name</Label>
                    <Input
                      type="text"
                      id="customer-name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customer-email">Email Address</Label>
                    <Input
                      type="email"
                      id="customer-email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customer-phone">Phone Number</Label>
                    <Input
                      type="tel"
                      id="customer-phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-50 p-4 rounded">
                <div className="flex justify-between">
                  <span className="text-gray-700">Rental Period:</span>
                  <span className="text-gray-900">{rentalDays} day{rentalDays !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-700">Daily Rate:</span>
                  <span className="text-gray-900">${dailyRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-2 font-medium">
                  <span>Total Cost:</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 mb-4 sm:mb-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={rentalMutation.isPending}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={rentalMutation.isPending}
                className="w-full sm:w-auto"
              >
                {rentalMutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}