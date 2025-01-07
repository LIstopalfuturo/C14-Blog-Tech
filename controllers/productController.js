const { Product } = require('../models');

const productController = {
  // Get all products
  async getAllProducts(req, res) {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a single product by ID
  async getProductById(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get products by category
  async getProductsByCategory(req, res) {
    try {
      const products = await Product.find({ category: req.params.category });
      res.json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new product
  async createProduct(req, res) {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Update a product
  async updateProduct(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Delete a product
  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

module.exports = productController;
