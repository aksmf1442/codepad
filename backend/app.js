const express = require("express");
const app = express();
const connectDB = require("./utils/db");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const whitelist = ["https://elice7-codepad.herokuapp.com"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed Origin!"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const start = () => {
  try {
    connectDB(process.env.MONGODB);
    app.listen(process.env.PORT || 3000, () => {
      console.log(`app listening on port ${process.env.PORT || 3000}!`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
