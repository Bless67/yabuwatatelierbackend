"use client";

import { useState, useRef } from "react";
import { FiUpload, FiX, FiCheck } from "react-icons/fi";
import { toast } from "sonner";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface ProductFormData {
  name: string;
  description: string;
  featured: boolean;
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
      featured: false,
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
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const loadingToast = toast.loading(`Uploading ${files.length} image(s)...`);
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

      toast.dismiss(loadingToast);
      toast.success("Images uploaded successfully! ✨", {
        description: `${uploadedImages.length} image(s) added to your product`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to upload images", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    const removedImage = formData.images[index];
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast.info("Image removed", {
      description: "The image has been removed from your product",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Product name is required", {
        description: "Please enter a product name to continue",
      });
      return;
    }

    if (formData.images.length === 0) {
      toast.error("At least one image is required", {
        description: "Please upload at least one product image",
      });
      return;
    }

    await onSubmit(formData);
  };

  return (
    <Card className="bg-white border-[#c5d5cf]">
      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        {/* Product Name */}
        <div className="mb-6">
          <Label htmlFor="name" className="text-[#1a4d3e] font-semibold">
            Product Name *
          </Label>
          <Input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            className="mt-2 border-[#c5d5cf] focus:ring-[#b8a876]"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <Label htmlFor="description" className="text-[#1a4d3e] font-semibold">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            rows={4}
            className="mt-2 border-[#c5d5cf] focus:ring-[#b8a876]"
          />
        </div>

        {/* Featured Toggle */}
        <div className="mb-6 flex items-center gap-3 p-4 bg-[#f5f1e8] rounded-lg border border-[#c5d5cf]">
          <input
            id="featured"
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
            className="w-5 h-5 cursor-pointer"
          />
          <div className="flex flex-col flex-1">
            <Label htmlFor="featured" className="text-[#1a4d3e] font-semibold cursor-pointer">
              Featured Product
            </Label>
            <p className="text-sm text-[#2d5a52] mt-1">
              When enabled, this product will be featured on the home page for all users to see.
            </p>
          </div>
        </div>

        {/* Images */}
        <div className="mb-6">
          <Label className="text-[#1a4d3e] font-semibold mb-3 block">
            Product Images
          </Label>

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
            <p className="text-[#a89860] text-sm">PNG, JPG, GIF up to 10MB</p>
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
                  <div className="relative w-full h-32 bg-[#f5f1e8] rounded-lg overflow-hidden">
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
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition shadow-lg"
                    title="Remove image"
                  >
                    <FiX size={16} />
                  </button>
                  {/* Mobile label */}
                  <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 flex items-center justify-between">
                    <span className="text-white text-xs font-medium">#{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || isUploading}
          className="w-full bg-gradient-to-r from-[#1a4d3e] to-[#2d5a52] hover:from-[#2d5a52] hover:to-[#3d6b62] text-[#E8E4D9] font-semibold py-3 h-auto disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading || isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              {isUploading ? "Uploading images..." : "Creating..."}
            </>
          ) : (
            <>
              <FiCheck size={20} />
              Create Product
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
