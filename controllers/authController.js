const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "username, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      data: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ success: false, message: info?.message || "Login failed" });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({
        success: true,
        data: { id: user._id, username: user.username, email: user.email },
      });
    });
  })(req, res, next);
};

// POST /api/auth/logout
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  });
};

// GET /api/auth/me
exports.getCurrentUser = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }
  const { id, username, email } = req.user;
  res.status(200).json({ success: true, data: { id, username, email } });
};
