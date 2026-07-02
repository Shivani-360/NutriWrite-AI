const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const GeneratedDescription = require("../models/GeneratedDescription");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Tone-specific prompt templates
const tonePrompts = {
  premium: `You are a luxury food copywriter. Write a sophisticated, elegant product description that conveys premium quality, craftsmanship, and exclusivity. Use refined language, sensory details, and aspirational tone.`,

  traditional: `You are a traditional food brand copywriter. Write a warm, authentic, and trustworthy product description that emphasizes heritage, natural ingredients, and wholesome goodness. Use friendly, familiar language.`,

  "health-focused": `You are a health and wellness food copywriter. Write an energetic, informative product description that highlights nutritional benefits, clean ingredients, and healthy lifestyle values. Use motivating, benefit-driven language.`,
};

// POST /api/generate
router.post("/", async (req, res) => {
  try {
    const { productName, ingredients, weight, features, tone } = req.body;

    // Validation
    if (!productName || !ingredients || !tone) {
      return res.status(400).json({
        error: "Product name, ingredients, and tone are required.",
      });
    }

    const toneInstruction =
      tonePrompts[tone] || tonePrompts["health-focused"];

    const prompt = `
${toneInstruction}

Generate a compelling product description for the following food product:

Product Name: ${productName}
Ingredients: ${ingredients}
Weight: ${weight || "Not specified"}
Key Features: ${features || "Not specified"}

Write a 3-4 sentence product description only. Do not include headings, bullet points, or extra formatting. Just the description paragraph.
    `.trim();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(prompt);
    const description = result.response.text().trim();

    // Save to history (don't let a save failure block the response to the user)
    try {
      await GeneratedDescription.create({
        productName,
        ingredients,
        weight,
        features,
        tone,
        description,
      });
    } catch (saveError) {
      console.error("Failed to save generation history:", saveError.message);
    }

    res.json({
      success: true,
      description,
      product: { productName, ingredients, weight, features, tone },
    });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({
      error: "Failed to generate description. Please check your API key.",
    });
  }
});

// GET /api/generate/history - view past generations
router.get("/history", async (req, res) => {
  try {
    const history = await GeneratedDescription.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error("Error fetching history:", error.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;