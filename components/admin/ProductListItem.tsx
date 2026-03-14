"use client";

import Image from "next/image";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiImage } from "react-icons/fi";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  markupPrice: number;
  salePrice: number;
  images: ProductImage[];
}

interface ProductListItemProps {
  product: Product;
  onDelete: () => void;
  isDeleting: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function ProductListItem({
  product,
  onDelete,
  isDeleting,
}: ProductListItemProps) {
  const imageUrl = product.images[0]?.url || "";

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.images[0]?.alt || product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <FiImage size={32} className="text-gray-400" />
          </div>
        )}
        {product.images.length > 1 && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
            +{product.images.length - 1}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.description || "No description"}
        </p>

        {/* Prices */}
        <div className="mb-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Markup Price</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(product.markupPrice)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Sale Price</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(product.salePrice)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/admin/edit-product/${product.id}`} className="flex-1">
            <button className="w-full bg-[#1a4d3e] hover:bg-[#2d5a52] text-[#E8E4D9] py-2 rounded-lg flex items-center justify-center gap-2 transition font-medium">
              <FiEdit2 size={16} />
              Edit
            </button>
          </Link>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="flex-1 bg-[#c5372e] hover:bg-[#a82820] text-white py-2 rounded-lg flex items-center justify-center gap-2 transition font-medium disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
