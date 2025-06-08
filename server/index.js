const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established");
});

// Inventory schema and model
const inventorySchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  category: String,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const InventoryItem = mongoose.model("InventoryItem", inventorySchema);

// Routes
app.get("/api/inventory", async (req, res) => {
  const items = await InventoryItem.find();
  res.json(items);
});

app.post("/api/inventory", async (req, res) => {
  const { name, quantity, category } = req.body;
  const newItem = new InventoryItem({ name, quantity, category });
  await newItem.save();
  res.json(newItem);
});

app.delete("/api/inventory/:id", async (req, res) => {
  await InventoryItem.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
