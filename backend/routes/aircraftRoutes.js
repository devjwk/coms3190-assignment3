import express from "express";
import {
  getAllAircraft,
  getAircraftById,
  createAircraft,
  updateAircraft,
  deleteAircraft,
  getAssignedRoutesByAircraft,
} from "../controllers/aircraftController.js";

const router = express.Router();

/**
 * Example format:
 *
 * router.get("/example", (req, res) => {
 *   res.json({ message: "Example route" });
 * });
 *
 * Follow this style for all routes below.
 */

/** TODO: mount a GET route that returns all aircraft. */
router.get("/", getAllAircraft);

/** TODO: mount a GET route that returns one aircraft by its MongoDB _id. */
router.get("/:id", getAircraftById);

/** TODO: mount a POST route that creates a new aircraft record. */
router.post("/", createAircraft);

/** TODO: mount a PUT route that updates an existing aircraft by _id. */
router.put("/:id", updateAircraft);

/** TODO: mount a DELETE route that removes an aircraft by _id. */
router.delete("/:id", deleteAircraft);

/** TODO: mount a GET route for fetching assigned routes by aircraft model. */
router.get("/assigned-routes/:model", getAssignedRoutesByAircraft);

export default router;
