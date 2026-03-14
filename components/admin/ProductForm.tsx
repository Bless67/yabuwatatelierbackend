"use client";

import { useState, useRef } from "react";
import { FiUpload, FiX, FiCheck } from "react-icons/fi";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface ProductFormData {
  name: string;
  description: string;
  markupPrice: number;
  salePrice: number;
  images: Array<{
    url: string;
    publicId: string;
    alt: string;
  }>;
}

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void> | void;
  isLoading?: boolean;
  initialData?: ProductFormData;
}

export default function ProductForm({
  onSubmit,
  isLoading = false,
  initialData,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: "",
      description: "",
      markupPrice: 0,
      salePrice: 0,
      images: [],
    }
  );

  const [imagePreview, setImagePreview] = useState<string[]>(
    initialData?.images.map((img) => img.url) || []
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "markupPrice" || name === "salePrice"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadToCloudinary(file)
      );

      const uploadedImages = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));

      setImagePreview((prev) => [
        ...prev,
        ...uploadedImages.map((img) => img.url),
      ]);
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload images to Cloudinary"
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.markupPrice || !formData.salePrice) {
      alert("Please fill in all required fields");
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-6 md:p-8"
    >
      {/* Product Name */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#1a4d3e] mb-2">
          Product Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter product name"
          className="w-full px-4 py-2 border border-[#c5d5cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8a876]"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#1a4d3e] mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter product description"
          rows={4}
          className="w-full px-4 py-2 border border-[#c5d5cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8a876]"
        />
      </div>

      {/* Prices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-[#1a4d3e] mb-2">
            Markup Price (₦) *
          </label>
          <input
            type="number"
            name="markupPrice"
            value={formData.markupPrice}
            onChange={handleInputChange}
            placeholder="Enter markup price"
            className="w-full px-4 py-2 border border-[#c5d5cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8a876]"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#1a4d3e] mb-2">
            Sale Price (₦) *
          </label>
          <input
            type="number"
            name="salePrice"
            value={formData.salePrice}
            onChange={handleInputChange}
            placeholder="Enter sale price"
            className="w-full px-4 py-2 border border-[#c5d5cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8a876]"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Images */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#1a4d3e] mb-2">
          Product Images
        </label>

        {/* Upload Area */}
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            isUploading
              ? "border-[#b8a876] bg-[#f5f1e8]"
              : "border-[#c5d5cf] hover:border-[#b8a876]"
          }`}
        >
          <FiUpload className="mx-auto text-[#c5d5cf] text-3xl mb-2" />
          <p className="text-[#1a4d3e]">
            {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
          </p>
          <p className="text-[#a89860] text-sm">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUploading}
          className="hidden"
        />

        {/* Image Preview */}
        {imagePreview.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {imagePreview.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={preview}
                    alt={`Preview ${index}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || isUploading}
        className="w-full bg-gradient-to-r from-[#1a4d3e] to-[#2d5a52] hover:from-[#2d5a52] hover:to-[#3d6b62] text-[#E8E4D9] font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading || isUploading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {isUploading ? "Uploading images..." : "Creating..."}
          </>
        ) : (
          <>
            <FiCheck size={20} />
            Create Product
          </>
        )}
      </button>
    </form>
  );
}
