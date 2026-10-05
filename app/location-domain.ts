export type LocationSource = "DEVICE_GPS" | "FLEET_GPS" | "MANUAL";
export type LocationQuality = "HIGH" | "MEDIUM" | "LOW" | "STALE" | "INVALID";

export type LocationFix = {
  id: string;
  tenantId: string;
  operationId: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  observedAt: string;
  source: LocationSource;
};

export type Geofence = {
  id: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
};

export type TripLocationEventType =
  | "LOCATION_ACCEPTED"
  | "LOCATION_STALE"
  | "ENTERED_PICKUP_GEOFENCE"
  | "EXITED_PICKUP_GEOFENCE"
  | "ENTERED_DELIVERY_GEOFENCE"
  | "EXITED_DELIVERY_GEOFENCE";

export type TripLocationEvent = {
  type: TripLocationEventType;
  operationId: string;
  locationId: string;
  observedAt: string;
};

const EARTH_RADIUS_METERS = 6_371_008.8;

export function isValidLocationFix(fix: LocationFix): boolean {
  return Boolean(
    fix.id &&
    fix.tenantId &&
    fix.operationId &&
    fix.vehicleId &&
    Number.isFinite(fix.latitude) &&
    Number.isFinite(fix.longitude) &&
    fix.latitude >= -90 &&
    fix.latitude <= 90 &&
    fix.longitude >= -180 &&
    fix.longitude <= 180 &&
    Number.isFinite(fix.accuracyMeters) &&
    fix.accuracyMeters > 0 &&
    !Number.isNaN(Date.parse(fix.observedAt)),
  );
}

export function classifyLocationQuality(
  fix: LocationFix,
  now: Date = new Date(),
): LocationQuality {
  if (!isValidLocationFix(fix)) return "INVALID";
  const ageMs = now.getTime() - Date.parse(fix.observedAt);
  if (ageMs < -60_000 || ageMs > 5 * 60_000) return "STALE";
  if (fix.accuracyMeters <= 20) return "HIGH";
  if (fix.accuracyMeters <= 75) return "MEDIUM";
  return "LOW";
}

export function haversineDistanceMeters(
  a: Pick<LocationFix, "latitude" | "longitude">,
  b: Pick<LocationFix, "latitude" | "longitude">,
): number {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = radians(b.latitude - a.latitude);
  const dLon = radians(b.longitude - a.longitude);
  const lat1 = radians(a.latitude);
  const lat2 = radians(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}

export function isInsideGeofence(
  fix: Pick<LocationFix, "latitude" | "longitude">,
  geofence: Geofence,
): boolean {
  if (!Number.isFinite(geofence.radiusMeters) || geofence.radiusMeters <= 0) return false;
  return haversineDistanceMeters(fix, geofence) <= geofence.radiusMeters;
}

export function deriveTripLocationEvents(input: {
  previous?: LocationFix;
  current: LocationFix;
  pickup?: Geofence;
  delivery?: Geofence;
  now?: Date;
}): TripLocationEvent[] {
  const { previous, current, pickup, delivery, now = new Date() } = input;
  if (!isValidLocationFix(current)) return [];
  const quality = classifyLocationQuality(current, now);
  const events: TripLocationEvent[] = [{
    type: quality === "STALE" ? "LOCATION_STALE" : "LOCATION_ACCEPTED",
    operationId: current.operationId,
    locationId: current.id,
    observedAt: current.observedAt,
  }];

  const appendTransition = (
    geofence: Geofence | undefined,
    entered: TripLocationEventType,
    exited: TripLocationEventType,
  ) => {
    if (!geofence || !previous) return;
    const wasInside = isInsideGeofence(previous, geofence);
    const isInside = isInsideGeofence(current, geofence);
    if (!wasInside && isInside) events.push({ type: entered, operationId: current.operationId, locationId: current.id, observedAt: current.observedAt });
    if (wasInside && !isInside) events.push({ type: exited, operationId: current.operationId, locationId: current.id, observedAt: current.observedAt });
  };

  appendTransition(pickup, "ENTERED_PICKUP_GEOFENCE", "EXITED_PICKUP_GEOFENCE");
  appendTransition(delivery, "ENTERED_DELIVERY_GEOFENCE", "EXITED_DELIVERY_GEOFENCE");
  return events;
}
