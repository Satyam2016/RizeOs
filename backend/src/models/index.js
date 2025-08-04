const mongoose = require("mongoose");   


const JobSchema = require('./Job');
const UserSchema = require('./User');
const PostSchema = require('./Post');
const MatchSchema = require('./Match');
const PaymentSchema = require('./Payment');


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/job_portal', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

module.exports = {
  connectDB,
  JobSchema,
  UserSchema,
  PostSchema,
  MatchSchema,
  PaymentSchema
};