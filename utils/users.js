const { nanoid } = require("nanoid");
const { User } = require("../models");

const addUser = async ({ email, name, source }) => {
  const user = await User.create({
    shortId: nanoid(),
    email,
    name,
    source,
  });
  return user;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const getUserById = async (id) => {
  const user = await User.findOne({ shortId: id });
  return user;
};

module.exports = { addUser, getUserByEmail, getUserById };
