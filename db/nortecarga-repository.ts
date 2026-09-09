import { desc, eq } from "drizzle-orm";
import { getDb } from "./index";
import { cargos } from "./schema";

export type CreateCargoInput = {
  id: string;
  tenantId: string;
  cargoType: string;
  weightKg: number;
  volumeM3?: number;
  originCity: string;
  originRegion: string;
  destinationCity: string;
  destinationRegion: string;
  availableFrom: string;
  vehicleTypeRequired: string;
  notes?: string;
  idempotencyKey: string;
};

export async function listCargos(tenantId: string) {
  if (!tenantId) throw new Error("TENANT_REQUIRED");
  return getDb().select().from(cargos).where(eq(cargos.tenantId, tenantId)).orderBy(desc(cargos.createdAt));
}

export async function createCargo(input: CreateCargoInput) {
  if (!input.tenantId) throw new Error("TENANT_REQUIRED");
  if (input.weightKg <= 0) throw new Error("WEIGHT_MUST_BE_POSITIVE");
  if (!input.idempotencyKey) throw new Error("IDEMPOTENCY_KEY_REQUIRED");
  const now = new Date().toISOString();
  await getDb().insert(cargos).values({
    id: input.id,
    tenantId: input.tenantId,
    cargoType: input.cargoType,
    weightKg: input.weightKg,
    volumeM3: input.volumeM3,
    originCity: input.originCity,
    originRegion: input.originRegion,
    destinationCity: input.destinationCity,
    destinationRegion: input.destinationRegion,
    availableFrom: input.availableFrom,
    vehicleTypeRequired: input.vehicleTypeRequired,
    notes: input.notes,
    idempotencyKey: input.idempotencyKey,
    status: "RECEIVED",
    createdAt: now,
    updatedAt: now,
  }).onConflictDoNothing();
  return getDb().select().from(cargos).where(eq(cargos.id, input.id)).get();
}
