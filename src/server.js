import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import connectDB from './config/db.js';
import passport from './config/passport.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Sessions must be set up before passport.session()
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change_this_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Admin Panel - Products routes (mixed public/protected, see productRoutes.js)
app.use('/api/admin/products', productRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('E-Commerce API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
