const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: { type: [String], required: true }, // aligned with frontend
  budget: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ["full-time", "part-time", "contract", "freelance"], required: true },
  currency: { type: String, enum: ["SOL", "ETH", "MATIC"], default: "SOL" },

  // Optional: use if you store wallet payment
  payment: {
    amount: Number,
    currency: String,
    transactionHash: String,
    status: { type: String, enum: ["pending", "completed", "failed"] }
  },

  status: { type: String, enum: ["draft", "active", "closed"], default: "active" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model("Job", jobSchema);
