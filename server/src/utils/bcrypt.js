const bcrypt = require("bcrypt");
// import bcrypt from "bcrypt";

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(+process.env.BCEYPT_SALT_ROUND);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}

function comparePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword,
};
