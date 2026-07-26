const express = require("express");
const router = express.Router();
const { register, login, logout, getCurrentUser } = require("../controllers/authController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getCurrentUser);

// Example of a protected route
router.get("/protected", isAuthenticated, (req, res) => {
  res
    .status(200)
    .json({ success: true, message: `Welcome ${req.user.username}, this is a protected route` });
});

module.exports = router;
