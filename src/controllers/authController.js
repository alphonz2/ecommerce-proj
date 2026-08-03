import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../models/User.js';
import BlacklistedToken from '../models/BlacklistedToken.js';

// Small helper: builds a signed JWT that carries the user id.
// It doesn't touch the database or any session — the token itself
// IS the proof of identity from now on.

//يعني زي بطاقة هوية بتعرف الموقع مين المستخدم اللي عندي هسة

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

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
    // passport.authenticate("local") still checks email + password exactly like before.
    // The only thing that changes is what happens AFTER it succeeds:
    // instead of req.logIn(user) (which creates a session), we sign a JWT and return it.
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: info?.message || 'Login failed' });
      }

      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        token,
        data: { id: user._id, username: user.username, email: user.email },
      });
    })(req, res, next);
  }

  // POST /api/auth/logout
  // Runs after the isAuthenticated middleware, so req.token is available.
  // We store this exact token in the blacklist until its natural expiry —
  // after this, the same token will be rejected by isAuthenticated even
  // though it hasn't technically expired yet.
  async logout(req, res) {
    try {
      const decoded = jwt.decode(req.token); // just reads the payload, no verification needed here

      await BlacklistedToken.create({
        token: req.token,
        expiresAt: new Date(decoded.exp * 1000), // JWT "exp" is in seconds, Date needs milliseconds
      });

      res
        .status(200)
        .json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/auth/me
  // req.user here is set by the verifyToken middleware (authMiddleware.js), not by a session.
  getCurrentUser(req, res) {
    const { id, username, email } = req.user;
    res.status(200).json({ success: true, data: { id, username, email } });
  }
}

// Export a single shared instance (singleton) — routes import this directly
export default new AuthController();
