import express from "express";
import jwt from "jsonwebtoken"; // Change to ES Module import
import requireUser from "./utils.js";

const memoriesRouter = express.Router();
memoriesRouter.use(express.json());

import {
  getAllMemories,
  getMemoryById,
  getMemoriesByUser,
  createMemory,
  updateMemory,
  deleteMemory,
} from "../db/index.js"; // Change to ES Module import



// Define your routes here, for example:

export default memoriesRouter; // Export
