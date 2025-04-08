import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Camera as CameraIcon, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 text-primary font-bold text-2xl flex items-center">
              <CameraIcon className="mr-2" />
              <span>CameraRental</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <nav className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="px-3 py-2 text-primary font-medium hover:text-blue-700">
                Home
              </Link>
              <a href="#" className="px-3 py-2 text-gray-700 font-medium hover:text-primary">
                About
              </a>
              <a href="#" className="px-3 py-2 text-gray-700 font-medium hover:text-primary">
                Contact
              </a>
              <Link href="/admin" className="px-3 py-2 bg-primary text-white rounded-md font-medium hover:bg-blue-700">
                Admin Panel
              </Link>
            </nav>
          </div>
          <div className="md:hidden">
            <button 
              type="button" 
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-primary"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-primary font-medium"
            >
              Home
            </Link>
            <a 
              href="#" 
              className="block px-3 py-2 text-gray-700 font-medium hover:text-primary"
            >
              About
            </a>
            <a 
              href="#" 
              className="block px-3 py-2 text-gray-700 font-medium hover:text-primary"
            >
              Contact
            </a>
            <Link 
              href="/admin" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 bg-primary text-white rounded-md font-medium hover:bg-blue-700"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
