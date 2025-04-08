import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import InventoryTab from '@/components/admin/inventory-tab';
import AddCameraTab from '@/components/admin/add-camera-tab';
import RentalRequestsTab from '@/components/admin/rental-requests-tab';

type TabType = 'inventory' | 'add-camera' | 'rentals';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>('inventory');
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Panel</h2>
              <p className="mt-2 text-gray-600">Manage your camera inventory</p>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button 
                    className={`px-6 py-4 border-b-2 font-medium text-sm ${
                      activeTab === 'inventory' 
                        ? 'text-primary border-primary' 
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-transparent'
                    }`}
                    onClick={() => setActiveTab('inventory')}
                  >
                    Camera Inventory
                  </button>
                  <button 
                    className={`px-6 py-4 border-b-2 font-medium text-sm ${
                      activeTab === 'add-camera' 
                        ? 'text-primary border-primary' 
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-transparent'
                    }`}
                    onClick={() => setActiveTab('add-camera')}
                  >
                    Add New Camera
                  </button>
                  <button 
                    className={`px-6 py-4 border-b-2 font-medium text-sm ${
                      activeTab === 'rentals' 
                        ? 'text-primary border-primary' 
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-transparent'
                    }`}
                    onClick={() => setActiveTab('rentals')}
                  >
                    Rental Requests
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === 'inventory' && <InventoryTab />}
                {activeTab === 'add-camera' && <AddCameraTab />}
                {activeTab === 'rentals' && <RentalRequestsTab />}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
