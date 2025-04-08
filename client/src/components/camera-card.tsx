import { Camera } from '@shared/schema';
import { Cpu, Battery, Gauge, Camera as CameraIcon, Calendar, Video, Wind, Edit, Trash, PlusCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

interface CameraCardProps {
  camera: Camera;
  onRentClick: (camera: Camera) => void;
  onEditClick?: (camera: Camera) => void;
  onDeleteClick?: (camera: Camera) => void;
}

export default function CameraCard({ camera, onRentClick, onEditClick, onDeleteClick }: CameraCardProps) {
  const isAvailable = camera.availableUnits > 0;
  const { isAdmin } = useAuth();
  const [showAdminControls, setShowAdminControls] = useState(false);
  
  // Map specification icons based on the text
  const getSpecIcon = (spec: string) => {
    const specLower = spec.toLowerCase();
    if (specLower.includes('video') || specLower.includes('recording') || specLower.includes('fps')) {
      return <Video className="text-blue-500 w-4 h-4 mr-2 flex-shrink-0" />;
    } else if (specLower.includes('battery')) {
      return <Battery className="text-green-500 w-4 h-4 mr-2 flex-shrink-0" />;
    } else if (specLower.includes('ai') || specLower.includes('tracking')) {
      return <Cpu className="text-purple-500 w-4 h-4 mr-2 flex-shrink-0" />;
    } else if (specLower.includes('weather') || specLower.includes('proof')) {
      return <Wind className="text-cyan-500 w-4 h-4 mr-2 flex-shrink-0" />;
    } else {
      return <Gauge className="text-orange-500 w-4 h-4 mr-2 flex-shrink-0" />;
    }
  };

  return (
    <Card className={`overflow-hidden border-blue-100 hover:shadow-xl transition-all duration-300 ${!isAvailable ? 'opacity-80' : ''}`}>
      <div className="relative">
        <img 
          src={camera.imageUrl} 
          alt={camera.name} 
          className={`w-full h-56 object-cover ${!isAvailable ? 'filter grayscale' : ''}`}
        />
        
        {isAdmin && (
          <div className="absolute top-3 left-3 flex space-x-2">
            <Button 
              size="icon" 
              variant="default" 
              className="bg-blue-600 hover:bg-blue-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                if (onEditClick) onEditClick(camera);
              }}
              title="Edit Camera"
            >
              <Edit className="h-4 w-4 text-white" />
            </Button>
            <Button 
              size="icon" 
              variant="destructive" 
              className="rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                if (onDeleteClick) onDeleteClick(camera);
              }}
              title="Delete Camera"
            >
              <Trash className="h-4 w-4 text-white" />
            </Button>
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 font-medium">
              Available: {camera.availableUnits}
            </Badge>
          ) : (
            <Badge className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 font-medium">
              Out of Stock
            </Badge>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">{camera.name}</h3>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <CameraIcon className="text-blue-600 w-5 h-5 mr-2" />
            <span className="text-blue-900 font-medium">{camera.category}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="text-blue-600 w-5 h-5 mr-2" />
            <span className={`text-xl font-bold ${isAvailable ? 'text-blue-600' : 'text-gray-500'}`}>
              ${camera.pricePerDay}<span className="text-sm font-normal">/day</span>
            </span>
          </div>
        </div>
          
        <p className="text-gray-600 mb-4 line-clamp-2">{camera.description}</p>
          
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Key Specifications:</h4>
          <div className="grid grid-cols-1 gap-2">
            {camera.specifications.map((spec, index) => (
              <div key={index} className="flex items-center text-sm text-gray-700">
                {getSpecIcon(spec)}
                <span className="line-clamp-1">{spec}</span>
              </div>
            ))}
          </div>
        </div>
          
        {isAvailable ? (
          <Button 
            onClick={() => onRentClick(camera)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
          >
            Rent Now
          </Button>
        ) : (
          <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
            Currently Unavailable
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
