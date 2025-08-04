const Job = require("../models/Job");

exports.createJob = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      title,
      description,
      company,
      requirements,
      compensation,
      details,
      tags,
      expiresAt
    } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      requirements,
      compensation,
      details,
      poster: userId,
      tags,
      status: "active",
      createdAt: new Date(),
      expiresAt
    });

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    res.status(500).json({ error: "Failed to post job", details: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { skill, location, tag } = req.query;

    const filter = {};
    if (skill) filter["requirements.skills"] = skill;
    if (location) filter["requirements.location"] = location;
    if (tag) filter.tags = tag;

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

