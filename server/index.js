// # Express server setup and endpoints

/*
This file is the "entry point" for the backend for this Express.js application.

1. initializes the application.
2. Sets up middleware for handling JSON requests and logging.
3. Configures routing for the API.
4. Establishes a database connection.
5. Starts the server to listen for requests.

*/

/* loads enviro var from .env into process.env
to manage config for application port/ db connection strings
*/
require('dotenv').config();

/*
Initialize Express app, setup server to listen on specified port
*/
const { PORT = 3000 } = process.env;
const express = require('express');
const server = express();

/*
middleware processes incoming requests with JSON payloads
to handle JSON data in request bodies
*/
const bodyParser = require('body-parser');
server.use(bodyParser.json());

/*
'morgan' as logging middleware, helps track request deets in console
'dev' format used for dev purposes to provide concise output colored by response status
*/
const morgan = require('morgan');
server.use(morgan('dev'));

/*
custom middleware logging body of incoming requests to console
provides insight of data sent to server per request
*/
server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

/* Router setup */
const apiRouter = require('./api.js');
server.use('/api', apiRouter);

/* db client connection */
const { client } = require('./db');
client.connect();

/* server listening */
server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});