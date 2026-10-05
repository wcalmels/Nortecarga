import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyLocationQuality,
  deriveTripLocationEvents,
  haversineDistanceMeters,
  isInsideGeofence,
  isValidLocationFix,
} from "../app/location-domain.ts";

const now = new Date("2026-10-04T23:00:00.000Z");
const base = {
  id: "loc-1",
  tenantId: "tenant-a",
  operationId: "op-1",
  vehicleId: "veh-1",
  latitude: -20.2208,
  longitude: -70.1431,
  accuracyMeters: 12,
  observedAt: "2026-10-04T22:59:30.000Z",
  source: "DEVICE_GPS",
};

test("location fixes fail closed on invalid coordinates", () => {
  assert.equal(isValidLocationFix(base), true);
  assert.equal(isValidLocationFix({ ...base, latitude: 91 }), false);
  assert.equal(isValidLocationFix({ ...base, longitude: -181 }), false);
  assert.equal(isValidLocationFix({ ...base, accuracyMeters: 0 }), false);
});

test("location quality is deterministic and stale after five minutes", () => {
  assert.equal(classifyLocationQuality(base, now), "HIGH");
  assert.equal(classifyLocationQuality({ ...base, accuracyMeters: 55 }, now), "MEDIUM");
  assert.equal(classifyLocationQuality({ ...base, accuracyMeters: 140 }, now), "LOW");
  assert.equal(classifyLocationQuality({ ...base, observedAt: "2026-10-04T22:50:00.000Z" }, now), "STALE");
});

test("haversine distance and geofence entry derive trip events", () => {
  const pickup = { id: "pickup", latitude: -20.2208, longitude: -70.1431, radiusMeters: 500 };
  const previous = { ...base, id: "loc-0", latitude: -20.2300, longitude: -70.1431 };
  const current = { ...base, id: "loc-1" };

  assert.ok(haversineDistanceMeters(previous, current) > 500);
  assert.equal(isInsideGeofence(previous, pickup), false);
  assert.equal(isInsideGeofence(current, pickup), true);

  assert.deepEqual(
    deriveTripLocationEvents({ previous, current, pickup, now }).map((event) => event.type),
    ["LOCATION_ACCEPTED", "ENTERED_PICKUP_GEOFENCE"],
  );
});

test("invalid fixes never create operational events", () => {
  const invalid = { ...base, id: "bad", latitude: Number.NaN };
  assert.deepEqual(deriveTripLocationEvents({ current: invalid, now }), []);
});
