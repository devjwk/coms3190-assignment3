import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, getDB } from "./config/db.js";

import routeRoutes from "./routes/routeRoutes.js";
import aircraftRoutes from "./routes/aircraftRoutes.js";
import airportRoutes from "./routes/airportRoutes.js";

dotenv.config();

const app = express();

// ======================================================
//                 MIDDLEWARE SETUP
// ======================================================

// Configure CORS based on your frontend environment.
app.use(cors({ origin: "http://localhost:5173" }));

// Enable JSON parsing for incoming requests.
app.use(express.json());

// ======================================================
//                 ROUTE MOUNTING
// ======================================================

// Mount route-related endpoints.
app.use("/api/routes", routeRoutes);

// Mount aircraft-related endpoints.
app.use("/api/aircraft", aircraftRoutes);

// Mount airport-related endpoints.
app.use("/api/airports", airportRoutes);

// ======================================================
//        KEEP: SEARCH ROUTE BY FLIGHT ID
// ======================================================
app.get("/api/routes/search/:flightId", async (req, res) => {
  try {
    const db = getDB();
    const id = req.params.flightId.trim().toUpperCase();

    const route = await db.collection("routes").findOne({ id });

    if (!route) return res.status(404).json({ error: "Route not found" });

    return res.json(route); // contains _id, id, from, to, passengers, aircraft...
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================================================
//        KEEP: SEARCH AIRCRAFT BY SERIAL NUMBER
// ======================================================
app.get("/api/aircraft/search/:serial", async (req, res) => {
  try {
    const db = getDB();
    const serial = req.params.serial.trim();

    // look for exact serial number match
    const aircraft = await db
      .collection("aircraft")
      .findOne({ serialNumber: serial });

    if (!aircraft) {
      return res.status(404).json({ error: "Aircraft not found" });
    }

    return res.json(aircraft);
  } catch (err) {
    console.error("Aircraft search failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ======================================================
//        KEEP: GET AIRCRAFT FOR SALE
// ======================================================
app.get("/api/aircraftsInMarket", async (req, res) => {
  try {
    const db = getDB();

    const saleAircrafts = await db
      .collection("aircraftsInMarket")
      .find({})
      .toArray();

    if (!saleAircrafts)
      return res.status(404).json({ error: "aircraft not for sale" });

    return res.json(saleAircrafts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================================================
//                   START SERVER
// ======================================================
const PORT = process.env.PORT || 8081; // <==== DO NOT CHANGE THE PORT FROM 8081

// TODO: connect to MongoDB before starting server.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
