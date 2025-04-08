import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Camera as CameraIcon, Menu, X, LogIn, User, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { signOutUser } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { user, isAdmin } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      setLocation('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-md border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 font-bold text-2xl flex items-center">
              <CameraIcon className="h-7 w-7 mr-2 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">CamQuest</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <nav className="ml-10 flex items-baseline space-x-6">
              <Link href="/" className="px-3 py-2 text-blue-600 font-medium hover:text-blue-800 transition-colors">
                Home
              </Link>
              <a href="#camera-listings" className="px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors">
                Cameras
              </a>
              <a href="#" className="px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors">
                About
              </a>
              
              {/* Show admin panel link only for admins */}
              {isAdmin && (
                <Link href="/admin" className="px-3 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
                  Admin Panel
                </Link>
              )}

              {/* User authentication */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 border-blue-200">
                      <User size={18} className="text-blue-600" />
                      <span className="max-w-[120px] truncate">{user.displayName || user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <DropdownMenuItem className="cursor-pointer">
                        <Link href="/admin" className="flex items-center w-full">
                          <CameraIcon className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button variant="outline" className="flex items-center gap-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <LogIn size={18} className="text-blue-600" />
                    <span>Log In</span>
                  </Button>
                </Link>
              )}
            </nav>
          </div>
          <div className="md:hidden">
            <button 
              type="button" 
              onClick={toggleMobileMenu}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg border-t border-blue-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-blue-600 font-medium rounded-md hover:bg-blue-50"
            >
              Home
            </Link>
            <a 
              href="#camera-listings" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 font-medium rounded-md hover:bg-blue-50 hover:text-blue-600"
            >
              Cameras
            </a>
            <a 
              href="#" 
              className="block px-4 py-3 text-gray-700 font-medium rounded-md hover:bg-blue-50 hover:text-blue-600"
            >
              About
            </a>
            
            {isAdmin && (
              <Link 
                href="/admin" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
              >
                Admin Panel
              </Link>
            )}
            
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-red-600 font-medium rounded-md hover:bg-red-50"
              >
                <div className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out ({user.displayName || user.email})</span>
                </div>
              </button>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-600 font-medium rounded-md hover:bg-blue-50 border border-blue-200"
              >
                <div className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Log In</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
