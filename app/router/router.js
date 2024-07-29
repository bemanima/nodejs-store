const { HomeRoutes } = require("./api");
const { UserAuthRoutes } = require("./user/auth.router");

const router = require("express").Router();

router.use("/user", UserAuthRoutes);
router.use("/", HomeRoutes);

module.exports = {
  AllRoutes: router,
};
