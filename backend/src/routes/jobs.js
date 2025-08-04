// routes/jobs.js
const express = require("express");
const verifyToken  = require("../middleware/auth");
const  jobController = require("../controllers/jobController");
const router = express.Router();

router.post("/", verifyToken , jobController.createJob);
router.get("/", verifyToken, jobController.getJobs);

module.exports = router;
