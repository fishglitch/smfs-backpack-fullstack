/*
define apiRouter in server/api/index.js and then import in root index.js. 
This setup creates a clean separation of concerns
handle the CRUD logic inside the individual route files
*/

// api/index.js
import express from 'express';

import pkg from 'jsonwebtoken'; // Import the entire jsonwebtoken module
const { verify } = pkg; // Destructure to use the verify function

import { getUserById } from '../db/index.js';

const apiRouter = express.Router();
const { JWT_SECRET } = process.env;

// Routes for api requests with paths for each file
// Import the individual route modules
import usersRouter from './users.js';
import memoriesRouter from './memories.js';
import favoritesRouter from './favorites.js';
import tagsRouter from './tags.js';

// Middleware for token verification via authenticate and set req.user based on JWT
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    // If there's no auth header, proceed to the next middleware
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length); // Extract the token

    try {
      const { id } = verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      } else {
        next({
          name: 'AuthorizationHeaderError',
          message: 'Authorization token malformed',
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

// Log user if set
apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log('User is set:', req.user);
  }

  next(); // Move to the next middleware
});


// Set up the routes
apiRouter.use('/users', usersRouter);
apiRouter.use('/memories', memoriesRouter);
apiRouter.use('/favorites', favoritesRouter);
apiRouter.use('/tags', tagsRouter);

// Export the apiRouter for use in main server file
export default apiRouter;