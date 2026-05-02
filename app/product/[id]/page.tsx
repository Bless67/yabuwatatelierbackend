"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiImage, FiArrowLeft, FiShoppingCart } from "react-icons/fi";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  featured: boolean;
  images: ProductImage[];
  qrCode?: string | null;
  createdAt: string;
}

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1a4d3e] border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <FiImage size={48} className="mx-auto text-[#c5d5cf] mb-4" />
          <p className="text-xl font-semibold text-[#1a4d3e]">{error || "Product not found"}</p>
          <p className="text-[#2d5a52] mt-2">Sorry, we couldn&apos;t find the product you&apos;re looking for.</p>
        </div>
        <Button
          onClick={() => window.history.back()}
          className="mt-4 bg-[#b8a876] hover:bg-[#a89860] text-[#1a4d3e]"
        >
          <FiArrowLeft className="mr-2" size={18} />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8] p-4 md:p-8">
      <Button
        onClick={() => window.history.back()}
        variant="ghost"
        className="mb-6 text-[#1a4d3e] hover:bg-white/50"
      >
        <FiArrowLeft className="mr-2" size={18} />
        Back
      </Button>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-white overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Images Section */}
            <div>
              {product.images.length > 1 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {product.images.map((img) => (
                      <CarouselItem key={img.id}>
                        <AspectRatio ratio={1} className="bg-[#f5f1e8] rounded-lg overflow-hidden">
                          <Image
                            src={img.url}
                            alt={img.alt || product.name}
                            fill
                            className="object-cover"
                            priority
                          />
                        </AspectRatio>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 bg-white/80 border-none" />
                  <CarouselNext className="right-2 bg-white/80 border-none" />
                </Carousel>
              ) : (
                <AspectRatio ratio={1} className="bg-[#f5f1e8] rounded-lg overflow-hidden">
                  {product.images[0]?.url ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-[#c5d5cf] gap-2">
                      <FiImage size={48} strokeWidth={1} />
                      <span className="text-sm uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                </AspectRatio>
              )}
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-serif font-bold text-[#1a4d3e] mb-4">
                  {product.name}
                </h1>

                <p className="text-[#2d5a52] text-lg mb-6 leading-relaxed">
                  {product.description || "A beautiful artisan piece."}
                </p>

                {/* Product Info */}
                <div className="bg-white border border-[#c5d5cf] rounded-lg p-4 mb-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#2d5a52]">Product ID:</span>
                    <span className="font-semibold text-[#1a4d3e]">#{product.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#2d5a52]">Added:</span>
                    <span className="font-semibold text-[#1a4d3e]">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-[#1a4d3e] hover:bg-[#2d5a52] text-white py-3 h-auto font-semibold">
                  <FiShoppingCart className="mr-2" size={18} />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-[#1a4d3e] text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white py-3 h-auto font-semibold"
                  onClick={() => window.print()}
                >
                  Print
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Info */}
        <Card className="bg-white mt-8 p-6 md:p-10">
          <h2 className="text-2xl font-serif font-bold text-[#1a4d3e] mb-4">
            About This Piece
          </h2>
          <p className="text-[#2d5a52] leading-relaxed">
            This is an exclusive artisan piece from our carefully curated collection. Each item is selected for its unique craftsmanship and quality. If you have any questions about this product, please don&apos;t hesitate to contact our team.
          </p>
        </Card>
      </div>
    </div>
  );
}
