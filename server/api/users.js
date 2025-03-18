import express from "express";
import jwt from "jsonwebtoken"; // Change to ES Module import

const usersRouter = express.Router();
usersRouter.use(express.json());

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../db/index.js"; // Change to ES Module import

// Define your routes here, for example:

// GET http://localhost:3000/api/users/
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

// GET http://localhost:3000/api/users/:userId
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



export default usersRouter; // Export the usersRouter
