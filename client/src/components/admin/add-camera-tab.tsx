import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createCamera } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { InsertCamera } from '@shared/schema';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera } from 'lucide-react';

export default function AddCameraTab() {
  const { toast } = useToast();
  const [cameraName, setCameraName] = useState('');
  const [category, setCategory] = useState('Sports Camera');
  const [price, setPrice] = useState('');
  const [units, setUnits] = useState('');
  const [specs, setSpecs] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1593080358201-08e4ff5f93d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80');
  
  const cameraMutation = useMutation({
    mutationFn: createCamera,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cameras'] });
      toast({
        title: 'Camera Added',
        description: 'The camera has been added to your inventory.',
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add camera',
        variant: 'destructive',
      });
    }
  });
  
  const resetForm = () => {
    setCameraName('');
    setCategory('Sports Camera');
    setPrice('');
    setUnits('');
    setSpecs('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1593080358201-08e4ff5f93d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceNum = parseFloat(price);
    const unitsNum = parseInt(units);
    
    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: 'Invalid Price',
        description: 'Please enter a valid price greater than zero.',
        variant: 'destructive',
      });
      return;
    }
    
    if (isNaN(unitsNum) || unitsNum <= 0) {
      toast({
        title: 'Invalid Units',
        description: 'Please enter a valid number of units greater than zero.',
        variant: 'destructive',
      });
      return;
    }
    
    const specifications = specs.split('\n').filter(spec => spec.trim() !== '');
    
    if (specifications.length === 0) {
      toast({
        title: 'Missing Specifications',
        description: 'Please add at least one specification for the camera.',
        variant: 'destructive',
      });
      return;
    }
    
    const newCamera: InsertCamera = {
      name: cameraName,
      description,
      category,
      pricePerDay: priceNum,
      totalUnits: unitsNum,
      availableUnits: unitsNum,
      specifications,
      imageUrl
    };
    
    cameraMutation.mutate(newCamera);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="col-span-2">
          <Label htmlFor="camera-name">Camera Name</Label>
          <Input
            type="text"
            id="camera-name"
            value={cameraName}
            onChange={(e) => setCameraName(e.target.value)}
            placeholder="E.g. Veo Sports Camera Pro"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="camera-category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="camera-category" className="mt-1">
              <SelectValue placeholder="Select camera category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sports Camera">Sports Camera</SelectItem>
              <SelectItem value="DSLR">DSLR</SelectItem>
              <SelectItem value="Mirrorless">Mirrorless</SelectItem>
              <SelectItem value="Video Camera">Video Camera</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="camera-price">Daily Rental Price ($)</Label>
          <Input
            type="number"
            id="camera-price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            placeholder="45.00"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="camera-units">Number of Units</Label>
          <Input
            type="number"
            id="camera-units"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            min="1"
            placeholder="5"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="camera-image">Camera Image URL</Label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <div className="text-sm text-gray-600">
                <Label htmlFor="camera-image-url" className="relative cursor-pointer text-primary hover:text-blue-700">
                  <span>Enter an image URL</span>
                </Label>
              </div>
              <Input
                id="camera-image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-1"
              />
              <p className="text-xs text-gray-500">
                Paste a URL to a camera image
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="camera-specs">Specifications</Label>
          <Textarea
            id="camera-specs"
            value={specs}
            onChange={(e) => setSpecs(e.target.value)}
            rows={3}
            placeholder="List key camera specifications here..."
            className="mt-1"
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            Enter each specification on a new line.
          </p>
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="camera-description">Description</Label>
          <Textarea
            id="camera-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe the camera and its best uses..."
            className="mt-1"
            required
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={resetForm}
          className="mr-3"
          disabled={cameraMutation.isPending}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={cameraMutation.isPending}
        >
          {cameraMutation.isPending ? 'Adding...' : 'Add Camera'}
        </Button>
      </div>
    </form>
  );
}
