import { useState } from 'react';
import { Search } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';

interface FilterBarProps {
  onFilterChange: (filters: { category: string; availability: string; search: string }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [category, setCategory] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [search, setSearch] = useState('');

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onFilterChange({ category: value, availability, search });
  };

  const handleAvailabilityChange = (value: string) => {
    setAvailability(value);
    onFilterChange({ category, availability: value, search });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ category, availability, search: e.target.value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="w-full md:w-48">
            <Label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
              Category
            </Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-filter" className="mt-1">
                <SelectValue placeholder="All Cameras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cameras</SelectItem>
                <SelectItem value="Sports Camera">Sports Cameras</SelectItem>
                <SelectItem value="DSLR">DSLR</SelectItem>
                <SelectItem value="Mirrorless">Mirrorless</SelectItem>
                <SelectItem value="Video Camera">Video Camera</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Label htmlFor="availability-filter" className="text-sm font-medium text-gray-700">
              Availability
            </Label>
            <Select value={availability} onValueChange={handleAvailabilityChange}>
              <SelectTrigger id="availability-filter" className="mt-1">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available Now</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-3 md:mt-0 w-full md:w-64">
          <Label htmlFor="search" className="text-sm font-medium text-gray-700">
            Search
          </Label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              id="search"
              value={search}
              onChange={handleSearchChange}
              className="pl-10"
              placeholder="Search cameras..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
