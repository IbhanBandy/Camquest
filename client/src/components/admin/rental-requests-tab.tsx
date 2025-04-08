import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getRentalRequests, getCameras, updateRentalStatus } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { RentalRequest, Camera } from '@shared/schema';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  CheckSquare,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RentalRequestsTab() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { data: rentals = [], isLoading: isLoadingRentals } = useQuery({
    queryKey: ['/api/rentals'],
  });
  
  const { data: cameras = [], isLoading: isLoadingCameras } = useQuery({
    queryKey: ['/api/cameras'],
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => 
      updateRentalStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rentals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cameras'] });
      toast({
        title: 'Status Updated',
        description: 'The rental request status has been updated.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update rental request status.',
        variant: 'destructive',
      });
    }
  });
  
  const handleStatusUpdate = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };
  
  const getCameraName = (cameraId: number) => {
    const camera = cameras.find(c => c.id === cameraId);
    return camera ? camera.name : 'Unknown Camera';
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const filteredRentals = statusFilter === 'all' 
    ? rentals 
    : rentals.filter(rental => rental.status === statusFilter);
  
  if (isLoadingRentals || isLoadingCameras) {
    return <div className="text-center py-8">Loading rental requests...</div>;
  }
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Rental Requests</h3>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>Email Notifications:</strong> Currently, email notifications are not being sent due to SendGrid sender verification requirements. New rental requests are still saved in the system and displayed here. Check the server console logs for detailed information about incoming requests.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>To enable email notifications:</strong> Visit your SendGrid account, go to "Settings > Sender Authentication" and verify your email address (kaleb.gill420@gmail.com).
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Camera
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRentals.map((rental) => (
              <tr key={rental.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  RNT-{String(10000 + rental.id).substring(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{rental.customerName}</div>
                  <div className="text-sm text-gray-500">{rental.customerEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getCameraName(rental.cameraId)}</div>
                  <div className="text-sm text-gray-500">{rental.quantity} unit{rental.quantity !== 1 ? 's' : ''}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(rental.startDate), 'MMM d, yyyy')} - {format(new Date(rental.endDate), 'MMM d, yyyy')}
                  </div>
                  <div className="text-sm text-gray-500">
                    ${rental.totalPrice.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(rental.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {rental.status === 'pending' && (
                    <>
                      <Button 
                        variant="ghost" 
                        className="text-green-600 hover:text-green-900 mr-2"
                        onClick={() => handleStatusUpdate(rental.id, 'approved')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleStatusUpdate(rental.id, 'cancelled')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </>
                  )}
                  {rental.status === 'approved' && (
                    <>
                      <Button 
                        variant="ghost" 
                        className="text-primary hover:text-blue-700 mr-2"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => handleStatusUpdate(rental.id, 'completed')}
                      >
                        <CheckSquare className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    </>
                  )}
                  {(rental.status === 'completed' || rental.status === 'cancelled') && (
                    <Button 
                      variant="ghost" 
                      className="text-primary hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View History
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
