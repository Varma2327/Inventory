const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// GET all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST a new product
router.post('/', async (req, res) => {
  const { name, quantity } = req.body;
  const product = new Product({ name, quantity });
  await product.save();
  res.status(201).json(product);
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

// PATCH to reduce quantity
router.patch('/:id/reduce', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  product.quantity = Math.max(product.quantity - 1, 0);
  await product.save();
  res.json(product);
});

module.exports = router;
