const UserInfo = require("../models/userInfoSchema");
const createUserInfo = async (req, res) => {
  let { name, whatsappNumber, email, apple } = req.body;

  let existingUser = null;

  if (!email && !whatsappNumber &&!apple) {
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
    else if(apple){
      existingUser = await UserInfo.findOne({
        apple: apple,
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
      apple:apple,
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
  let { name, bio, _id, favoriteAirline, profilePhoto } = req.body;
  let editingUser = null;

  try {
    // Check if user already exists
    editingUser = await UserInfo.findOne({ _id: _id });
    // Create new user if doesn't exist
    editingUser.name = name;
    editingUser.bio = bio;
    editingUser.profilePhoto = profilePhoto;
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

const increaseUserPoints = async (req, res) => {
  const { _id, pointsToAdd } = req.body;

  try {
    const user = await UserInfo.findById(_id);
    if (!user) {
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
  increaseUserPoints,
};
