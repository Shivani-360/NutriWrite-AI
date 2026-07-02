const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    ingredients: {
      type: String,
      required: [true, "Ingredients are required"],
      trim: true,
    },
    weight: {
      type: String,
      trim: true,
      default: "",
    },
    features: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);