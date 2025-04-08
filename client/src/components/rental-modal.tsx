import { useState, useEffect } from 'react';
import { Camera, InsertRentalRequest } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { createRentalRequest } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { differenceInDays, addDays } from 'date-fns';

interface RentalModalProps {
  isOpen: boolean;
  camera: Camera | null;
  onClose: () => void;
}

export default function RentalModal({ isOpen, camera, onClose }: RentalModalProps) {
  const { toast } = useToast();
  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  const [startDate, setStartDate] = useState<string>(today.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(tomorrow.toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  
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
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
    }
  }, [isOpen, camera]);
  
  // Generate quantity options based on available units
  const quantityOptions = camera ? Array.from({ length: camera.availableUnits }, (_, i) => i + 1) : [];
  
  const rentalMutation = useMutation({
    mutationFn: createRentalRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cameras'] });
      toast({
        title: "Rental request submitted",
        description: "We will contact you shortly to confirm your reservation.",
        variant: "default",
      });
      onClose();
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
    
    const rentalRequest: InsertRentalRequest = {
      cameraId: camera.id,
      customerName,
      customerEmail,
      customerPhone,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      quantity,
      totalPrice,
      status: 'pending'
    };
    
    rentalMutation.mutate(rentalRequest);
  };
  
  if (!camera) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
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
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <img 
                src={camera.imageUrl} 
                alt={camera.name} 
                className="w-16 h-16 object-cover rounded" 
              />
              <div className="ml-4">
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
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={rentalMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={rentalMutation.isPending}
            >
              {rentalMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
