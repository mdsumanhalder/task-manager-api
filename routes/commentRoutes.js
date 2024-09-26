const express = require("express");
const router = express.Router();
const { addComment, getComments } = require("../controllers/commentController");
const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, addComment);
router.get("/:taskId", authenticate, getComments);

module.exports = router;
