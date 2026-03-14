"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { FiPlus, FiPackage } from "react-icons/fi";
import ProductListItem from "./ProductListItem";

interface Product {
  id: number;
  name: string;
  description: string | null;
  markupPrice: number;
  salePrice: number;
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
  }>;
  createdAt: string;
}

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function ProductList({
  products,
  isLoading,
  onRefresh,
}: ProductListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm("Are you sure you want to delete this product?")) {
        return;
      }

      setDeletingId(id);
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete");
        onRefresh();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      } finally {
        setDeletingId(null);
      }
    },
    [onRefresh]
  );



  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 bg-white rounded-xl shadow-lg">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
          Products
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <span className="text-base md:text-lg text-[#1a4d3e] bg-[#f5f1e8] px-3 md:px-4 py-2 rounded-xl shadow-md font-semibold text-center">
            Total: {products.length}
          </span>
          <Link href="/admin/add-product">
            <button className="w-full bg-[#b8a876] hover:bg-[#a89860] text-[#1a4d3e] font-semibold px-4 py-2 rounded-xl transition flex items-center justify-center gap-2 shadow-lg">
              <FiPlus /> <span className="hidden sm:inline">Add Product</span>
            </button>
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 md:py-16 bg-white rounded-xl shadow-lg">
          <FiPackage size={48} className="mx-auto text-[#c5d5cf] mb-4" />
          <p className="text-[#1a4d3e] text-base md:text-lg mb-4">
            No products yet
          </p>
          <Link href="/admin/add-product">
            <button className="bg-[#b8a876] hover:bg-[#a89860] text-[#1a4d3e] font-semibold px-4 md:px-6 py-2 rounded-xl transition flex items-center justify-center gap-2 shadow-lg mx-auto">
              <FiPlus /> Create your first product
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              onDelete={() => handleDelete(product.id)}
              isDeleting={deletingId === product.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
