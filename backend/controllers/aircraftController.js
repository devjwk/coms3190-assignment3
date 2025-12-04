import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

// TODO: implement fetching all aircraft from the database.
export async function getAllAircraft(req, res) {
  // Should query the "aircraft" collection and return the list.
}

// TODO: implement fetching a single aircraft by its ObjectId.
export async function getAircraftById(req, res) {
  // Should find the aircraft using req.params.id and handle 404 cases.
}

// TODO: implement new aircraft creation.
export async function createAircraft(req, res) {
  // Should insert req.body into the aircraft collection and return created result.
}

// TODO: implement updating an existing aircraft.
export async function updateAircraft(req, res) {
  // Should update fields on an aircraft document based on req.params.id.
  // Handle both success and "not found" cases.
}

// TODO: implement deletion of an aircraft.
export async function deleteAircraft(req, res) {
  // Should delete by ObjectId and return appropriate success or not-found responses.
}

// KEEP FULL IMPLEMENTATION
export async function getAssignedRoutesByAircraft(req, res) {
  const db = getDB();

  const model = req.params.model; // use as string

  const aircraftList = await db
    .collection("aircraft")
    .find({ model })
    .project({ assignedRoutes: 1, serialNumber: 1 })
    .toArray();

  if (!aircraftList || aircraftList.length === 0) {
    return res.status(404).json({ message: "No routes found for this model" });
  }

  res.json({
    model,
    aircraftCount: aircraftList.length,
    routes: aircraftList.flatMap((a) => a.assignedRoutes || []),
  });
}
