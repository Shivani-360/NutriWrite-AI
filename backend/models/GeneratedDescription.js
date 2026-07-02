const mongoose = require("mongoose");

const generatedDescriptionSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: {
      type: String,
      required: true,
      trim: true,
    },
    weight: {
      type: String,
      default: "",
    },
    features: {
      type: String,
      default: "",
    },
    tone: {
      type: String,
      required: true,
      enum: ["premium", "traditional", "health-focused"],
    },
    description: {
      type: String,
      required: true,
    },
    // Optional link back to a saved Product, if this description was
    // generated for a product already stored in the database
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GeneratedDescription", generatedDescriptionSchema);