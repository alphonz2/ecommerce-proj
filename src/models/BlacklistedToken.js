import mongoose from 'mongoose';

const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  // Same expiry as the JWT itself. MongoDB's TTL index below auto-deletes
  // the document once this date passes — no manual cleanup needed, and the
  // blacklist collection never grows forever.
  expiresAt: {
    type: Date,
    required: true,
  },
});

// TTL index: MongoDB checks this field periodically and deletes the
// document once "expiresAt" is in the past.
blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const BlacklistedToken = mongoose.model(
  'BlacklistedToken',
  blacklistedTokenSchema
);

export default BlacklistedToken;
