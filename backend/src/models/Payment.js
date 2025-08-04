const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["job_posting", "feature_boost", "subscription"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true // e.g., "SOL", "ETH", "MATIC"
  },
  blockchain: {
    type: String,
    required: true // e.g., "solana", "ethereum", "polygon"
  },
  transaction: {
    hash: {
      type: String,
      required: true
    },
    blockNumber: Number,
    gasUsed: Number,
    gasPrice: Number
  },
  adminWallet: {
    type: String,
    required: true
  },
  userWallet: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "failed"],
    default: "pending"
  },
  relatedEntity: {
    type: {
      type: String // e.g., "Job", "Post"
    },
    id: mongoose.Schema.Types.ObjectId
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date
});

module.exports = mongoose.model("Payment", paymentSchema);
