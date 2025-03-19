import express from "express"; // import "dotenv/config";

import { config } from "dotenv"; // Ensure environment variables are loaded
config(); // Load environment variables

import jwt from "jsonwebtoken"; // Change to ES Module import

import requireUser from "./utils.js";

const memoriesRouter = express.Router();
memoriesRouter.use(express.json());

import {
  getAllMemories,
  getMemoryById,
  // getMemoriesByUser,
  createMemory,
  // updateMemory,
  deleteMemory,
} from "../db/index.js"; // Change to ES Module import

// GET ALL MEMORIES http://localhost:3000/api/memories/
memoriesRouter.get("/", async (req, res, next) => {
  try {
    const memories = await getAllMemories();

    res.send({
      memories,
    });
  } catch ({ ex }) {
    next({ ex });
  }
});

// GET MEMORIES BY ID http://localhost:3000/api/memories/:memoryId
memoriesRouter.get("/:memoryId", async (req, res, next) => {
  const { memoryId } = req.params; //access memoryId from req.params

  try {
    const memory = await getMemoryById(memoryId);

    res.send({
      memory,
    });
  } catch ({ ex }) {
    next({ ex });
  }
});

/* NOT FUNCTIONAL RIGHT NOW GET MEMORIES BY USER
memoriesRouter.get("/memories/users/:usersId/memories", async (req, res, next)=> {
  const {userId} = req.params; // access userId from request params

  try {
    const memories = await getMemoriesByUser(userId);

    if (memories.length === 0){
      return res.status(404).json({message: 'No memories found for this user'})
    }
    res.send({memories});
  } catch({ex}){
    next({ex});
  }
});
*/

// POST MEMORY (CREATE MEMORY) http://localhost:3000/api/memories
memoriesRouter.post("/", requireUser, async (req, res, next) => {
  const {
    title,
    imageUrl,
    description,
    dimension,
    visibility,
    author_nickname,
    // tags,
  } = req.body;

  // Initialize memoryData object
  const memoryData = {};

  try {
    // Ensure req.user is defined and contains valid user ID
    if (!req.user || !req.user.id) {
      return next({
        name: "UnauthorizedError",
        message: "You must be logged in to create a memory",
      });
    }

    // Populate memoryData object with relevant information
    memoryData.authorId = req.user.id; // Assuming req.user has been populated by requireUser
    memoryData.title = title;
    memoryData.imageUrl = imageUrl;
    memoryData.description = description;
    memoryData.dimension = dimension;
    memoryData.visibility = visibility;
    memoryData.author_nickname = author_nickname || req.user.username; // Optional
    // memoryData.tags = tags;

    // Create the memory
    const memory = await createMemory(memoryData);

    if (memory) {
      res.send(memory); // Send the created memory
    } else {
      next({
        name: "Memory Creation Error",
        message: "Error in creating your memory. Please try resubmitting",
      });
    }
  } catch (error) {
    // Adjusted to catch a general error
    console.error("Error creating memory:", error);
    next({
      name: "InternalServerError",
      message: "An unexpected error occurred while creating memory",
    });
  }
});

export default memoriesRouter; // Export
