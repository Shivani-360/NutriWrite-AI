# Prompt Log — Week 7 (AI Feature Integration)

NutriWrite AI generates food product descriptions using Google's Gemini API
(`gemini-3-flash-preview`). The app supports three distinct tone variations,
each driven by a separate system-instruction prompt. Below are the three
prompt variations tested, using the same product input for a fair comparison.

**Test input (same for all three):**
- Product Name: Organic Almond Butter
- Ingredients: almonds, sea salt
- Weight: Not specified
- Features: Not specified

---

## Prompt 1 — Premium Tone

**System instruction:**
> "You are a luxury food copywriter. Write a sophisticated, elegant product
> description that conveys premium quality, craftsmanship, and exclusivity.
> Use refined language, sensory details, and aspirational tone."

**Output:**
> Meticulously crafted from hand-selected, heritage-grade organic almonds, this
> velvet-smooth butter captures the pure, sun-drenched essence of the orchard
> in every gilded spoonful. Slow-roasted to an amber perfection, the nuts are
> stone-ground into a silken texture that balances a rich, toasted depth with
> the crystalline brightness of hand-harvested sea salt. This is more than a
> simple spread; it is a masterclass in minimalist luxury, offering a
> sophisticated profile that lingers on the palate with unparalleled grace.

---

## Prompt 2 — Traditional Tone

**System instruction:**
> "You are a traditional food brand copywriter. Write a warm, authentic, and
> trustworthy product description that emphasizes heritage, natural
> ingredients, and wholesome goodness. Use friendly, familiar language."

**Output:**
> Our Organic Almond Butter is made the old-fashioned way, using only the
> finest sun-ripened almonds and a light sprinkle of sea salt. We believe that
> true flavor comes from keeping things simple, which is why we never add any
> hidden oils or preservatives to our jars. Each spoonful offers a rich,
> velvety texture and a deep, nutty taste that brings a touch of wholesome
> goodness to your family's kitchen table. It's a simple, honest pantry staple
> crafted with the same care and tradition we've honored for generations.

---

## Prompt 3 — Health-Focused Tone

**System instruction:**
> "You are a health and wellness food copywriter. Write an energetic,
> informative product description that highlights nutritional benefits, clean
> ingredients, and healthy lifestyle values. Use motivating, benefit-driven
> language."

**Output:**
> Fuel your body with the pure, nutrient-dense power of our Organic Almond
> Butter, crafted from just two wholesome ingredients to perfectly complement
> your active lifestyle. Each spoonful delivers a rich source of plant-based
> protein and heart-healthy fats, providing the clean energy you need to
> conquer your day with sustained vitality and focus. By skipping the added
> sugars and inflammatory oils, we've preserved the natural, buttery flavor of
> premium roasted almonds enhanced only by a delicate touch of sea salt.
> Whether swirled into a morning bowl or enjoyed straight from the jar, this
> delicious superfood is the ultimate guilt-free fuel for your long-term
> health and wellness goals.

---

## Which worked best and why

All three prompts performed well, but the **Health-Focused** variation worked
best for our use case. It consistently produced specific, concrete claims
(protein, healthy fats, no added sugars) rather than purely abstract
adjectives, which makes the output more directly usable as real e-commerce
copy. The Premium prompt was the most stylistically impressive but ran the
longest and used the most elevated vocabulary, which could feel excessive for
smaller or budget-friendly products. The Traditional prompt struck a good
middle ground of warmth and simplicity. Overall, tone-specific system
instructions proved effective at producing genuinely distinct voices from
identical input data, without needing separate models or fine-tuning.

---

## Technical Notes

- **Model used:** `gemini-3-flash-preview` (free tier)
- Earlier attempts using `gemini-2.0-flash-lite`, `gemini-2.5-flash`, and
  `gemini-2.5-flash-lite` all failed — the 2.0 models were deprecated and
  shut down by Google on June 1, 2026, and newly created API keys/projects
  are no longer granted free-tier access to the 2.5 generation. Switching to
  `gemini-3-flash-preview` resolved this, since it is Google's current
  free-tier default as of mid-2026.
- Each tone is driven by a separate system-instruction string in
  `backend/routes/generate.js` (see `tonePrompts` object), rather than one
  generic prompt with a tone variable — this produced noticeably more
  distinct voices than parameterizing a single prompt.