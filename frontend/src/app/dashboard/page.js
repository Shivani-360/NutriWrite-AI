"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader, Toast } from "@/components/ui";
import RouteGuard from "@/components/RouteGuard";
import ProductModal from "@/components/ProductModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DashboardPage() {
  return (
    <RouteGuard>
      <DashboardContent />
    </RouteGuard>
  );
}

function DashboardContent() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state: null = closed, {} = create mode, {product} = edit mode
  const [modalProduct, setModalProduct] = useState(undefined); // undefined = closed
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = "success") => setToast({ message, type });

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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

  // --- DELETE ---
  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete product");
      }
      setDeleteTarget(null);
      await fetchProducts(search);
      showToast("Product deleted", "success");
    } catch (err) {
      showToast(err.message || "Failed to delete product", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your food products</p>
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
        <Loader text="Loading products..." />
      ) : error ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-red-500 dark:text-red-400 font-medium mb-2">{error}</p>
          <p className="text-sm text-gray-400">Start your backend: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">npm run dev</code> in the backend folder</p>
        </div>
      ) : products.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {search ? `No products match "${search}".` : "No products yet — add your first one."}
          </p>
          <button className="btn-primary" onClick={() => setModalProduct({})}>
            + Add your first product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {products.map((product) => (
            <div key={product._id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
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
                    onClick={() => setDeleteTarget(product)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                    aria-label="Delete product"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
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
            </div>
          ))}
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-6 text-center">
          {products.length} product{products.length !== 1 ? "s" : ""} found
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

      {/* Delete confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete this product?"
          message={`"${deleteTarget.name}" will be permanently removed.`}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {/* Toast feedback */}
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
