const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Admin Panel - Products routes
app.use("/api/admin/products", productRoutes);

app.get("/", (req, res) => {
  res.send("E-Commerce API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
