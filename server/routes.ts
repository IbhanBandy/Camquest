import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCameraSchema, insertRentalRequestSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { sendRentalRequestNotification } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Camera routes
  app.get("/api/cameras", async (req, res) => {
    try {
      const cameras = await storage.getCameras();
      res.json(cameras);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cameras" });
    }
  });

  app.get("/api/cameras/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid camera ID" });
      }

      const camera = await storage.getCameraById(id);
      if (!camera) {
        return res.status(404).json({ message: "Camera not found" });
      }

      res.json(camera);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch camera" });
    }
  });

  app.post("/api/cameras", async (req, res) => {
    try {
      const result = insertCameraSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }

      const camera = await storage.createCamera(result.data);
      res.status(201).json(camera);
    } catch (error) {
      res.status(500).json({ message: "Failed to create camera" });
    }
  });

  app.put("/api/cameras/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid camera ID" });
      }

      // Only validate the fields that are present in the request
      const camera = await storage.getCameraById(id);
      if (!camera) {
        return res.status(404).json({ message: "Camera not found" });
      }

      const updatedCamera = await storage.updateCamera(id, req.body);
      res.json(updatedCamera);
    } catch (error) {
      res.status(500).json({ message: "Failed to update camera" });
    }
  });

  app.delete("/api/cameras/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid camera ID" });
      }

      const success = await storage.deleteCamera(id);
      if (!success) {
        return res.status(404).json({ message: "Camera not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete camera" });
    }
  });

  // Rental routes
  app.get("/api/rentals", async (req, res) => {
    try {
      const rentals = await storage.getRentalRequests();
      res.json(rentals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rental requests" });
    }
  });

  app.get("/api/rentals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid rental ID" });
      }

      const rental = await storage.getRentalRequestById(id);
      if (!rental) {
        return res.status(404).json({ message: "Rental request not found" });
      }

      res.json(rental);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rental request" });
    }
  });

  app.post("/api/rentals", async (req, res) => {
    try {
      const result = insertRentalRequestSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }

      // Check if camera exists and has enough available units
      const camera = await storage.getCameraById(result.data.cameraId);
      if (!camera) {
        return res.status(404).json({ message: "Camera not found" });
      }

      if (camera.availableUnits < result.data.quantity) {
        return res.status(400).json({ 
          message: `Not enough units available. Only ${camera.availableUnits} units left.` 
        });
      }

      const rental = await storage.createRentalRequest(result.data);
      
      // Log the rental request details for the admin
      console.log('\n--------------------------------');
      console.log('NEW RENTAL REQUEST RECEIVED:');
      console.log('--------------------------------');
      console.log(`Camera ID: ${rental.cameraId}`);
      console.log(`Customer: ${rental.customerName}`);
      console.log(`Email: ${rental.customerEmail}`);
      console.log(`Phone: ${rental.customerPhone}`);
      console.log(`Dates: ${rental.startDate.toISOString().split('T')[0]} to ${rental.endDate.toISOString().split('T')[0]}`);
      console.log(`Quantity: ${rental.quantity}`);
      console.log(`Total Price: $${rental.totalPrice.toFixed(2)}`);
      console.log(`Status: ${rental.status}`);
      console.log('--------------------------------\n');
      
      // Send email notification to admin
      try {
        const emailSent = await sendRentalRequestNotification(rental, camera);
        if (emailSent) {
          console.log(`Email notification sent to admin for rental request #${rental.id}`);
        } else {
          console.warn(`Failed to send email notification for rental request #${rental.id}`);
        }
      } catch (emailError) {
        console.error('Error in email notification process:', emailError);
        // Don't fail the request if email sending fails
      }
      
      res.status(201).json(rental);
    } catch (error) {
      res.status(500).json({ message: "Failed to create rental request" });
    }
  });

  app.put("/api/rentals/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid rental ID" });
      }

      const { status } = req.body;
      if (!status || !["pending", "approved", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const rental = await storage.updateRentalRequestStatus(id, status);
      if (!rental) {
        return res.status(404).json({ message: "Rental request not found" });
      }

      res.json(rental);
    } catch (error) {
      res.status(500).json({ message: "Failed to update rental status" });
    }
  });

  return httpServer;
}
