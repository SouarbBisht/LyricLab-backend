const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET; // store in .env

// ✅ Signup
const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ fullName, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login
// ✅ Login
const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid password" });
  
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      // ✅ Send token in response body — client stores it
      res.status(200).json({
        message: "Login successful",
        token,
        user: { id: user._id, fullName: user.fullName, email: user.email },
      });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // ✅ Logout — nothing to clear server-side, just tell client to drop the token
  const logout = (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
  };

module.exports = { signup, login, logout };