import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

// TODO: implement fetching all routes from the database.
export async function getAllRoutes(req, res) {
  // Should query the "routes" collection and return the list.
}

// TODO: implement fetching a single route by its ObjectId.
export async function getRouteById(req, res) {
  // Should find the route using req.params.id and return 404 if not found.
}

// TODO: implement new route creation.
export async function createRoute(req, res) {
  // Should construct a route object from req.body and insert into DB.
}

// TODO: implement updating an existing route.
export async function updateRoute(req, res) {
  // Should update fields on a route document based on req.params.id.
  // Return the updated route or an error if something fails.
}

// TODO: implement deletion of a route.
export async function deleteRoute(req, res) {
  // Should delete a route by its ObjectId and respond accordingly.
}
