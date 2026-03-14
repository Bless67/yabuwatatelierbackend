/**
 * Cloudinary image upload utility
 * 
 * Setup:
 * 1. Create .env.local with:
 *    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name
 * 
 * 2. Create unsigned upload preset in Cloudinary dashboard:
 *    - Go to Settings > Upload > Upload presets
 *    - Create new preset (unsigned)
 *    - Copy the preset name
 */

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  alt: string;
}

export const uploadToCloudinary = async (
  file: File
): Promise<CloudinaryUploadResult> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary credentials not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "atelier-products");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
      alt: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    // Note: Deletion requires authentication (cannot use unsigned presets)
    // This is handled server-side via API route
    const response = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete image from Cloudinary");
    }

    return await response.json();
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};
