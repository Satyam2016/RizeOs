const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true // should be hashed
  },
  profile: {
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
  },
  bio: {
    type: String,
  },
  avatar: {
    type: String, // URL
  },
  email: {
    type: String,
  },
  joinDate: {
    type: Date,
    default: Date.now // auto-set to current date when profile is created
  },
  linkedinUrl: {
    type: String,
  },
  location: {
    type: String,
  },
  skills: [
    {
      type: String,
    }
  ],
  experience: [
    {
      title: String,
      company: String,
      period: String,
      description: String
    }
  ],
  achievements: [
    {
      type: String
    }
  ],
  walletAddress: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}
,
  preferences: {
    jobTypes: [String],
    salaryRange: {
      min: Number,
      max: Number,
      currency: String
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  stats: {
    profileViews: {
      type: Number,
      default: 0
    },
    jobsPosted: {
      type: Number,
      default: 0
    },
    jobsApplied: {
      type: Number,
      default: 0
    },
    
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  verificationToken: String,
  verificationTokenExpires: Date,
  isVerified: {
  type: Boolean,
  default: false
}

});

module.exports = mongoose.model("User", userSchema);
