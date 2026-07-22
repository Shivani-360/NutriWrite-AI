"use client";
import { useState, useEffect } from "react";
import { Input, Button } from "@/components/ui";

export default function ProductModal({ product, onClose, onSubmit }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name || "",
    ingredients: product?.ingredients || "",
    weight: product?.weight || "",
    features: product?.features || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Lock background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Product name is required";
    if (!form.ingredients.trim()) next.ingredients = "Ingredients are required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-md animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Input
              label="Product Name"
              id="name"
              placeholder="e.g. Organic Almond Butter"
              value={form.name}
              onChange={handleChange("name")}
              required
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              label="Ingredients"
              id="ingredients"
              placeholder="e.g. almonds, sea salt"
              value={form.ingredients}
              onChange={handleChange("ingredients")}
              multiline
              rows={2}
              required
            />
            {errors.ingredients && (
              <p className="text-xs text-red-500 mt-1">{errors.ingredients}</p>
            )}
          </div>

          <Input
            label="Weight (optional)"
            id="weight"
            placeholder="e.g. 250g"
            value={form.weight}
            onChange={handleChange("weight")}
          />

          <Input
            label="Features (optional)"
            id="features"
            placeholder="e.g. vegan, no added sugar"
            value={form.features}
            onChange={handleChange("features")}
            multiline
            rows={2}
          />

          <div className="flex gap-3 mt-2">
            <Button type="button" variant="secondary" onClick={onClose} fullWidth>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting} fullWidth>
              {submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
