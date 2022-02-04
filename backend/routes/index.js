const { Router } = require("express");
const auth = require("./api/auth");
const presets = require("./api/presets");

const app = Router();

module.exports = () => {
  auth(app);
  presets(app);

  return app;
};
