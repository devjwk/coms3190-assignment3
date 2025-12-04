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

/** TODO: mount a GET route that returns one aircraft by its MongoDB _id. */

/** TODO: mount a POST route that creates a new aircraft record. */

/** TODO: mount a PUT route that updates an existing aircraft by _id. */

/** TODO: mount a DELETE route that removes an aircraft by _id. */

/** TODO: mount a GET route for fetching assigned routes by aircraft model. */
router.get("/assigned-routes/:model", getAssignedRoutesByAircraft);

export default router;
