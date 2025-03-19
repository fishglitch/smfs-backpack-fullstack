/*
utility module in an Express.js application
provides a middleware function for user authentication
*/
import jwt from "jsonwebtoken"; // Import JWT library

import { config } from "dotenv"; // Load environment variables
// Ensure environment variables are loaded
config();

const requireUser = (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers["authorization"];

  // Log incoming auth header
  console.log("Authorization header:", authHeader);

  // Check if the authorization header is present
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  // Extract the token from the authorization header
  const token = authHeader.split(" ")[1];
  console.log("Extracted token:", token); // Log extracted token

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, user) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(403).json({ message: "Invalid token" });
    }

    // Attach the verified user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  });
};

export default requireUser; // Export the middleware function
