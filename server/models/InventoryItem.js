const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
