import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, Camera } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-900 to-blue-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <Camera className="h-8 w-8 mr-2 text-blue-400" />
              <h3 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">CamQuest</span>
              </h3>
            </div>
            <p className="text-blue-200">
              Your exclusive source for high-performance sports cameras. Experience professional-grade recording with our premium Veo Cam Three.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Our Service</h3>
            <ul className="space-y-2">
              <li><a href="#camera-listings" className="text-blue-100 hover:text-white transition-colors">Available Cameras</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Rental Process</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Customer Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Usage Guide</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Contact Us</h3>
            <ul className="space-y-3 text-blue-100">
              <li className="flex items-center">
                <MapPin className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                <span>123 Stadium Avenue, Sports City, 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                <span>info@camquest.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-blue-800/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-300">© {new Date().getFullYear()} CamQuest. All rights reserved.</p>
          <div className="flex space-x-6 mt-6 md:mt-0">
            <a href="#" className="text-blue-400 hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-blue-400 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-blue-400 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-blue-400 hover:text-white transition-colors">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
