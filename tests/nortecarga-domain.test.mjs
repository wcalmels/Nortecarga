import test from "node:test";
import assert from "node:assert/strict";
import { canTransitionCargo, matchCarriers } from "../app/nortecarga-domain.ts";

test("compatibility is tenant scoped and returns deterministic reasons", () => {
  const cargo = { id: "c1", tenantId: "tenant-a", weightKg: 11000, vehicleTypeRequired: "semi", destinationRegion: "Antofagasta", status: "MATCHING" };
  const carriers = [
    { id: "good", tenantId: "tenant-a", name: "North", capacityKg: 28000, vehicleType: "semi", coverageRegions: ["Antofagasta"], status: "ACTIVE", availabilityStatus: "AVAILABLE", documentStatus: "VERIFIED" },
    { id: "other-tenant", tenantId: "tenant-b", name: "Other", capacityKg: 50000, vehicleType: "semi", coverageRegions: ["Antofagasta"], status: "ACTIVE", availabilityStatus: "AVAILABLE", documentStatus: "VERIFIED" },
    { id: "blocked", tenantId: "tenant-a", name: "Blocked", capacityKg: 28000, vehicleType: "semi", coverageRegions: ["Antofagasta"], status: "BLOCKED", availabilityStatus: "UNAVAILABLE", documentStatus: "BLOCKED" },
  ];
  assert.deepEqual(matchCarriers(cargo, carriers), [{ carrierId: "good", score: 100, reasons: ["CAPACITY_MATCH", "VEHICLE_MATCH", "DESTINATION_COVERAGE", "AVAILABLE"], warnings: [] }]);
});

test("cargo transitions fail closed", () => {
  assert.equal(canTransitionCargo("RECEIVED", "UNDER_REVIEW"), true);
  assert.equal(canTransitionCargo("RECEIVED", "ASSIGNED"), false);
  assert.equal(canTransitionCargo("DELIVERED", "ASSIGNED"), false);
});
