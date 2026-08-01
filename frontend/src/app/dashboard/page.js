"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Toast } from "@/components/ui";
import RouteGuard from "@/components/RouteGuard";
import ProductModal from "@/components/ProductModal";
import UndoToast from "@/components/UndoToast";
import Sprout from "@/components/Sprout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const UNDO_WINDOW_MS = 4000;

export default function DashboardPage() {
  return (
    <RouteGuard>
      <DashboardContent />
    </RouteGuard>
  );
}

function DashboardContent() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state: null = closed, {} = create mode, {product} = edit mode
  const [modalProduct, setModalProduct] = useState(undefined); // undefined = closed
  const [toast, setToast] = useState(null); // { message, type }

  // --- Soft delete / undo state ---
  const [hiddenIds, setHiddenIds] = useState(new Set());
  const [undoTarget, setUndoTarget] = useState(null); // the product currently show-able as "undo"
  const deleteTimers = useRef({}); // productId -> timeoutId

  const showToast = (message, type = "success") => setToast({ message, type });

  // Clean up any pending delete timers if the component unmounts mid-countdown
  useEffect(() => {
    return () => {
      Object.values(deleteTimers.current).forEach(clearTimeout);
    };
  }, []);

  const fetchProducts = async (q = "") => {
    setLoading(true);
    setError("");
    try {
      const url = q
        ? `${API_URL}/api/products?q=${encodeURIComponent(q)}`
        : `${API_URL}/api/products`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data);
    } catch {
      setError("Could not connect to backend. Make sure it is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  // --- CREATE / UPDATE ---
  const handleModalSubmit = async (formData) => {
    const isEdit = !!modalProduct?._id;
    try {
      const res = await fetch(
        isEdit ? `${API_URL}/api/products/${modalProduct._id}` : `${API_URL}/api/products`,
        {
          method: isEdit ? "PUT" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setModalProduct(undefined);
      await fetchProducts(search);
      showToast(isEdit ? "Product updated" : "Product added", "success");
    } catch (err) {
      showToast(err.message || "Failed to save product", "error");
    }
  };

  // --- SOFT DELETE ---
  // Hides the card immediately and shows an Undo toast. The real DELETE
  // call only fires once the undo window expires without a click.
  const handleDeleteClick = (product) => {
    setHiddenIds((prev) => new Set(prev).add(product._id));
    setUndoTarget(product);

    const timer = setTimeout(() => finalizeDelete(product), UNDO_WINDOW_MS);
    deleteTimers.current[product._id] = timer;
  };

  const finalizeDelete = async (product) => {
    delete deleteTimers.current[product._id];
    try {
      const res = await fetch(`${API_URL}/api/products/${product._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete product");
      }
      // Permanently gone — clear it from the actual products list too
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (err) {
      // Delete failed — bring the card back and let the user know
      setHiddenIds((prev) => {
        const next = new Set(prev);
        next.delete(product._id);
        return next;
      });
      showToast(err.message || "Failed to delete product", "error");
    } finally {
      setUndoTarget((current) => (current?._id === product._id ? null : current));
    }
  };

  const handleUndo = () => {
    if (!undoTarget) return;
    clearTimeout(deleteTimers.current[undoTarget._id]);
    delete deleteTimers.current[undoTarget._id];
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.delete(undoTarget._id);
      return next;
    });
    setUndoTarget(null);
  };

  const visibleProducts = products.filter((p) => !hiddenIds.has(p._id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-display text-3xl text-ink dark:text-white">Dashboard</h1>
          <p className="text-ink-dim dark:text-gray-400 mt-1">Manage your food products</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary" onClick={() => setModalProduct({})}>
            + Add Product
          </button>
          <Link href="/generate" className="btn-primary">
            Generate Description
          </Link>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field flex-1"
        />
        <div className="flex gap-3">
          <button type="submit" className="btn-primary px-6 flex-1 sm:flex-none">
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); fetchProducts(""); }}
              className="btn-secondary flex-1 sm:flex-none"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Sprout pose="thinking" size={100} />
          <p className="text-ink-dim dark:text-gray-400 text-sm mt-4">Loading products...</p>
        </div>
      ) : error ? (
        <div className="card text-center py-12">
          <div className="flex justify-center mb-4">
            <Sprout pose="confused" size={90} />
          </div>
          <p className="text-red-500 dark:text-red-400 font-medium mb-2">{error}</p>
          <p className="text-sm text-gray-400">Start your backend: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">npm run dev</code> in the backend folder</p>
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="card text-center py-16">
          <div className="flex justify-center mb-4">
            <Sprout pose={search ? "confused" : "sleeping"} size={100} />
          </div>
          <p className="text-ink-dim dark:text-gray-400 mb-6">
            {search ? `No products match "${search}".` : "No products yet — add your first one."}
          </p>
          <button className="btn-primary" onClick={() => setModalProduct({})}>
            + Add your first product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visibleProducts.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Tilt
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                scale={1.02}
                transitionSpeed={1500}
                glareEnable={false}
                className="card hover:shadow-md transition-shadow h-full"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-ink dark:text-white text-lg">
                    {product.name}
                  </h3>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setModalProduct(product)}
                      className="text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-sm"
                      aria-label="Edit product"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                      aria-label="Delete product"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm text-ink-dim dark:text-gray-400">
                  <p><span className="font-medium text-gray-700 dark:text-gray-300">Ingredients:</span> {product.ingredients}</p>
                  {product.weight && <p><span className="font-medium text-gray-700 dark:text-gray-300">Weight:</span> {product.weight}</p>}
                  {product.features && <p><span className="font-medium text-gray-700 dark:text-gray-300">Features:</span> {product.features}</p>}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <Link
                    href={`/generate?name=${encodeURIComponent(product.name)}&ingredients=${encodeURIComponent(product.ingredients)}`}
                    className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline"
                  >
                    Generate description →
                  </Link>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && !error && visibleProducts.length > 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-6 text-center">
          {visibleProducts.length} product{visibleProducts.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Create / Edit modal */}
      {modalProduct !== undefined && (
        <ProductModal
          product={modalProduct._id ? modalProduct : null}
          onClose={() => setModalProduct(undefined)}
          onSubmit={handleModalSubmit}
        />
      )}

      {/* Undo toast — replaces the old delete confirmation dialog */}
      <UndoToast
        message={undoTarget ? `"${undoTarget.name}" deleted` : null}
        onUndo={handleUndo}
        duration={UNDO_WINDOW_MS}
      />

      {/* Regular toast feedback (save/update/errors) */}
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