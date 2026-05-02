"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import ProductForm from "@/components/admin/ProductForm";

interface Product {
  id: number;
  name: string;
  description: string | null;
  featured: boolean;
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
        toast.error("Failed to load product", {
          description: "Redirecting back to products list...",
        });
        setTimeout(() => {
          router.push("/?tab=products");
        }, 1500);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  const handleSubmit = async (formData: {
    name: string;
    description: string;
    featured: boolean;
    images: Array<{
      url: string;
      publicId: string;
      alt: string;
    }>;
  }) => {
    setIsSaving(true);
    const loadingToast = toast.loading("Updating product...");

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

      const data = await response.json();

      toast.dismiss(loadingToast);
      toast.success(`${data.name} updated successfully! ✨`, {
        description: "Redirecting to products list...",
      });

      setTimeout(() => {
        router.push("/?tab=products");
      }, 1500);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to update product", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#1a4d3e] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#1a4d3e] font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center">
        <p className="text-[#1a4d3e] text-lg font-semibold">Product not found</p>
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
            featured: product.featured,
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
