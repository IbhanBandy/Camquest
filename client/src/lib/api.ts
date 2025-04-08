import { apiRequest } from "./queryClient";
import type { Camera, InsertCamera, RentalRequest, InsertRentalRequest } from "@shared/schema";

// Camera API
export const getCameras = async (): Promise<Camera[]> => {
  const res = await fetch("/api/cameras");
  if (!res.ok) throw new Error("Failed to fetch cameras");
  return res.json();
};

export const getCameraById = async (id: number): Promise<Camera> => {
  const res = await fetch(`/api/cameras/${id}`);
  if (!res.ok) throw new Error("Failed to fetch camera");
  return res.json();
};

export const createCamera = async (camera: InsertCamera): Promise<Camera> => {
  const res = await apiRequest("POST", "/api/cameras", camera);
  return res.json();
};

export const updateCamera = async (id: number, updates: Partial<Camera>): Promise<Camera> => {
  const res = await apiRequest("PUT", `/api/cameras/${id}`, updates);
  return res.json();
};

export const deleteCamera = async (id: number): Promise<void> => {
  await apiRequest("DELETE", `/api/cameras/${id}`);
};

// Rental API
export const getRentalRequests = async (): Promise<RentalRequest[]> => {
  const res = await fetch("/api/rentals");
  if (!res.ok) throw new Error("Failed to fetch rental requests");
  return res.json();
};

export const createRentalRequest = async (rentalRequest: InsertRentalRequest): Promise<RentalRequest> => {
  const res = await apiRequest("POST", "/api/rentals", rentalRequest);
  return res.json();
};

export const updateRentalStatus = async (id: number, status: string): Promise<RentalRequest> => {
  const res = await apiRequest("PUT", `/api/rentals/${id}/status`, { status });
  return res.json();
};
