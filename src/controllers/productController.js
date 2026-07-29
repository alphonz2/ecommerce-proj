import Product from '../models/Product.js';

class ProductController {
  // 1) Add a product
  async addProduct(req, res) {
    try {
      const {
        name,
        description,
        brand,
        category,
        price,
        quantity,
        available,
        status,
      } = req.body;

      const product = await Product.create({
        name: name?.toLowerCase(),
        description,
        brand: brand?.toLowerCase(),
        category: category?.toLowerCase(),
        price,
        quantity,
        available,
        status: status?.toLowerCase(),
      });

      res.status(201).json({ success: true, data: product });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // 2) Get a specific product (by Id)
  async getProductById(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: 'Product not found' });
      }
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // 3) Get all products
  async getAllProducts(req, res) {
    try {
      const products = await Product.find();
      res
        .status(200)
        .json({ success: true, count: products.length, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 4) Update a product
  async updateProduct(req, res) {
    try {
      const updates = { ...req.body };

      if (updates.name) updates.name = updates.name.toLowerCase();
      if (updates.brand) updates.brand = updates.brand.toLowerCase();
      if (updates.category) updates.category = updates.category.toLowerCase();
      if (updates.status) updates.status = updates.status.toLowerCase();

      const product = await Product.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      });
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: 'Product not found' });
      }
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // 5) Delete a specific product
  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: 'Product not found' });
      }
      res
        .status(200)
        .json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // 6) Delete all products
  async deleteAllProducts(req, res) {
    try {
      const result = await Product.deleteMany();
      res.status(200).json({
        success: true,
        message: `${result.deletedCount} products deleted successfully`,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 7) Get all available products
  async getAvailableProducts(req, res) {
    try {
      const products = await Product.find({ available: true });
      res
        .status(200)
        .json({ success: true, count: products.length, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 8) Get all unavailable products
  async getUnavailableProducts(req, res) {
    try {
      const products = await Product.find({ available: false });
      res
        .status(200)
        .json({ success: true, count: products.length, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 9) Get product by name
  async getProductByName(req, res) {
    try {
      const searchName = req.params.name.toLowerCase();
      const products = await Product.find({ name: { $regex: searchName } });
      res
        .status(200)
        .json({ success: true, count: products.length, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 10) Get product by category
  async getProductByCategory(req, res) {
    try {
      const searchCategory = req.params.category.toLowerCase();
      const products = await Product.find({
        category: { $regex: searchCategory },
      });
      res
        .status(200)
        .json({ success: true, count: products.length, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

// Export a single shared instance (singleton) — routes import this directly
export default new ProductController();
