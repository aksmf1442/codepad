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

module.exports = { addUser, getUserByEmail };
