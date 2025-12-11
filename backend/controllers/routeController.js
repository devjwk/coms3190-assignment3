import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

// TODO: implement fetching all routes from the database.
export async function getAllRoutes(req, res) {
  try {
    const db = getDB();
    const routes = await db.collection("routes").find().toArray();
    res.json(routes);
  } catch (error) {
    console.error("Error fetching all routes:", error);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
}

// TODO: implement fetching a single route by its ObjectId.
export async function getRouteById(req, res) {
  try {
    const db = getDB();
    const routeId = req.params.id;

    // Check if routeId is a valid ObjectId string (24-character hex string)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(routeId);

    if (!isValidObjectId) {
      return res.status(400).json({ error: "Invalid route ID format" });
    }

    const route = await db.collection("routes").findOne({ _id: new ObjectId(routeId) });

    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    res.json(route);
  } catch (error) {
    console.error("Error fetching route by ID:", error);
    res.status(500).json({ error: "Failed to fetch route" });
  }
}

// TODO: implement new route creation.
export async function createRoute(req, res) {
  try {
    const db = getDB();
    const newRoute = req.body;

    // Validate required fields
    if (!newRoute.id || !newRoute.from || !newRoute.to) {
      return res.status(400).json({ error: "Missing required fields: id, from, to" });
    }

    const result = await db.collection("routes").insertOne(newRoute);
    const createdRoute = await db.collection("routes").findOne({ _id: result.insertedId });

    res.status(201).json(createdRoute);
  } catch (error) {
    console.error("Error creating route:", error);
    res.status(500).json({ error: "Failed to create route" });
  }
}

// TODO: implement updating an existing route.
export async function updateRoute(req, res) {
  try {
    const db = getDB();
    const routeId = req.params.id;

    // Check if routeId is a valid ObjectId string (24-character hex string)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(routeId);

    if (!isValidObjectId) {
      return res.status(400).json({ error: "Invalid route ID format" });
    }

    // Create a copy of the request body and remove the _id field to prevent updating the immutable field
    const updateData = { ...req.body };
    delete updateData._id;

    const result = await db.collection("routes").updateOne(
      { _id: new ObjectId(routeId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Route not found" });
    }

    const updatedRoute = await db.collection("routes").findOne({ _id: new ObjectId(routeId) });
    res.json(updatedRoute);
  } catch (error) {
    console.error("Error updating route:", error);
    res.status(500).json({ error: "Failed to update route" });
  }
}

// TODO: implement deletion of a route.
export async function deleteRoute(req, res) {
  try {
    const db = getDB();
    const routeId = req.params.id;

    // Check if routeId is a valid ObjectId string (24-character hex string)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(routeId);

    if (!isValidObjectId) {
      return res.status(400).json({ error: "Invalid route ID format" });
    }

    const result = await db.collection("routes").deleteOne({ _id: new ObjectId(routeId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Route not found" });
    }

    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error("Error deleting route:", error);
    res.status(500).json({ error: "Failed to delete route" });
  }
}
