import { getDB } from "../config/db.js";

export async function getAllAirport(req, res) {
  const db = getDB();
  const airports = await db.collection("airports").find().toArray();
  res.json(airports);
}
