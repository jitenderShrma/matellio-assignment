const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/errorHandler');
const dotenv = require('dotenv');
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { Op } = require('sequelize');
dotenv.config();
const {dbConnection, sequelize} = require('./config/db'); 
const keys = require("./config/keys");
const routes = require("./routes");

const server = express();
server.use(bodyParser.json());

dbConnection(); // connect to database

const limiter = rateLimit({ 
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true,
	legacyHeaders: false,
})
let whitelist = ["*", "http://localhost:3001"]
let corsOptions = {
  origin: function (origin, callback) {
    if (origin && whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// Security middlewares
server.use(limiter); 
server.use(cors(corsOptions));
server.use(helmet());

server.locals.sequelize = sequelize;
server.locals.Op = Op;

sequelize.sync()
  .then(() => {
    console.log('Database synchronized.');
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });

server.use('/', routes); // routes entry point
server.use(errorHandler.errorHandlerMiddleware); // error middleware


server.listen(keys.port, () => {
  console.log(`Server is running on port ${keys.port}...`);
});