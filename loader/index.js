const expressLoader = require("./expressLoader");
const dbLoader = require("./dbLoader");
const errorHandler = require("./errorHandler");

const dotenv = require("dotenv");
dotenv.config();

module.exports = (app) => {
  expressLoader(app);
  dbLoader(process.env.MONGODB);
  errorHandler(app);
};
