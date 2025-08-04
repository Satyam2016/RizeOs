const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  content: {
    text: String,
    images: [String], // array of image URLs
    links: [
      {
        url: String,
        title: String,
        description: String,
        image: String
      }
    ]
  },
  type: {
    type: String,
    enum: ["text", "job_share", "achievement", "article"]
  },
  engagement: {
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        likedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    shares: {
      type: Number,
      default: 0
    }
  },
  tags: [String],
  visibility: {
    type: String,
    enum: ["public", "connections", "private"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model("Post", postSchema);
