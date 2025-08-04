const User = require("../models/User");

exports.editUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const profileUpdates = req.body.profile || {}; 

    const updatedFields = {};
    for (const key in profileUpdates) {
      if (Array.isArray(profileUpdates[key])) {
        updatedFields[`profile.${key}`] = [...profileUpdates[key]];
      } else {
        updatedFields[`profile.${key}`] = profileUpdates[key];
      }
    }

    updatedFields.updatedAt = new Date();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Edit profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
