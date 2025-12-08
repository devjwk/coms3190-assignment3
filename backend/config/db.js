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
let client;

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI environment variable is not defined.");
    }

    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    // Connect to MongoDB
    await client.connect();

    // Select the "skyvalor" database
    db = client.db('skyvalor');

    console.log("✅ Successfully connected to MongoDB");

    // Add graceful shutdown
    process.on('SIGINT', async () => {
      await client.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return db;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1); // Terminate the application on DB connection failure
  }
}

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }

  return db;
}
