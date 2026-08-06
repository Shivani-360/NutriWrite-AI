"use client";
import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Toast } from "@/components/ui";
import RouteGuard from "@/components/RouteGuard";
import Sprout from "@/components/Sprout";

const API_URL = "";

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
      <Suspense fallback={<div className="flex justify-center py-20"><Sprout pose="thinking" size={100} /></div>}>
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
  // The newly-generated version during a regenerate, shown alongside the
  // current one until the user picks which to keep. null = not comparing.
  const [candidateDescription, setCandidateDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [justCompleted, setJustCompleted] = useState(false);

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

  // First-time generation — no existing description to compare against
  const handleGenerate = useCallback(async () => {
    if (!form.productName.trim() || !form.ingredients.trim()) {
      setError("Please enter at least a product name and ingredients.");
      return;
    }
    setLoading(true);
    setError("");
    setDescription("");
    setCandidateDescription(null);
    setJustCompleted(false);

    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setDescription(data.description);
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 2000);
    } catch (err) {
      setError(err.message || "Something went wrong. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }, [form]);

  // Regenerate — keeps the current description visible and fetches a new
  // one as a "candidate", entering compare mode instead of overwriting.
  const handleRegenerate = useCallback(async () => {
    setLoading(true);
    setError("");
    setCandidateDescription(null);

    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setCandidateDescription(data.description);
    } catch (err) {
      setError(err.message || "Something went wrong. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }, [form]);

  const keepCandidate = () => {
    setDescription(candidateDescription);
    setCandidateDescription(null);
    setJustCompleted(true);
    setTimeout(() => setJustCompleted(false), 1500);
  };

  const keepOriginal = () => {
    setCandidateDescription(null);
  };

  const handleCopy = async (text = description) => {
    await navigator.clipboard.writeText(text);
    setToast({ message: "Copied to clipboard!", type: "success" });
  };

  const loadExample = (example) => {
    setForm((prev) => ({ ...prev, ...example }));
    setDescription("");
    setCandidateDescription(null);
    setError("");
  };

  const handleClear = () => {
    setForm({ productName: "", ingredients: "", weight: "", features: "", tone: "premium" });
    setDescription("");
    setCandidateDescription(null);
    setError("");
  };

  const isComparing = candidateDescription !== null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="heading-display text-4xl text-ink dark:text-white mb-3">
          Generate Product Description
        </h1>
        <p className="text-ink-dim dark:text-gray-400 max-w-xl mx-auto">
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

      <div className={`grid grid-cols-1 gap-8 ${isComparing ? "" : "lg:grid-cols-2"}`}>
        {/* LEFT: Form — hidden while comparing to give the two descriptions room */}
        {!isComparing && (
          <div className="card space-y-5">
            <h2 className="font-semibold text-lg text-ink dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
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
                      <div className="font-medium text-sm text-ink dark:text-white">
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

            {/* Error — Sprout confused sits alongside the message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 flex items-center gap-3">
                <Sprout pose="confused" size={54} className="flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
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
        )}

        {/* RIGHT: Result — full width while comparing */}
        <div className="card flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
            <h2 className="font-semibold text-lg text-ink dark:text-white">
              {isComparing ? "Compare Descriptions" : "Generated Description"}
            </h2>
            {isComparing && (
              <button
                onClick={keepOriginal}
                className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ← Back to form
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16">
              <Sprout pose="thinking" size={120} />
              <p className="text-ink-dim dark:text-gray-400 text-sm mt-4">
                AI is writing your description...
              </p>
            </div>
          ) : justCompleted && !isComparing ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16">
              <Sprout pose="celebrating" size={120} />
              <p className="text-ink-dim dark:text-gray-400 text-sm mt-4">
                Done! Here's your description.
              </p>
            </div>
          ) : isComparing ? (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Original */}
              <div className="flex flex-col gap-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Current</span>
                <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-gray-700 dark:text-gray-200 leading-relaxed text-sm">
                  {description}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleCopy(description)} className="btn-secondary flex-1 text-sm py-2">
                    📋 Copy
                  </button>
                  <button onClick={keepOriginal} className="btn-primary flex-1 text-sm py-2">
                    Keep this one
                  </button>
                </div>
              </div>

              {/* Candidate (new) */}
              <div className="flex flex-col gap-4 border-2 border-brand-400 dark:border-brand-600 rounded-xl p-4 relative">
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wide">New</span>
                <div className="flex-1 bg-brand-50 dark:bg-brand-900/20 rounded-xl p-4 text-gray-700 dark:text-gray-200 leading-relaxed text-sm">
                  {candidateDescription}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleCopy(candidateDescription)} className="btn-secondary flex-1 text-sm py-2">
                    📋 Copy
                  </button>
                  <button onClick={keepCandidate} className="btn-primary flex-1 text-sm py-2">
                    Keep this one
                  </button>
                </div>
              </div>
            </div>
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
                <button onClick={() => handleCopy(description)} className="btn-primary flex-1">
                  📋 Copy Text
                </button>
                <button onClick={handleRegenerate} className="btn-secondary flex-1">
                  🔄 Regenerate
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
              <Sprout pose="idle" size={100} className="mb-4" />
              <p className="font-medium mb-1 text-ink dark:text-gray-300">Your description will appear here</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Fill in the form and click Generate</p>
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