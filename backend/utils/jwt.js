const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const secret = process.env.JWT_SECRET;

const setUserToken = (res, user) => {
  const token = jwt.sign(user.toJSON(), secret);
  res.cookie("token", token);
};

module.exports = { secret, setUserToken };
