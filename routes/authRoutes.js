const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();

/**
 * @swagger
 * /api/register:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A list of tasks
 *       500:
 *         description: Internal server error
 */
router.post("/register", register);

/**
 * @swagger
 * /api/login:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A list of tasks
 *       500:
 *         description: Internal server error
 */

router.post("/login", login);

module.exports = router;
