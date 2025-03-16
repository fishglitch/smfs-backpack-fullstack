/*
Purpose: This file primarily serves as a module containing 
methods that handle database operations such as creating, 
reading, updating, and deleting users, posts, and tags.

Functionality:
- establishes a connection to PostgreSQL database via pg module.
- defines various functions to interact with the users, posts, and tags tables.
- functions and methods for managing tags.
- exports client & functions for use in other app parts incl. seed.js file.

index.js: encapsulates all database operations, acts as a reusable module for core database interaction functions, for data logic maintenance and management.
seed.js: initialization and setup aspect; prepares db by creating schema + seeding it with initial data for functional and integration tests
*/

require('dotenv').config();
const { Client } = require('pg') // imports the pg module
const bcrypt = require('bcrypt')
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET|| 'shhh';


const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/schrodingers-backpack',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

/**
 * USER Methods
 */

const createUser = async () => {
  try {

  }catch(error) {
    console.error();
    throw error;
  }
}

const updateUser = async () => {
  try {

  }catch(error) {
    console.error();
    throw error;
  }
}

const getAllUsers = async () => {
  try {

  }catch(error) {
    console.error();
    throw error;
  }
}

const getUserById = async () => {
  try {

  }catch(error) {
    console.error();
    throw error;
  }
}

const getUserByUsername = async () => {
  try {

  }catch(error) {
    console.error();
    throw error;
  }
}

const createMemory = async () => {
  try {

  }catch(error) {
    console.error();
    throw error;
  }
}

const updateMemory = async () => {
  try {

  }catch(error) {
    console.error();
    throw error;
  }
}

const getAllMemories = async () => {
  try {

  }catch(error) {
    console.error();
    throw error;
  }
}

const getMemoryById = async () => {
  try {

  }catch(error) {
    console.error();
    throw error;
  }
}

const getMemoriesByUser = async () => {
  try {

  }catch(error) {
    console.error();
    throw error;
  }
}

module.exports = {  
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  getMemoryById,
  createMemory,
  updateMemory,
  getAllMemories,
  getMemoriesByUser,
  
}