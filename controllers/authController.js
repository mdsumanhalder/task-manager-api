const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "Email or Username already esists" });
    }

    const user = new User({ username, email, password, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user;
    // Check if the input is an email (simple check using a regex)
    const isEmail = username.includes("@");

    if (isEmail) {
      // Find user by email
      user = await User.findOne({ email: username });
    } else {
      // Find user by username
      user = await User.findOne({ username: username });
    }

    if (!user) {
      return res.status(404).json({ message: "Invalid username or email" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return token and user information
    res.status(200).json({
      token,
      user,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
