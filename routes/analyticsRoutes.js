const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/analyticsController");
const authenticate = require("../middleware/authMiddleware");

router.get("/dashboard", authenticate, getDashboard);

module.exports = router;
