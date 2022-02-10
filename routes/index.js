const { Router } = require("express");
const auth = require("./api/auth");
const presets = require("./api/presets");
const search = require("./api/search");
const likes = require("./api/likes");
const intro = require("./api/intro");

const app = Router();

module.exports = () => {
  auth(app);
  presets(app);
  search(app);
  likes(app);
  intro(app);
  return app;
};
