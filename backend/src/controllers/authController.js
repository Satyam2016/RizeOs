const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../services/emailService");
require("dotenv").config();


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};


const createVerificationToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashed };
};


exports.register = async (req, res) => {
  try {
    const { name , email, password } = req.body;
    console.log("called ---- auth")

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const { token, hashed } = createVerificationToken();

    const verificationTokenExpires = Date.now() + 1000 * 60 * 60 * 24;

    const user = await User.create({
      email,
      password: hashedPassword,
      profile: {  name, email } ,
      verificationToken: hashed,
      verificationTokenExpires
    });

    const verificationURL = `http://localhost:5173/auth?token=${token}&id=${user._id}`;

    

    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `
        <h3>Welcome to Job Portal!</h3>
        <p>Click the button below to verify your email:</p>
        <a href="${verificationURL}" style="padding: 10px 20px; background: #0A66C2; color: white; text-decoration: none;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `
    });

    res.status(201).json({ message: "Verification email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { token, hashed } = createVerificationToken();
    const verificationTokenExpires = Date.now() + 1000 * 60 * 60 * 24;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          "profile.name": name,
          verificationToken: hashed,
          verificationTokenExpires,
          password: hashedPassword
        }
      },
      { new: true }
    );

    const verificationURL = `http://localhost:5173/auth?token=${token}&id=${updatedUser._id}`;

    await sendEmail({
      to: updatedUser.email,
      subject: "Verify your email",
      html: `
        <h3>Welcome to Job Portal!</h3>
        <p>Click the button below to verify your email:</p>
        <a href="${verificationURL}" style="padding: 10px 20px; background: #0A66C2; color: white; text-decoration: none;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `
    });

    res.status(201).json({ message: "Verification email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.verifyEmail = async (req, res) => {
  console.log("verify email api hit")
  try {
    const { token, id } = req.query;
    console.log("token ", token);
    console.log("id  ", id);
    if (!token || !id) return res.status(400).json({ message: "Invalid verification link" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      _id: id,
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.profile.isVerified = true;
    // user.verificationToken = undefined;
    // user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });
    
    if (!user.profile.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in" });
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    const token = generateToken(user._id);
    console.log("trigeered login")
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
