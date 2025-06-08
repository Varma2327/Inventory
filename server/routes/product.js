const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// ➕ Add or update item (combine logic)
router.post('/', async (req, res) => {
  const { name, quantity, category } = req.body;
  try {
    const existing = await Product.findOne({ name });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json(existing);
    }
    const product = new Product({ name, quantity, category });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add/update product' });
  }
});

// 🔄 Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// 🗑️ Delete all
router.delete('/', async (req, res) => {
  await Product.deleteMany({});
  res.json({ message: 'All products deleted' });
});

// 🗑️ Delete by ID
router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

// ➖ Reduce quantity
router.patch('/:id/reduce', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });

  product.quantity = Math.max(product.quantity - 1, 0);
  await product.save();
  res.json(product);
});

module.exports = router;
