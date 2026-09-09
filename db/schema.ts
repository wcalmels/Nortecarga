import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cargos = sqliteTable("nortecarga_cargos", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  clientId: text("client_id"),
  cargoType: text("cargo_type").notNull(),
  weightKg: integer("weight_kg").notNull(),
  volumeM3: integer("volume_m3"),
  originCity: text("origin_city").notNull(),
  originRegion: text("origin_region").notNull(),
  destinationCity: text("destination_city").notNull(),
  destinationRegion: text("destination_region").notNull(),
  availableFrom: text("available_from").notNull(),
  vehicleTypeRequired: text("vehicle_type_required").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("RECEIVED"),
  idempotencyKey: text("idempotency_key").unique(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const carriers = sqliteTable("nortecarga_carriers", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  legalName: text("legal_name").notNull(),
  contactName: text("contact_name"),
  phone: text("phone"),
  email: text("email"),
  vehicleType: text("vehicle_type").notNull(),
  vehiclePlate: text("vehicle_plate").notNull(),
  capacityKg: integer("capacity_kg").notNull(),
  coverageRegions: text("coverage_regions").notNull(),
  availabilityStatus: text("availability_status").notNull().default("AVAILABLE"),
  documentStatus: text("document_status").notNull().default("PENDING"),
  status: text("status").notNull().default("ACTIVE"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const operations = sqliteTable("nortecarga_operations", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  cargoId: text("cargo_id").notNull(),
  carrierId: text("carrier_id"),
  status: text("status").notNull().default("ASSIGNMENT_PENDING"),
  assignmentReviewRequired: integer("assignment_review_required", { mode: "boolean" }).notNull().default(true),
  reviewerId: text("reviewer_id"),
  reviewedAt: text("reviewed_at"),
  progressPercent: integer("progress_percent").notNull().default(0),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const operationEvents = sqliteTable("nortecarga_operation_events", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  operationId: text("operation_id").notNull(),
  eventType: text("event_type").notNull(),
  actorId: text("actor_id").notNull(),
  payloadJson: text("payload_json").notNull(),
  createdAt: text("created_at").notNull(),
});
