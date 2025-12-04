/**
 * TODO: Re-implement MongoDB connection logic.
 * This file should:
 * 1. Load MONGO_URI from environment variables.
 * 2. Connect to MongoDB using MongoClient.
 * 3. Select the "skyvalor" database.
 * 4. Export connectDB() and getDB() for use across the app.
 *
 * Add retry logic, better error reporting, and graceful shutdown support
 * when you build this out again.
 */

import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let db;

export async function connectDB() {
  // TODO: implement the actual connection flow here.
  // Create the MongoClient, connect to it, and assign `db`
  // to the skyvalor database once connected.
}

export function getDB() {
  // TODO: return the initialized database instance.
  // Throw a clear error if connectDB hasn't been called yet.
}
