# SkyValor Backend

This folder contains the backend portion of the SkyValor Airline Operations Console.  
The backend exposes a REST API that the React frontend consumes to manage routes
and aircraft for SkyValor and its partner airlines.

---

## Project Description

The backend is built with:

- **Node.js + Express** for the HTTP server and routing
- **MongoDB** as the database (database name: `skyvalor`)
- **MongoDB Node Driver** for data access (via `getDB()` in `config/db.js`)
- **REST-style endpoints** under the `/api` namespace

High-level design:

- `server.js` bootstraps the Express app, connects to MongoDB, and mounts all
  route modules under `/api/*`.
- `config/db.js` manages a single shared MongoDB connection and exposes `getDB()`.
- Each domain (routes, aircraft, airports) has:
  - a **controller** file (business logic + DB queries)
  - a **routes** file (Express router that maps URLs to controller functions)

The frontend (React + Vite + Tailwind) is already wired to these endpoints and
automatically updates its UI based on the JSON responses and status codes.

---

## Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd NM_15/backend
   npm install

3.	Start MongoDB locally
	•	Run mongod on your machine, or start MongoDB via the MongoDB app.
	•	The backend expects a database named skyvalor.
	4.	Import seed data
Using MongoDB Compass, import the JSON files from frontend/src/data into
the skyvalor database:
	•	routes.json → collection routes
	•	aircraft.json → collection aircraft
	•	airports.json → collection airports
	•	aircraftsInMarket.json → collection aircraftsInMarket
	5.	Environment variables
.env (already provided) contains the Mongo connection string and DB name, e.g.:


MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=skyvalor

6.	Run the backend server
npm start

The backend listens on http://localhost:8081.

Folder Structure

Backend root:

backend/
  config/
    db.js                  # MongoDB connection + getDB()
  controllers/
    aircraftController.js  # Aircraft CRUD + assigned routes
    airportController.js   # Airports + aircraftsInMarket helper endpoints
    routeController.js     # Route CRUD + search helpers
  routes/
    aircraftRoutes.js      # /api/aircraft endpoints
    airportRoutes.js       # /api/airports and /api/aircraftsInMarket
    routeRoutes.js         # /api/routes endpoints
  .env
  server.js                # Express app, mounts all routers
  package.json

	•	Controllers contain all logic for querying MongoDB and building responses.
	•	Routes only describe HTTP paths and which controller function handles them.
	•	DB configuration is centralized in config/db.js so all controllers share
the same database connection.

⸻

API Documentation

All endpoints return JSON and follow consistent status codes:
	•	200 OK – successful read or update
	•	201 Created – successful creation of a new document
	•	400 Bad Request – invalid ID format or missing/invalid fields
	•	404 Not Found – document or search result not found
	•	500 Internal Server Error – unexpected server or database error

⸻

Routes API

Base path: /api/routes
Collection: routes

Each route document includes fields like:
	•	flightId (string, e.g. "SV243")
	•	origin / destination (airport codes)
	•	distance (number, miles)
	•	operator (SkyValor or partner airline)
	•	assignedAircraft (serial number or reference)
	•	status, passengers, etc. (see seed JSON)

GET /api/routes

Description

Returns all flight routes from the routes collection, including SkyValor
and partner airline routes. The frontend groups them visually by operator.

Sample response

[
  {
    "_id": "6523abcd1234ef5678900001",
    "flightId": "SV243",
    "origin": "SFO",
    "destination": "JFK",
    "distance": 2586,
    "operator": "SkyValor",
    "status": "Active",
    "assignedAircraft": "SV-A350-001"
  },
  ...
]

GET /api/routes/:id

Description

Returns a single route by its MongoDB ObjectId.

Params
	•	id – path param, MongoDB ObjectId string

Success
	•	200 OK with the route document
	•	404 Not Found if no route exists with that id

Error
	•	400 Bad Request if id is not a valid ObjectId
	•	500 Internal Server Error on unexpected DB errors

⸻

POST /api/routes

Description

Creates a new route in the routes collection.

Request body (example)

{
  "flightId": "SV900",
  "origin": "LAX",
  "destination": "ORD",
  "distance": 1744,
  "operator": "SkyValor",
  "status": "Active",
  "assignedAircraft": "SV-B787-010",
  "passengers": 180
}

Validation
	•	flightId, origin, destination, and distance are required.
	•	Additional validation may enforce that distance is positive and that string
fields are non-empty.

Response
	•	201 Created with the inserted route document
	•	400 Bad Request if required fields are missing/invalid
	•	500 Internal Server Error on DB failure

⸻

PUT /api/routes/:id

Description

Updates an existing route by its ObjectId. Only the fields present in the body
are updated.

Request body (example)

{
  "status": "Cancelled",
  "assignedAircraft": null
}

Response
	•	200 OK with the updated route document
	•	404 Not Found if the route does not exist
	•	400 Bad Request if id is invalid
	•	500 Internal Server Error on DB failure

⸻

DELETE /api/routes/:id

Description

Deletes a route by its ObjectId.

Response

{
  "message": "Route deleted successfully"
}

	•	200 OK if a route was deleted
	•	404 Not Found if no route matched the id
	•	400 Bad Request if id is invalid


Aircraft API

Base path: /api/aircraft
Collection: aircraft

Each aircraft document includes:
	•	serialNumber (string, e.g. "SV-A350-001") – uniquely identifies aircraft
	•	brand (e.g. Airbus, Boeing)
	•	model (e.g. "A350", "B777-300ER")
	•	airline (SkyValor or partner airline name)
	•	seatingCapacity (number)
	•	status (e.g. Active, Scheduled, Maintenance, Retired)
	•	assignedRoutes (array of { "item": "<route label>" })

⸻

GET /api/aircraft

Description

Returns all aircraft in the fleet. The controller normalizes data so that
each object always contains:
	•	id – string version of _id
	•	assignedRoutes – always an array (empty if none)

Sample response

[
  {
    "_id": "6523abcd1234ef5678900100",
    "id": "6523abcd1234ef5678900100",
    "serialNumber": "SV-A350-001",
    "brand": "Airbus",
    "model": "A350",
    "airline": "SkyValor",
    "seatingCapacity": 300,
    "status": "Active",
    "assignedRoutes": [
      { "item": "SV243 SFO → JFK" }
    ]
  },
  ...
]

GET /api/aircraft/:id

Description

Returns a single aircraft. The backend is flexible about the identifier:
	•	If :id is a valid MongoDB ObjectId → search by _id.
	•	Otherwise → search by serialNumber.

Params
	•	id – ObjectId string or aircraft serial number

Response
	•	200 OK with normalized aircraft document (id, assignedRoutes etc.)
	•	404 Not Found if no aircraft matches
	•	500 Internal Server Error on failure

⸻

POST /api/aircraft

Description

Creates a new aircraft document.

Request body (minimal example)

{
  "serialNumber": "SV-DEMO-001",
  "brand": "Airbus",
  "model": "A350",
  "airline": "SkyValor",
  "seatingCapacity": 300,
  "status": "Active",
  "assignedRoutes": [
    { "item": "SV900 LAX → ORD" }
  ]
}

Validation
	•	serialNumber and model are required.
	•	If assignedRoutes is present, it must be:

Array<{ item: string }>

Non-array values or objects without a non-empty item string result in 400.

Response
	•	201 Created with the created aircraft document
	•	400 Bad Request on missing required fields or invalid assignedRoutes
	•	500 Internal Server Error on DB failure

⸻

PUT /api/aircraft/:id

Description

Updates an existing aircraft by its MongoDB ObjectId.

Params
	•	id – MongoDB ObjectId string

Body
	•	Any subset of aircraft fields to update (e.g. status, seatingCapacity,
assignedRoutes, etc.)

Validation
	•	id must be a valid ObjectId (otherwise 400).
	•	If assignedRoutes is included, it must again be an array of { item: string }.

Response
	•	200 OK with updated aircraft document
	•	404 Not Found if no aircraft matches
	•	400 Bad Request on invalid id or invalid assignedRoutes
	•	500 Internal Server Error on DB failure

⸻

DELETE /api/aircraft/:id

Description

Deletes an aircraft by its ObjectId.

Response

{
  "message": "Aircraft deleted successfully"
}

	•	200 OK on successful deletion
	•	404 Not Found if no aircraft matched
	•	400 Bad Request on invalid id

⸻

GET /api/aircraft/assigned-routes/:model

Description

Returns all routes assigned to aircraft of a given model (e.g. "A350").

Params
	•	model – string model name

Response

{
  "model": "A350",
  "aircraftCount": 3,
  "routes": [
    { "item": "SV243 SFO → JFK" },
    { "item": "SV900 LAX → ORD" },
    ...
  ]
}

	•	404 Not Found if no aircraft of that model have assigned routes.

This endpoint is used by the frontend for advanced search/assignment views.

⸻

Error Handling

The backend always responds with JSON objects for error cases. Common patterns:
	•	Invalid ObjectId, malformed data, or failed validation:

{
  "error": "Invalid aircraft id"
}

-> 400 Bad Request

•	Missing record:
{
  "error": "Aircraft not found"
}

•	Unexpected exceptions (e.g. database unavailable):
{
  "error": "Failed to fetch aircraft"
}

--> 500 Internal Server Error

All controllers wrap database calls in try/catch blocks, log the error to the
server console, and return an appropriate HTTP status code with a short message.

⸻

Additional Notes
	•	Database name is skyvalor and must not be changed (grading requirement).
	•	Frontend fetches data from:
	•	/api/routes
	•	/api/routes/:id
	•	/api/aircraft
	•	/api/aircraft/:id
	•	/api/aircraft/assigned-routes/:model
	•	plus helper endpoints for airports and aircraftsInMarket.
	•	Responses are designed to “hydrate” the UI directly:
	•	Aircraft documents always include full metadata (model, capacity, status,
operator type).
	•	CRUD operations return the created/updated document so the frontend can
update state without an additional fetch.

This README describes the final backend implementation used by the SkyValor
Airline Operations Console.



