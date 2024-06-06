const Users = require("../../api/v1/users/model");
const Organizers = require("../../api/v1/organizers/model");
const { BadRequestError } = require("../../errors");
const { StatusCodes } = require("http-status-codes");

const createOrganizer = async (req) => {
  const { organizer, role, email, password, name, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw new BadRequestError("Password dan confirmPassword tidak cocok");
  }
  const result = await Organizers.create({ organizer });

  const users = await Users.create({
    email,
    name,
    password,
    organizer: result._id,
    role,
  });
  delete users._doc.password;

  return users;
};

const createUsers = async (req, res) => {
  const { name, password, role, confirmPassword, email } = req.body;

  if (password !== confirmPassword) {
    throw new BadRequestError("Password dan Konfirmasi password tidak cocok");
  }
  const result = await Users.create({
    name,
    email,
    organizer: req.user.organizer,
    password,
    role,
  });
  return result;
};

const getAllUsers = async (req) => {
  const { keyword } = req.query;
  let condition = {Users : req.user.Users};
  if (keyword) {
    condition = { ...condition, name: { $regex: keyword, $options: "i" } };
  }
  const result = await Users.find(condition);

  return result;
};

module.exports = { createOrganizer,createUsers,getAllUsers };
