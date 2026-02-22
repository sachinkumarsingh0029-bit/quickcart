const winston = require("winston");
const { transports } = winston;
const MongoDB = require("winston-mongodb").MongoDB;

const customLogger = (role, action, req) => {
  const { method, url, query } = req;
  const routeName = req?.route ? req?.route?.path : "unknown route";
  console.log(role, action, {method, url, query});
};

module.exports = customLogger;
