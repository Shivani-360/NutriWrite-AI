const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products (supports ?q= search by name)
router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q ? { name: { $regex: q, $options: "i" } } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    // Invalid ObjectId format also lands here
    res.status(404).json({ error: "Product not found" });
  }
});

// POST create product
router.post("/", async (req, res) => {
  try {
    const { name, ingredients, weight, features } = req.body;
    if (!name || !ingredients) {
      return res.status(400).json({ error: "Name and ingredients are required" });
    }
    const newProduct = await Product.create({ name, ingredients, weight, features });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT update product
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(404).json({ error: "Product not found" });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: "Product not found" });
  }
});

module.exports = router;