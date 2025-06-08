const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Item = require("./models/Item");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/smartinventory", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Get all items
app.get("/api/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// Add or update item
app.post("/api/items", async (req, res) => {
  const { name, quantity, category } = req.body;
  if (!name || !quantity) return res.status(400).json({ message: "Missing fields" });

  let existing = await Item.findOne({ name });
  if (existing) {
    existing.quantity += parseInt(quantity);
    await existing.save();
    return res.json(existing);
  }

  const item = new Item({ name, quantity, category });
  await item.save();
  res.status(201).json(item);
});

// Delete one item
app.delete("/api/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
});

// Clear all
app.delete("/api/items", async (req, res) => {
  await Item.deleteMany({});
  res.json({ message: "All items cleared" });
});

// Reduce quantity
app.patch("/api/items/:id/reduce", async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  item.quantity = Math.max(item.quantity - 1, 0);
  await item.save();
  res.json(item);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
