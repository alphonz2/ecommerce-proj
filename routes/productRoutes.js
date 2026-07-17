const express = require("express");
const router = express.Router();
const {
  addProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  getAvailableProducts,
  getUnavailableProducts,
  getProductByName,
  getProductByCategory,
} = require("../controllers/productController");

// Specific/static routes must come before dynamic "/:id" routes
router.get("/available", getAvailableProducts); // 7
router.get("/unavailable", getUnavailableProducts); // 8
router.get("/name/:name", getProductByName); // 9
router.get("/category/:category", getProductByCategory); // 10

router.post("/", addProduct); // 1
router.get("/:id", getProductById); // 2
router.get("/", getAllProducts); // 3
router.put("/:id", updateProduct); // 4
router.delete("/:id", deleteProduct); // 5
router.delete("/", deleteAllProducts); // 6

module.exports = router;
