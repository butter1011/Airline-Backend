require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// User model
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  googleId: { type: String, unique: true },
  thumbnail: String,
});

const User = mongoose.model("User", userSchema);

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post("/auth/google", async (req, res) => {
  const { accessToken } = req.body;

  try {
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const userData = userInfoResponse.data;

    const { username, email, googleId, thumbnail } = {
      username: userData.name,
      email: userData.email,
      googleId: userData.id,
      thumbnail: userData.picture,
    };
    // Check if user already exists
    let user = await User.findOne({ googleId });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        username,
        email,
        googleId,
        thumbnail,
      });
      await user.save();
      res.json({ username: user.username, userState: 0 });
      console.log(
        "🌹🌹🌹Welcome! new User entered in our HomePage! ",
        user.username
      );
    } else {
      res.json({ username: user.username, userState: 1 });
      console.log("👌👌👌Successfully Logined!", user.username);
    }
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(401).json({ success: false, error: "Invalid token" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
