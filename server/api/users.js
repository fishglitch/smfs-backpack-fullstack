import express from "express"; // import "dotenv/config";

/* import { config } from "dotenv"; // Ensure environment variables are loaded
config(); // Load environment variables
*/
// import "dotenv/config";

import { config } from 'dotenv';
config({ path: '../.env' });

import jwt from "jsonwebtoken"; // Change to ES Module import
import bcrypt from 'bcrypt';

const usersRouter = express.Router();
usersRouter.use(express.json());

import {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  // updateUser,
  deleteUser,
} from "../db/index.js"; // Change to ES Module import

// GET ALL USERS http://localhost:3000/api/users/
usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();

    res.send({
      users,
    });
  } catch ({ ex }) {
    next({ ex });
  }
});

// GET USER BY ID http://localhost:3000/api/users/:userId
usersRouter.get("/:userId", async (req, res, next) => {
  const { userId } = req.params; //access userId from req.params

  try {
    const user = await getUserById(userId);

    res.send({
      user,
    });
  } catch ({ ex }) {
    next({ ex });
  }
});

// POST http://localhost:3000/api/users/login tested using {"username": "albert","password": "bertie99"}
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({
          name: "MissingCredentialsError",
          message: "Please supply both a username and password",
      });
  }

  try {
      const user = await getUserByUsername(username);

      if (user && (await bcrypt.compare(password, user.password))) {
          // Check if JWT_SECRET is defined
          // if (!process.env.JWT_SECRET) {
          //     return res.status(500).json({ message: 'Server configuration error: Missing JWT_SECRET.' });
          // }
          
          const token = jwt.sign(
              { id: user.id, username },
              process.env.JWT_SECRET || "secret",
              { expiresIn: '1w' }
          );

          res.send({
              message: "You're logged in!",
              token,
          });
      } else {
          return res.status(401).json({
              name: "IncorrectCredentialsError",
              message: "Username or password is incorrect",
          });
      }
  } catch (error) {
      console.log(error);
      next(error);
  }
});

/*
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    return res.status(400).json({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && (await bcrypt.compare(password, user.password)) == true) {
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        message: "you're logged in!",
        token,
      });
    } else {
      return res.status(401).json({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
*/

// POST USER (CREATE USER) http://localhost:3000/api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password, name, dimension, email } = req.body;

  // Validate user input
  if (!username || !password || !name || !dimension || !email) {
    return res.status(400).json({
      // changed send to json to see if server can return JSON response, not HTML content type
      name: "MissingFieldsError",
      message:
        "Please provide all required fields: username, password, name, dimension, email",
    });
  }

  try {
    // check if user already exists
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return res.status(409).json({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    }

    // create new user
    const user = await createUser({
      username,
      password, // check if hased the pw in createUser
      name,
      dimension,
      email,
    });

    // generate token
    const token = jwt.sign(
      {
        id: user.id,
        username,
        dimension,
        email,
      },
      process.env.JWT_SECRET || "shhh",
      {
        expiresIn: "1w",
      }
    );

    res.status(201).json({
      message: "Thank you for signing up",
      token,
    });
  } catch (error) {
    console.error(error); // logging error for debugging
    res.status(500).json({
      // Ensure any error returns JSON
      name: error.name || "Internal Error",
      message: error.message || "An unexpected error occurred",
    }); // improve error handling
  }
});

export default usersRouter; // Export the usersRouter
