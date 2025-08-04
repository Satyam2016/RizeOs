const express = require("express");
const router = express.Router();
const editUserProfile  = require("../controllers/userController");
const  verifyToken  = require("../middleware/auth");

router.put("/profile", verifyToken, editUserProfile.editUserProfile);

module.exports = router;
