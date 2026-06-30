const express = require("express");
const router = express.Router();

// In-memory store (replace with MongoDB later)
let products = [
  {
    id: 1,
    name: "Almond Energy Bar",
    ingredients: "Almonds, Honey, Dates",
    weight: "100g",
    features: "High Protein, No Added Sugar",
  },
  {
    id: 2,
    name: "Organic Turmeric Powder",
    ingredients: "Pure Organic Turmeric",
    weight: "200g",
    features: "Anti-inflammatory, Rich in Curcumin",
  },
];
let nextId = 3;

// GET all products
router.get("/", (req, res) => {
  const { q } = req.query;
  if (q) {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
    return res.json(filtered);
  }
  res.json(products);
});

// GET single product
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// POST create product
router.post("/", (req, res) => {
  const { name, ingredients, weight, features } = req.body;
  if (!name || !ingredients) {
    return res.status(400).json({ error: "Name and ingredients are required" });
  }
  const newProduct = { id: nextId++, name, ingredients, weight, features };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update product
router.put("/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE product
router.delete("/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  products.splice(index, 1);
  res.json({ message: "Product deleted successfully" });
});

module.exports = router;
