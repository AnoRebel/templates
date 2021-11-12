// const { hash, compare } = require("bcrypt");
const { hash, verify } = require("argon2");

exports.ROLES = {
  Admin: "admin",
  Manager: "manager",
  Basic: "basic",
  All: ["admin", "manager", "basic"],
};

// const _saltRounds = 10;

exports.hashPassword = async password => {
  // return await hash(password, _saltRounds);
  return await hash(password);
};

exports.validatePassword = async (hashedPassword, plainPassword) => {
  // return await compare(plainPassword, hashedPassword);
  return await verify(hashedPassword, plainPassword);
};

const User = require("../models").User;

const authorize = (roles = []) => {
  // roles param can be a single role string (e.g. Role.Bacic or 'bacic')
  // or an array of roles (e.g. [Role.Admin, Role.Basic] or ['admin', 'basic'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  // attach full user record to request object
  return async (req, res, next) => {
    // get user with id from token 'sub' (subject) property
    const user = await User.findByPk(req.signedCookies.current_user);
    // const user = await User.findByPk(req.user.sub);

    // check user still exists
    if (!user || (roles.length && !roles.includes(user.role))) {
      // user no longer exists or role not authorized
      // return res.status(401).json({ message: 'Unauthorized' });
      return res.status(401).render("error", { errorCode: "401", message: "Unauthorized" });
    }

    // authorization successful
    req.user = user.toJSON();
    next();
  };
};

module.exports = authorize;
