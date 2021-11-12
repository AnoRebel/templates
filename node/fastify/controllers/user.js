const User = require("../models").User;
const jwt = require("jsonwebtoken");
const { hashPassword, validatePassword } = require("../helpers");

exports.register = async (req, res, next) => {
  try {
    const { userName, phone, password } = req.body;
    if (!userName) return next(new Error("Please enter a username"));
    if (!phone) return next(new Error("Please enter valid contact number"));
    if (!password) return next(new Error("Please enter a password"));
    const exists = await User.findOne({ where: { phone } });
    if (exists) return next(new Error("User already exists"));
    const hashedPassword = await hashPassword(password);
    const basicUser = User.build({
      userName,
      phone,
      password: hashedPassword,
      role: "basic",
    });
    const accessToken = jwt.sign({ sub: basicUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    basicUser.accessToken = accessToken;
    await basicUser.save();
    // res.status(201).json({
    //   data: basicUser.toJSON(),
    //   message: "User Created"
    // });
    res.status(201).redirect("/login");
  } catch (error) {
    next(error);
  }
};

exports.admin = async (req, res, next) => {
  try {
    const { userName, firstName, lastName, phone, email, password, role } = req.body;
    if (!firstName || !lastName) return next(new Error("Please enter first and last name"));
    if (!phone) return next(new Error("Please enter valid contact number"));
    if (!password) return next(new Error("Please enter a password"));
    const exists = await User.findOne({ where: { email } });
    if (exists) return next(new Error("User already exists"));
    const hashedPassword = await hashPassword(password);
    const adminUser = User.build({
      userName,
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: role || "admin",
    });
    const accessToken = jwt.sign({ sub: adminUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    adminUser.accessToken = accessToken;
    await adminUser.save();
    // res.status(201).json({
    //   data: adminUser.toJSON(),
    //   message: "User Created"
    // });
    res.status(201).redirect("/admin");
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const cookieOptions = {
    signed: true,
    httpOnly: true,
    maxAge: 604800,
  };
  try {
    const { phone, password } = req.body;
    const user = await User.scope("withPassword").findOne({ where: { phone } });
    if (!user) return next(new Error("Phone number is not registered"));
    const validPassword = await validatePassword(user.password, password);
    if (!validPassword) return next(new Error("Password is not correct"));
    const accessToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    user.accessToken = accessToken;
    await user.save();
    // req.user = user;
    res
      .status(201)
      .cookie("access_token", "Bearer " + user.accessToken, cookieOptions)
      .cookie("current_user", user.id, cookieOptions)
      .redirect(301, "/");
    // res.status(200).json({
    //   data: { email: user.firstName, role: user.role, accessToken: user.accessToken },
    //   message: "Signed In Successfully"
    // });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res, next) => {
  try {
    res.clearCookie("token");
    res.clearCookie("current_user");
    // req.logout();
    res.status(301).redirect("/users/login");
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      data: users,
      message: "Success",
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return next(new Error("User Not Found"));
    // res.status(200).json({
    //   data: user.toJSON(),
    //   message: "Success"
    // });
    res.status(200).rener("profile", { data: user });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }
    const user = await User.findByPk(req.params.id);
    if (!user) return next(new Error("User Not Found"));
    const updatedUser = await user.update(req.body);
    res.status(201).json({
      data: updatedUser.toJSON(),
      message: "Success",
    });
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return next(new Error("User Not Found"));
    await user.destroy();
    res.status(204).json({
      data: null,
      message: "User Deleted",
    });
  } catch (error) {
    next(error);
  }
};
