"use client";
import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Toast } from "@/components/ui";
import RouteGuard from "@/components/RouteGuard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const TONES = [
  {
    id: "premium",
    label: "✨ Premium",
    description: "Luxury, sophisticated language",
  },
  {
    id: "traditional",
    label: "🌾 Traditional",
    description: "Warm, authentic, trustworthy",
  },
  {
    id: "health-focused",
    label: "💚 Health-Focused",
    description: "Benefits-driven, energetic",
  },
];

const EXAMPLES = [
  {
    name: "Almond Energy Bar",
    ingredients: "Almonds, Honey, Dates, Oats",
    weight: "100g",
    features: "High Protein, No Added Sugar, Gluten Free",
  },
  {
    name: "Organic Turmeric Powder",
    ingredients: "Pure Organic Turmeric (Curcuma longa)",
    weight: "200g",
    features: "Anti-inflammatory, Rich in Curcumin, No Additives",
  },
];

export default function GeneratePage() {
  return (
    <RouteGuard>
      <Suspense fallback={<Loader text="Loading..." />}>
        <GenerateContent />
      </Suspense>
    </RouteGuard>
  );
}

function GenerateContent() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    productName: "",
    ingredients: "",
    weight: "",
    features: "",
    tone: "premium",
  });
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // Pre-fill from a dashboard deep link, e.g. /generate?name=...&ingredients=...
  useEffect(() => {
    const name = searchParams.get("name");
    const ingredients = searchParams.get("ingredients");
    if (name || ingredients) {
      setForm((prev) => ({
        ...prev,
        productName: name || prev.productName,
        ingredients: ingredients || prev.ingredients,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleGenerate = useCallback(async () => {
    if (!form.productName.trim() || !form.ingredients.trim()) {
      setError("Please enter at least a product name and ingredients.");
      return;
    }
    setLoading(true);
    setError("");
    setDescription("");

    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setDescription(data.description);
    } catch (err) {
      setError(err.message || "Something went wrong. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }, [form]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(description);
    setToast({ message: "Copied to clipboard!", type: "success" });
  };

  const loadExample = (example) => {
    setForm((prev) => ({ ...prev, ...example }));
    setDescription("");
    setError("");
  };

  const handleClear = () => {
    setForm({ productName: "", ingredients: "", weight: "", features: "", tone: "premium" });
    setDescription("");
    setError("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Generate Product Description
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Fill in your product details below and let AI write a professional description for you.
        </p>
      </div>

      {/* Quick examples */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <span className="text-sm text-gray-400 self-center">Try an example:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.name}
            onClick={() => loadExample(ex)}
            className="text-sm px-3 py-1.5 rounded-lg border border-brand-300 dark:border-brand-700 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
          >
            {ex.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Form */}
        <div className="card space-y-5">
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Product Details
          </h2>

          {/* Product Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Almond Energy Bar"
              value={form.productName}
              onChange={setField("productName")}
              className="input-field"
            />
          </div>

          {/* Ingredients */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ingredients <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Almonds, Honey, Dates, Oats"
              value={form.ingredients}
              onChange={setField("ingredients")}
              className="input-field resize-none"
            />
          </div>

          {/* Weight */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Weight / Size
            </label>
            <input
              type="text"
              placeholder="e.g. 100g, 500ml, 1kg"
              value={form.weight}
              onChange={setField("weight")}
              className="input-field"
            />
          </div>

          {/* Features */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Key Features
            </label>
            <input
              type="text"
              placeholder="e.g. High Protein, No Added Sugar, Vegan"
              value={form.features}
              onChange={setField("features")}
              className="input-field"
            />
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Writing Tone <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {TONES.map((tone) => (
                <label
                  key={tone.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    form.tone === tone.id
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="tone"
                    value={tone.id}
                    checked={form.tone === tone.id}
                    onChange={setField("tone")}
                    className="mt-0.5 accent-brand-600"
                  />
                  <div>
                    <div className="font-medium text-sm text-gray-900 dark:text-white">
                      {tone.label}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {tone.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? "Generating..." : "✨ Generate Description"}
            </button>
            <button onClick={handleClear} className="btn-secondary">
              Clear
            </button>
          </div>
        </div>

        {/* RIGHT: Result */}
        <div className="card flex flex-col">
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
            Generated Description
          </h2>

          {loading ? (
            <Loader text="AI is writing your description..." />
          ) : description ? (
            <div className="flex-1 flex flex-col gap-5">
              <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-5 text-gray-700 dark:text-gray-200 leading-relaxed text-[15px]">
                {description}
              </div>

              {/* Tone badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Tone:</span>
                <span className="text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-2.5 py-1 rounded-full capitalize">
                  {form.tone}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button onClick={handleCopy} className="btn-primary flex-1">
                  📋 Copy Text
                </button>
                <button onClick={handleGenerate} className="btn-secondary flex-1">
                  🔄 Regenerate
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16 text-gray-400 dark:text-gray-500">
              <span className="text-6xl mb-4 block">✍️</span>
              <p className="font-medium mb-1">Your description will appear here</p>
              <p className="text-sm">Fill in the form and click Generate</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}