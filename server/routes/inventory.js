const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/InventoryItem');

// GET all items
router.get('/', async (req, res) => {
  const items = await InventoryItem.find();
  res.json(items);
});

// POST new item
router.post('/', async (req, res) => {
  const { name, quantity, location } = req.body;
  const newItem = new InventoryItem({ name, quantity, location });
  await newItem.save();
  res.status(201).json(newItem);
});

// DELETE item by ID
router.delete('/:id', async (req, res) => {
  await InventoryItem.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;
