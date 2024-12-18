const UserInfo = require("../models/userInfoSchema");
const { uploadFileToS3 } = require("../utils/awsUpload");
const createUserInfo = async (req, res) => {
  let { name, whatsappNumber, email } = req.body;

  let existingUser = null;

  if (!email && !whatsappNumber) {
    return res.status(400).json({
      success: false,
      message: "Either email or WhatsApp number is required",
    });
  }

  try {
    // Check if user already exists
    if (email) {
      existingUser = await UserInfo.findOne({ email: email });
    } else if (whatsappNumber) {
      existingUser = await UserInfo.findOne({
        whatsappNumber: whatsappNumber,
      });
    }

    if (existingUser) {
      return res.json({ userData: existingUser, userState: 1 });
    }

    // Create new user if doesn't exist
    let newUser = new UserInfo({
      name: name,
      email: email,
      whatsappNumber: whatsappNumber,
    });
    await newUser.save();

    res.json({ userData: newUser, userState: 0 });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

///
/// Edit user
const editUserInfo = async (req, res) => {
  let { name, bio, _id, favoriteAirline } = req.body;
  let editingUser = null;

  try {
    // Check if user already exists
    editingUser = await UserInfo.findOne({ _id: _id });
    // Create new user if doesn't exist
    editingUser.name = name;
    editingUser.bio = bio;
    if (favoriteAirline) {
      editingUser.favoriteAirlines = favoriteAirline;
    }

    await editingUser.save();
    res.json({ userData: editingUser, userState: 1 });
  } catch (error) {
    console.error("Error editingUser:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

///
/// BadgeEdit user
const badgeEditUserInfo = async (req, res) => {
  let { selectedbadges, _id } = req.body;
  let badgeEditingUser = null;
  try {
    // Check if user already exists
    badgeEditingUser = await UserInfo.findOne({ _id: _id });
    // Create new user if doesn't exist
    badgeEditingUser.selectedbadges = selectedbadges;

    await badgeEditingUser.save();
    res.json({ userData: badgeEditingUser, userState: 1 });
  } catch (error) {
    console.error("Error editingUser:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

const uploadUserAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const file = req.file;
    const userId = req.body.userId;

    const fileType = file.originalname.split(".")[1].toLowerCase();
    const url = await uploadFileToS3(
      file.buffer,
      `avatar/${userId}.${fileType}`
    );

    const user = await UserInfo.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    user.profilePhoto = url;
    await user.save();

    res.json({ userData: user, userState: 1 });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ success: false, error: "File upload failed" });
  }
};

const increaseUserPoints = async (req, res) => {
  const { _id, pointsToAdd } = req.body;

  try {
    const user = await UserInfo.findById(_id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ success: false, error: "User not found" });
    }

    user.points = Number(user.points) + Number(pointsToAdd);

    if (user.points >= 500 && user.points < 3000) {
      user.selectedbadges = "Needs Improvement";
    } else if (user.points >= 3000 && user.points < 5000) {
      user.selectedbadges = "Fair Reviewer";
    } else if (user.points >= 5000 && user.points < 7000) {
      user.selectedbadges = "Good Reviewer";
    } else if (user.points >= 7000 && user.points < 10000) {
      user.selectedbadges = "Excellent Reviewer";
    } else if (user.points >= 10000) {
      user.selectedbadges = "Top Reviewer";
    }
    await user.save();

    res.json({ userData: user, userState: 1 });
  } catch (error) {
    console.error("Error increasing points:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
module.exports = {
  createUserInfo,
  editUserInfo,
  badgeEditUserInfo,
  uploadUserAvatar,
  increaseUserPoints,
};
