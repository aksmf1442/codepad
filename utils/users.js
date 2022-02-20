const { nanoid } = require("nanoid");
const { User } = require("../models");

const addUser = async (email, name) => {
  const user = await User.create({
    shortId: nanoid(),
    email,
    name,
  });
  return user;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const getUserByUserId = async (userId) => {
  const user = await User.findOne({ shortId: userId });
  return user;
};

module.exports = { addUser, getUserByEmail, getUserByUserId };
