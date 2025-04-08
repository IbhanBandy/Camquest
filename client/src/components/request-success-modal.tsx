import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CheckCircle, Mail, Calendar, Clock, Camera } from 'lucide-react';

interface RequestSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerEmail: string;
}

export default function RequestSuccessModal({ isOpen, onClose, customerEmail }: RequestSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[95vh] overflow-y-auto p-6 text-center">
        <div className="flex flex-col items-center justify-center py-6">
          {/* Success Icon with animation */}
          <div className="mb-6 rounded-full bg-gradient-to-br from-green-50 to-green-100 p-3 shadow-sm animate-fade-in-scale">
            <CheckCircle className="h-16 w-16 text-green-600" strokeWidth={1.5} />
          </div>
          
          {/* Title with gradient */}
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Request Submitted Successfully!
          </h2>
          
          <div className="text-gray-600 mb-8 max-w-sm">
            <p className="mb-4 text-base">
              Thank you for your rental request. Our team will review your submission and respond to you shortly.
            </p>
            
            {/* Email notification info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg text-left mb-6 shadow-sm">
              <div className="flex items-center mb-3">
                <Mail className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                <h3 className="font-medium text-blue-800">Email Confirmation</h3>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                A confirmation email has been sent to:
              </p>
              <p className="font-medium text-blue-900 bg-white/80 rounded-md py-2 px-3 text-center mb-3 border border-blue-100">
                {customerEmail}
              </p>
              <div className="bg-blue-100 p-3 rounded border border-blue-200">
                <p className="text-blue-800 font-medium text-sm">
                  You will receive follow-up communications from <strong>kaleb.gill420@gmail.com</strong>. 
                  Please ensure this email address is added to your contacts to prevent messages from being filtered as spam.
                </p>
              </div>
            </div>
          </div>
          
          {/* Return button */}
          <div className="w-full">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm"
              onClick={onClose}
            >
              Return to Camera Listings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}