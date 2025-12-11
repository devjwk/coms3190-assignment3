import express from "express";
import {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../controllers/routeController.js";

const router = express.Router();

/** TODO: mount a GET route that returns all routes. */
router.get("/", getAllRoutes);

/** TODO: mount a GET route that returns one route by its MongoDB _id. */
router.get("/:id", getRouteById);

/** TODO: mount a POST route that creates a new route entry. */
router.post("/", createRoute);

/** TODO: mount a PUT route that updates an existing route by _id. */
router.put("/:id", updateRoute);

/** TODO: mount a DELETE route that removes a route by _id. */
router.delete("/:id", deleteRoute);

export default router;
