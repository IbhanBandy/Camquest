import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CameraRental</h3>
            <p className="text-gray-300">
              Your trusted source for high-quality camera rentals. Perfect for filmmakers, photographers, and sports enthusiasts.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#camera-listings" className="text-gray-300 hover:text-white">Available Cameras</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Rental Policies</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">FAQs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <MapPin className="w-5 h-5 text-primary mr-2" />
                <span>123 Camera Street, Photocity, PC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-primary mr-2" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-primary mr-2" />
                <span>info@camerarental.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© {new Date().getFullYear()} CameraRental. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
