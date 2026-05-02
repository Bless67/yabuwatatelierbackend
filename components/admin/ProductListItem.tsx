"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiImage } from "react-icons/fi";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import QRCodeDisplay from "@/components/ui/qr-code-display";

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
}

interface ProductListItemProps {
  product: Product;
  onDelete: () => void;
  isDeleting: boolean;
}

export default function ProductListItem({
  product,
  onDelete,
  isDeleting,
}: ProductListItemProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const imageUrl = product.images[0]?.url || "";

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-[#c5d5cf]/50 bg-white flex flex-col h-full">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        {product.featured && (
          <Badge className="absolute top-3 left-3 z-10 bg-green-500 text-white font-bold border-none">
            ⭐ FEATURED
          </Badge>
        )}

        {product.images.length > 1 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((img) => (
                <CarouselItem key={img.id}>
                  <AspectRatio ratio={1} className="bg-[#f5f1e8]">
                    <Image
                      src={img.url}
                      alt={img.alt || product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Subtle arrows that appear on hover */}
            <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 border-none" />
            <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 border-none" />
          </Carousel>
        ) : (
          <AspectRatio ratio={1} className="bg-[#f5f1e8]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.images[0]?.alt || product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#c5d5cf] gap-2">
                <FiImage size={40} strokeWidth={1} />
                <span className="text-xs uppercase tracking-widest">No Image</span>
              </div>
            )}
          </AspectRatio>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-serif font-bold text-[#1a4d3e] leading-tight line-clamp-1">
            {product.name}
          </h3>
        </div>

        <p className="text-sm text-[#2d5a52]/70 line-clamp-2 mb-4 h-10">
          {product.description || "No description provided for this artisan piece."}
        </p>
      </CardContent>

      {/* Actions Section */}
      <CardFooter className="flex gap-2 p-5 pt-0">
        <Link href={`/edit-product/${product.id}`} className="flex-1">
          <Button
            variant="outline"
            className="w-full border-[#1a4d3e] text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-[#E8E4D9] transition-colors"
          >
            <FiEdit2 size={14} className="mr-2" />
            Edit
          </Button>
        </Link>

        <QRCodeDisplay
          qrCode={product.qrCode}
          productName={product.name}
          productId={product.id}
        />

        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiTrash2 size={18} />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#fcfcfb]">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-serif text-[#1a4d3e] text-xl">Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription className="text-[#2d5a52]">
                This will permanently remove <span className="font-bold">&quot;{product.name}&quot;</span> from the atelier collection.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <AlertDialogCancel className="border-[#c5d5cf]">Keep Product</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  onDelete();
                  setOpenDialog(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Forever
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}