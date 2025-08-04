const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  factors: {
    skillMatch: {
      type: Number,
      min: 0,
      max: 100
    },
    experienceMatch: {
      type: Number,
      min: 0,
      max: 100
    },
    locationMatch: {
      type: Number,
      min: 0,
      max: 100
    },
    salaryMatch: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  reasoning: [String],
  status: {
    type: String,
    enum: ["suggested", "viewed", "applied", "dismissed"],
    default: "suggested"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  viewedAt: Date,
  actionedAt: Date
});

module.exports = mongoose.model("Match", matchSchema);
