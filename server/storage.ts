import { 
  cameras, 
  type Camera, 
  type InsertCamera, 
  rentalRequests, 
  type RentalRequest, 
  type InsertRentalRequest 
} from "@shared/schema";

export interface IStorage {
  // Camera operations
  getCameras(): Promise<Camera[]>;
  getCameraById(id: number): Promise<Camera | undefined>;
  createCamera(camera: InsertCamera): Promise<Camera>;
  updateCamera(id: number, camera: Partial<Camera>): Promise<Camera | undefined>;
  deleteCamera(id: number): Promise<boolean>;
  
  // Rental operations
  getRentalRequests(): Promise<RentalRequest[]>;
  getRentalRequestById(id: number): Promise<RentalRequest | undefined>;
  createRentalRequest(rentalRequest: InsertRentalRequest): Promise<RentalRequest>;
  updateRentalRequestStatus(id: number, status: string): Promise<RentalRequest | undefined>;
}

export class MemStorage implements IStorage {
  private cameras: Map<number, Camera>;
  private rentalRequests: Map<number, RentalRequest>;
  private cameraIdCounter: number;
  private rentalIdCounter: number;

  constructor() {
    this.cameras = new Map();
    this.rentalRequests = new Map();
    this.cameraIdCounter = 1;
    this.rentalIdCounter = 1;
    
    // Initial sample data
    this.createCamera({
      name: "Veo Sports Camera",
      description: "Perfect for capturing sports events and action shots",
      category: "Sports Camera",
      pricePerDay: 35,
      totalUnits: 8,
      availableUnits: 5,
      specifications: ["4K Video Recording", "8-hour Battery Life", "High-speed Capture (120fps)"],
      imageUrl: "https://images.unsplash.com/photo-1593080358201-08e4ff5f93d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    this.createCamera({
      name: "Advanced Veo Sports Camera",
      description: "Professional-grade sports camera with advanced features",
      category: "Sports Camera",
      pricePerDay: 45,
      totalUnits: 5,
      availableUnits: 2,
      specifications: ["5K Video Recording", "10-hour Battery Life", "Ultra High-speed (240fps)"],
      imageUrl: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    this.createCamera({
      name: "Veo Pro Sports Camera",
      description: "Top-of-the-line sports camera for professional use",
      category: "Sports Camera",
      pricePerDay: 60,
      totalUnits: 3,
      availableUnits: 0,
      specifications: ["6K Video Recording", "12-hour Battery Life", "Professional Grade (360fps)"],
      imageUrl: "https://images.unsplash.com/photo-1613291261423-0e0097215311?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
  }

  // Camera operations
  async getCameras(): Promise<Camera[]> {
    return Array.from(this.cameras.values());
  }

  async getCameraById(id: number): Promise<Camera | undefined> {
    return this.cameras.get(id);
  }

  async createCamera(camera: InsertCamera): Promise<Camera> {
    const id = this.cameraIdCounter++;
    const newCamera: Camera = { ...camera, id };
    this.cameras.set(id, newCamera);
    return newCamera;
  }

  async updateCamera(id: number, updates: Partial<Camera>): Promise<Camera | undefined> {
    const camera = this.cameras.get(id);
    if (!camera) return undefined;
    
    const updatedCamera = { ...camera, ...updates };
    this.cameras.set(id, updatedCamera);
    return updatedCamera;
  }

  async deleteCamera(id: number): Promise<boolean> {
    return this.cameras.delete(id);
  }

  // Rental operations
  async getRentalRequests(): Promise<RentalRequest[]> {
    return Array.from(this.rentalRequests.values());
  }

  async getRentalRequestById(id: number): Promise<RentalRequest | undefined> {
    return this.rentalRequests.get(id);
  }

  async createRentalRequest(rentalRequest: InsertRentalRequest): Promise<RentalRequest> {
    const id = this.rentalIdCounter++;
    
    // Generate a request ID with format RNT-XXXXX
    const requestId = `RNT-${String(10000 + id).substring(1)}`;
    
    const newRentalRequest: RentalRequest = { 
      ...rentalRequest, 
      id,
      createdAt: new Date(),
    };
    
    this.rentalRequests.set(id, newRentalRequest);
    
    // Update camera availability
    const camera = await this.getCameraById(rentalRequest.cameraId);
    if (camera && camera.availableUnits >= rentalRequest.quantity) {
      await this.updateCamera(camera.id, {
        availableUnits: camera.availableUnits - rentalRequest.quantity
      });
    }
    
    return newRentalRequest;
  }

  async updateRentalRequestStatus(id: number, status: string): Promise<RentalRequest | undefined> {
    const rentalRequest = this.rentalRequests.get(id);
    if (!rentalRequest) return undefined;
    
    // Handle camera availability based on status change
    if (status === "cancelled" && rentalRequest.status !== "cancelled") {
      // Return cameras to inventory if rental is cancelled
      const camera = await this.getCameraById(rentalRequest.cameraId);
      if (camera) {
        await this.updateCamera(camera.id, {
          availableUnits: camera.availableUnits + rentalRequest.quantity
        });
      }
    } else if (rentalRequest.status === "cancelled" && status !== "cancelled") {
      // Remove cameras from inventory if rental is uncancelled
      const camera = await this.getCameraById(rentalRequest.cameraId);
      if (camera) {
        await this.updateCamera(camera.id, {
          availableUnits: camera.availableUnits - rentalRequest.quantity
        });
      }
    }
    
    const updatedRentalRequest = { ...rentalRequest, status };
    this.rentalRequests.set(id, updatedRentalRequest);
    return updatedRentalRequest;
  }
}

export const storage = new MemStorage();
