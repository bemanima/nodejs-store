const homeController = require("../../http/controllers/api/home.controller");
const {
  verifyAccessToken,
} = require("../../http/middlewares/verifyAccessToken");
const router = require("express").Router();

/**
 * @swagger
 * tags:
 *  name: IndexPage
 *  description: IndexPage routes
 * /:
 *  get:
 *      summary: Base of routes
 *      description: Get all data for index page
 *      tags: [IndexPage]
 *      parameters:
 *      -     in: header
 *            name: access-token
 *            example: Bearer [YourToken]
 *      responses:
 *            200:
 *                description: success
 *            404:
 *                description: Not found
 */

router.get("/", verifyAccessToken, homeController.indexPage);

module.exports = {
  HomeRoutes: router,
};
