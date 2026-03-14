"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

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
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Failed to load product");
        router.push("/admin?tab=products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  const handleSubmit = async (formData: {
    name: string;
    description: string;
    markupPrice: number;
    salePrice: number;
    images: Array<{
      url: string;
      publicId: string;
      alt: string;
    }>;
  }) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update product");
      }

      router.push("/admin?tab=products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update product"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1a4d3e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1a4d3e] mb-8">Edit Product</h1>
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={isSaving}
          initialData={{
            name: product.name,
            description: product.description || "",
            markupPrice: product.markupPrice,
            salePrice: product.salePrice,
            images: product.images.map((img) => ({
              url: img.url,
              publicId: img.id,
              alt: img.alt || "",
            })),
          }}
        />
      </div>
    </div>
  );
}
