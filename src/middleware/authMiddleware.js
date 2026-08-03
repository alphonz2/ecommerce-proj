import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import BlacklistedToken from '../models/BlacklistedToken.js';

// Reads the token from the "Authorization: Bearer <token>" header,
// rejects it if it was logged-out (blacklisted), verifies it,
// and attaches the matching user to req.user.
export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ success: false, message: 'Please log in first' });
    }

    const token = authHeader.split(' ')[1]; // "Bearer <token>" -> take the token part

    // Was this exact token logged-out already? If so, reject it even
    // though it hasn't technically expired yet.
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res
        .status(401)
        .json({
          success: false,
          message: 'Session ended, please log in again',
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if invalid/expired

    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'User no longer exists' });
    }

    req.user = user;
    req.token = token; // logout() needs the raw token to blacklist it
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' });
  }
};
