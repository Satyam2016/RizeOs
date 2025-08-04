const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    name: String,
    logo: String, // URL
    website: String
  },
  requirements: {
    skills: {
      type: [String],
      required: true
    },
    experience: String,
    education: String,
    location: String
  },
  compensation: {
    type: {
      type: String // "salary", "hourly", "project"
    },
    amount: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "USD"
      }
    }
  },
  details: {
    type: String, // "Full-time", "Part-time", "Contract"
    remote: {
      type: Boolean,
      default: false
    },
    urgent: {
      type: Boolean,
      default: false
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  applications: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      appliedAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ["pending", "reviewed", "accepted", "rejected"],
        default: "pending"
      },
      message: String
    }
  ],
  payment: {
    required: {
      type: Boolean,
      default: true
    },
    amount: Number,
    currency: String, // e.g., "SOL", "ETH", "MATIC"
    transactionHash: String,
    status: {
      type: String,
      enum: ["pending", "completed", "failed"]
    }
  },
  tags: [String],
  status: {
    type: String,
    enum: ["draft", "active", "closed"]
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  expiresAt: Date
});

module.exports = mongoose.model("Job", jobSchema);
