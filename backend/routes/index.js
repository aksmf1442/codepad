const { Router } = require("express");
const auth = require("./api/auth");
const presets = require("./api/presets");
const search = require("./api/search");

const app = Router();

module.exports = () => {
  auth(app);
  presets(app);
  search(app);
  return app;
};
