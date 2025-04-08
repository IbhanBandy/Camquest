import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Camera model
export const cameras = pgTable("cameras", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  pricePerDay: doublePrecision("price_per_day").notNull(),
  totalUnits: integer("total_units").notNull(),
  availableUnits: integer("available_units").notNull(),
  specifications: text("specifications").array().notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertCameraSchema = createInsertSchema(cameras).omit({
  id: true,
});

export type InsertCamera = z.infer<typeof insertCameraSchema>;
export type Camera = typeof cameras.$inferSelect;

// Rental request model
export const rentalRequests = pgTable("rental_requests", {
  id: serial("id").primaryKey(),
  cameraId: integer("camera_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, completed, cancelled
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Create a custom schema with proper date handling
export const insertRentalRequestSchema = createInsertSchema(rentalRequests)
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    // Ensure dates are properly validated
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  });

export type InsertRentalRequest = z.infer<typeof insertRentalRequestSchema>;
export type RentalRequest = typeof rentalRequests.$inferSelect;
