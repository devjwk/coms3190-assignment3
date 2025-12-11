import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

// GET /api/aircraft
export async function getAllAircraft(req, res) {
  try {
    const db = getDB();
    const aircraft = await db.collection("aircraft").find().toArray();
    const normalized = aircraft.map((a) => ({
      ...a,
      id: a._id?.toString(), 
      assignedRoutes: Array.isArray(a.assignedRoutes) ? a.assignedRoutes : [],
    }));
    return res.status(200).json(aircraft);
  } catch (error) {
    console.error("Error fetching all aircraft:", error);
    return res.status(500).json({ error: "Failed to fetch aircraft" });
  }
}

// GET /api/aircraft/:id
// GET /api/aircraft/:id
export async function getAircraftById(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    const query = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { serialNumber: id };

    const aircraft = await db.collection("aircraft").findOne(query);

    if (!aircraft) {
      return res.status(404).json({ error: "Aircraft not found" });
    }

    return res.status(200).json(aircraft);
  } catch (error) {
    console.error("Error fetching aircraft by ID:", error);
    return res.status(500).json({ error: "Failed to fetch aircraft" });
  }
}

// POST /api/aircraft
export async function createAircraft(req, res) {
  try {
    const db = getDB();
    const newAircraft = req.body;

    if (!newAircraft.serialNumber || !newAircraft.model) {
      return res.status(400).json({ error: "Missing required fields: serialNumber, model" });
    }

    if ("assignedRoutes" in newAircraft) {
    const ar = newAircraft.assignedRoutes;
    const ok =
      Array.isArray(ar) &&
      ar.every((x) => x && typeof x.item === "string" && x.item.length > 0);

    if (!ok) {
      return res.status(400).json({
        error: "assignedRoutes must be an array of { item: string }",
      });
    }
  }

    const result = await db.collection("aircraft").insertOne(newAircraft);
    const createdAircraft = await db.collection("aircraft").findOne({ _id: result.insertedId });

    return res.status(201).json(createdAircraft);
  } catch (error) {
    console.error("Error creating aircraft:", error);
    return res.status(500).json({ error: "Failed to create aircraft" });
  }
}

// PUT /api/aircraft/:id
export async function updateAircraft(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid aircraft id" });
    }
    // validation: assignedRoutes 
    if ("assignedRoutes" in req.body) {
      const ar = req.body.assignedRoutes;
      const ok =
        Array.isArray(ar) &&
        ar.every((x) => x && typeof x.item === "string" && x.item.length > 0);

      if (!ok) {
        return res.status(400).json({
          error: "assignedRoutes must be an array of { item: string }",
        });
      }
    }

    const result = await db.collection("aircraft").updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Aircraft not found" });
    }

    const updatedAircraft = await db.collection("aircraft").findOne({ _id: new ObjectId(id) });
    return res.status(200).json(updatedAircraft);
  } catch (error) {
    console.error("Error updating aircraft:", error);
    return res.status(500).json({ error: "Failed to update aircraft" });
  }
}

// DELETE /api/aircraft/:id
export async function deleteAircraft(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid aircraft id" });
    }

    const result = await db.collection("aircraft").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Aircraft not found" });
    }

    return res.status(200).json({ message: "Aircraft deleted successfully" });
  } catch (error) {
    console.error("Error deleting aircraft:", error);
    return res.status(500).json({ error: "Failed to delete aircraft" });
  }
}

// KEEP FULL IMPLEMENTATION 
export async function getAssignedRoutesByAircraft(req, res) {
  const db = getDB();
  const model = req.params.model;

  const aircraftList = await db
    .collection("aircraft")
    .find({ model })
    .project({ assignedRoutes: 1, serialNumber: 1 })
    .toArray();

  if (!aircraftList || aircraftList.length === 0) {
    return res.status(404).json({ message: "No routes found for this model" });
  }

  return res.status(200).json({
    model,
    aircraftCount: aircraftList.length,
    routes: aircraftList.flatMap((a) => a.assignedRoutes || []),
  });
}