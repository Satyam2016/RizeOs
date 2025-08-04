const Job = require("../models/Job");

exports.createJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      skills,
      budget,
      location,
      type,
      currency,
    } = req.body;

    console.log(req.body)
    
    const job = await Job.create({
      title,
      description,
      skills,
      budget,
      location,
      type,
      currency,
      author: userId,
      status: "active",
      createdAt: new Date(),
      payment: {
        amount: 0.012,
        currency,
        status: "completed"
      }
    });

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    res.status(500).json({ error: "Failed to post job", details: err.message });
  }
};


exports.getJobs = async (req, res) => {
  try {
   
     const jobs = await Job.find().populate("author")

    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

