const express = require("express");
const { userController } = require("../controllers");
const { isLoggedIn, authorize } = require("../middlewares");
const { ROLES } = require("../helpers");

const router = express.Router();

router.get("/users/register", (req, res) => {
  res.render("register");
});
router.post("/users/register", userController.register);
router.get("/users/register/admin", (req, res) => {
  res.render("admin");
});
router.post("/users/register/admin", userController.admin);

router.get("/users/login", (req, res) => {
  res.render("login");
});
router.post("/users/login", userController.login);

router.get("/users/logout", userController.logout);

router.get("/users/all", authorize([ROLES.Admin, ROLES.Manager]), userController.getAll);

router.get("/users/:id", authorize(ROLES.All), userController.getById);

router.put("/users/:id", isLoggedIn, authorize([ROLES.Admin, ROLES.Basic]), userController.update);

router.delete(
  "/users/:id",
  isLoggedIn,
  authorize([ROLES.Admin, ROLES.Manager]),
  userController.destroy
);

module.exports = router;
