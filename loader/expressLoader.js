const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const passportInit = require("../passport/index");
const routes = require("../routes");
const morgan = require("morgan");

dotenv.config();

module.exports = (app) => {
  passportInit();

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use("/uploads/img", express.static("uploads/img"));
  app.use("/uploads/sound", express.static("uploads/sound"));

  app.use(passport.initialize());

  app.use(morgan("tiny"));
  app.use("/", routes());
};
