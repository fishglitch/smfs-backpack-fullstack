// this is where you will seed starter data
// use arrow functions (see 4.36 for the structure)


const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://ealejo:fish70@localhost:5432/acme_auth_store_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';


