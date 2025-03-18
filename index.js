/* This file is the "entry point" for the backend for this Express.js application.
*/

// Load environment variables from .env file
import { config } from "dotenv"; // Ensure environment variables are loaded
config(); // Load environment variables

// Import dependencies
import express from "express"; 
import morgan from "morgan"; 
import cors from "cors"; 
import { client } from "./server/db/index.js";  // Import the database client
import apiRouter from "./server/api/index.js"; // Router setup

// Middleware setup
const server = express(); // Initialize Express app
server.use(express.json()); // handle JSON requests
server.use(morgan("dev")); // Logging middleware to track requests in the console
server.use( // CORS middleware to allow cross-origin requests
  cors({
    origin: ["http://localhost:5173"],
    methods: "GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);
// Custom middleware for logging the body of incoming requests to the console
server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");
  next();
});

// Setup API routes
server.use("/api", apiRouter); // Mount the API router

// Connect to the database
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit if unable to connect
  }
};

// Server listening setup
const { PORT = 3000 } = process.env;
const startServer = () => {
  server.listen(PORT, () => {
    console.log(`The server is up on port ${PORT}`);
  });
};

// Initialize the application
const init = async () => {
  await connectToDatabase();
  startServer();
};

// Invoke the init function
init();