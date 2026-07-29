import bcrypt from 'bcrypt';
import passport from 'passport';
import User from '../models/User.js';

class AuthController {
  // POST /api/auth/register
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res
          .status(400)
          .json({
            success: false,
            message: 'username, email and password are required',
          });
      }

      const normalizedEmail = email.toLowerCase();

      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email: normalizedEmail,
        password: hashedPassword,
      });

      res.status(201).json({
        success: true,
        data: { id: user._id, username: user.username, email: user.email },
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // POST /api/auth/login
  login(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: info?.message || 'Login failed' });
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.status(200).json({
          success: true,
          data: { id: user._id, username: user.username, email: user.email },
        });
      });
    })(req, res, next);
  }

  // POST /api/auth/logout
  logout(req, res, next) {
    req.logout((err) => {
      if (err) return next(err);
      res
        .status(200)
        .json({ success: true, message: 'Logged out successfully' });
    });
  }

  // GET /api/auth/me
  getCurrentUser(req, res) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: 'Not logged in' });
    }
    const { id, username, email } = req.user;
    res.status(200).json({ success: true, data: { id, username, email } });
  }
}

// Export a single shared instance (singleton) — routes import this directly
export default new AuthController();
