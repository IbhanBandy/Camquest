import { Camera } from '@shared/schema';
import { Cpu, Battery, Gauge } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface CameraCardProps {
  camera: Camera;
  onRentClick: (camera: Camera) => void;
}

export default function CameraCard({ camera, onRentClick }: CameraCardProps) {
  const isAvailable = camera.availableUnits > 0;
  
  // Map specification icons based on the text
  const getSpecIcon = (spec: string) => {
    if (spec.toLowerCase().includes('video') || spec.toLowerCase().includes('recording')) {
      return <Cpu className="text-gray-500 w-5 h-5 mr-2" />;
    } else if (spec.toLowerCase().includes('battery')) {
      return <Battery className="text-gray-500 w-5 h-5 mr-2" />;
    } else {
      return <Gauge className="text-gray-500 w-5 h-5 mr-2" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition ${!isAvailable ? 'opacity-75' : ''}`}>
      <div className="relative">
        <img 
          src={camera.imageUrl} 
          alt={camera.name} 
          className={`w-full h-48 object-cover ${!isAvailable ? 'filter grayscale' : ''}`}
        />
        <div className="absolute top-2 right-2">
          {isAvailable ? (
            <Badge variant="success">
              Available: {camera.availableUnits}
            </Badge>
          ) : (
            <Badge variant="danger">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{camera.name}</h3>
        <p className="text-gray-600 mt-1 text-sm">{camera.description}</p>
        <div className="mt-3 space-y-2">
          {camera.specifications.map((spec, index) => (
            <div key={index} className="flex items-center text-sm">
              {getSpecIcon(spec)}
              <span>{spec}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className={`${isAvailable ? 'text-primary' : 'text-gray-500'} font-bold`}>
            ${camera.pricePerDay}/day
          </span>
          {isAvailable ? (
            <Button 
              onClick={() => onRentClick(camera)}
              className="bg-primary hover:bg-blue-700 text-white"
            >
              Rent Now
            </Button>
          ) : (
            <Button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed">
              Unavailable
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
