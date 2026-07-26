const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const connectDB = require("./config/db");
const passport = require("./config/passport");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Sessions must be set up before passport.session()
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Admin Panel - Products routes
app.use("/api/admin/products", productRoutes);

// Auth routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("E-Commerce API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
