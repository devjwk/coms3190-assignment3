import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

// TODO: implement fetching all aircraft from the database.
export async function getAllAircraft(req, res) {
  try {
    const db = getDB();
    const aircraft = await db.collection("aircraft").find().toArray();
    res.json(aircraft);
  } catch (error) {
    console.error("Error fetching all aircraft:", error);
    res.status(500).json({ error: "Failed to fetch aircraft" });
  }
}

// TODO: implement fetching a single aircraft by its ObjectId.
export async function getAircraftById(req, res) {
  try {
    const db = getDB();
    const aircraft = await db.collection("aircraft").findOne({ _id: new ObjectId(req.params.id) });

    if (!aircraft) {
      return res.status(404).json({ error: "Aircraft not found" });
    }

    res.json(aircraft);
  } catch (error) {
    console.error("Error fetching aircraft by ID:", error);
    res.status(500).json({ error: "Failed to fetch aircraft" });
  }
}

// TODO: implement new aircraft creation.
export async function createAircraft(req, res) {
  try {
    const db = getDB();
    const newAircraft = req.body;

    // Validate required fields
    if (!newAircraft.serialNumber || !newAircraft.model) {
      return res.status(400).json({ error: "Missing required fields: serialNumber, model" });
    }

    const result = await db.collection("aircraft").insertOne(newAircraft);
    const createdAircraft = await db.collection("aircraft").findOne({ _id: result.insertedId });

    res.status(201).json(createdAircraft);
  } catch (error) {
    console.error("Error creating aircraft:", error);
    res.status(500).json({ error: "Failed to create aircraft" });
  }
}

// TODO: implement updating an existing aircraft.
export async function updateAircraft(req, res) {
  try {
    const db = getDB();
    const aircraftId = req.params.id;

    const result = await db.collection("aircraft").updateOne(
      { _id: new ObjectId(aircraftId) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Aircraft not found" });
    }

    const updatedAircraft = await db.collection("aircraft").findOne({ _id: new ObjectId(aircraftId) });
    res.json(updatedAircraft);
  } catch (error) {
    console.error("Error updating aircraft:", error);
    res.status(500).json({ error: "Failed to update aircraft" });
  }
}

// TODO: implement deletion of an aircraft.
export async function deleteAircraft(req, res) {
  try {
    const db = getDB();
    const aircraftId = req.params.id;

    const result = await db.collection("aircraft").deleteOne({ _id: new ObjectId(aircraftId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Aircraft not found" });
    }

    res.json({ message: "Aircraft deleted successfully" });
  } catch (error) {
    console.error("Error deleting aircraft:", error);
    res.status(500).json({ error: "Failed to delete aircraft" });
  }
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
