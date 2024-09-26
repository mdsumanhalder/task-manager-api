const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");
const authenticate = require("../middleware/authMiddleware");

router.get("/", authenticate, getNotifications);
router.patch("/:id", authenticate, markAsRead);

module.exports = router;
