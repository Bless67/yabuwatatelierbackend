"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ProductForm from "@/components/admin/ProductForm";

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    const loadingToast = toast.loading("Creating product...");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create product");
      }

      const data = await response.json();

      toast.dismiss(loadingToast);
      toast.success(`${data.name} created successfully! 🎉`, {
        description: "Redirecting to products list...",
      });

      setTimeout(() => {
        router.push("/?tab=products");
      }, 1500);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to create product", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1a4d3e] mb-8">Add New Product</h1>
        <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
