require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

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
  name: { type: String, unique: true },
  identityValue: { type: String, unique: true },
});

const User = mongoose.model("UserInfo", userSchema);

app.post("/auth/signin", async (req, res) => {
  const { name, identityValue } = {
    name: req.body.name,
    identityValue: req.body.id,
  };

  try {
    // Check if user already exists
    let user = await User.findOne({ identityValue });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        name,
        identityValue,
      });
      await user.save();
      res.json({ name: user.name, userState: 0 });
      console.log(
        "🌹🌹🌹Welcome! new User entered in our HomePage! ",
        user.username
      );
    } else {
      res.json({ name: user.name, userState: 1 });
      console.log("👌👌👌Successfully Logined!", user.name);
    }
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(401).json({ success: false, error: "Invalid token" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
