// routes/posts.js
const express = require("express");
const  verifyToken  = require("../middleware/auth");
const postController = require("../controllers/postController");
const router = express.Router();

router.post("/", verifyToken, postController.createFeedPost);
router.get("/", postController.getFeedPosts);

module.exports = router;
