const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const secret = process.env.JWT_SECRET;

const setUserToken = (res, user) => {
  const option = {
    httpOnly: false,
    sameSite: "None",
    secure: true,
  };
  const token = jwt.sign(user, secret);
  res.cookie("token", token, option);
};

const validateToken = (token, callback) => {
  return jwt.verify(token, process.env.JWT_SECRET, callback);
};

module.exports = { secret, setUserToken, validateToken };
