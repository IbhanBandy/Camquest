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
    
    // Just one camera with limited stock
    this.createCamera({
      name: "Veo Cam Three",
      description: "Premium sports camera with cutting-edge tracking technology and AI-powered automated recording",
      category: "Sports Camera",
      pricePerDay: 99,
      totalUnits: 1,
      availableUnits: 1,
      specifications: [
        "AI-powered automatic tracking", 
        "4K Video at 60fps", 
        "180° field of view",
        "10-hour Battery Life", 
        "Weatherproof design"
      ],
      imageUrl: "https://images.unsplash.com/photo-1593080358201-08e4ff5f93d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
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
    
    // Ensure status is always a string (default to 'pending' if not provided)
    const status = rentalRequest.status || 'pending';
    
    const newRentalRequest: RentalRequest = { 
      ...rentalRequest, 
      id,
      status, // Use the properly defaulted status
      createdAt: new Date()
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
