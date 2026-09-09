export type CargoStatus = "RECEIVED" | "UNDER_REVIEW" | "MATCHING" | "ASSIGNMENT_PENDING" | "ASSIGNED" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED" | "REJECTED";

export type CarrierStatus = "ACTIVE" | "BLOCKED" | "INACTIVE";
export type AvailabilityStatus = "AVAILABLE" | "UNAVAILABLE";

export type Cargo = {
  id: string;
  tenantId: string;
  weightKg: number;
  vehicleTypeRequired: string;
  destinationRegion: string;
  status: CargoStatus;
};

export type Carrier = {
  id: string;
  tenantId: string;
  name: string;
  capacityKg: number;
  vehicleType: string;
  coverageRegions: string[];
  status: CarrierStatus;
  availabilityStatus: AvailabilityStatus;
  documentStatus: "VERIFIED" | "PENDING" | "BLOCKED";
};

export type MatchReason = "CAPACITY_MATCH" | "VEHICLE_MATCH" | "DESTINATION_COVERAGE" | "AVAILABLE";

export type CarrierMatch = {
  carrierId: string;
  score: number;
  reasons: MatchReason[];
  warnings: string[];
};

const transitions: Record<CargoStatus, CargoStatus[]> = {
  RECEIVED: ["UNDER_REVIEW", "REJECTED", "CANCELLED"],
  UNDER_REVIEW: ["MATCHING", "REJECTED", "CANCELLED"],
  MATCHING: ["ASSIGNMENT_PENDING", "UNDER_REVIEW", "CANCELLED"],
  ASSIGNMENT_PENDING: ["ASSIGNED", "MATCHING", "CANCELLED"],
  ASSIGNED: ["IN_TRANSIT", "CANCELLED"],
  IN_TRANSIT: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
  REJECTED: [],
};

export function canTransitionCargo(from: CargoStatus, to: CargoStatus): boolean {
  return transitions[from].includes(to);
}

export function matchCarriers(cargo: Cargo, carriers: Carrier[]): CarrierMatch[] {
  return carriers
    .filter((carrier) => carrier.tenantId === cargo.tenantId)
    .map((carrier) => {
      const reasons: MatchReason[] = [];
      const warnings: string[] = [];
      if (carrier.capacityKg >= cargo.weightKg) reasons.push("CAPACITY_MATCH");
      if (carrier.vehicleType === cargo.vehicleTypeRequired) reasons.push("VEHICLE_MATCH");
      if (carrier.coverageRegions.includes(cargo.destinationRegion)) reasons.push("DESTINATION_COVERAGE");
      if (carrier.status === "ACTIVE" && carrier.availabilityStatus === "AVAILABLE") reasons.push("AVAILABLE");
      if (carrier.documentStatus !== "VERIFIED") warnings.push("DOCUMENTS_NOT_VERIFIED");
      if (carrier.capacityKg < cargo.weightKg) warnings.push("INSUFFICIENT_CAPACITY");
      if (carrier.vehicleType !== cargo.vehicleTypeRequired) warnings.push("VEHICLE_MISMATCH");
      const score = Math.round((reasons.length / 4) * 100);
      return { carrierId: carrier.id, score, reasons, warnings };
    })
    .filter((match) => match.reasons.includes("CAPACITY_MATCH") && match.reasons.includes("AVAILABLE"))
    .sort((a, b) => b.score - a.score);
}
