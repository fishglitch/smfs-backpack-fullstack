/*
utility module in an Express.js application
provides a middleware function for user authentication
*/
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

async function requireUser(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verify;
    next();
  }
  catch(ex){
    next(ex);
}}
export default requireUser; // Use named exports
