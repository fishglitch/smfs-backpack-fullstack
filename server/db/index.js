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
const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://localhost:5432/juicebox-dev"
);
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { createUser } = require("../../../ghCoursework/unit4/4career/db");
const JWT = process.env.JWT || "shhh";
