const express = require("express");
const router = express.Router();
const { signup, login, logout } = require("../controllers/authController");
const protect = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Example of a protected route:
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;