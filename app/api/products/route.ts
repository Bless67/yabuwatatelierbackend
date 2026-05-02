import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateQRCode } from "@/lib/qrcode";

interface ProductImage {
  url: string;
  publicId: string;
  alt?: string | null;
}

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, featured, images } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // First create the product
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        featured: featured || false,
        images: {
          create: images?.map((img: ProductImage) => ({
            url: img.url,
            publicId: img.publicId,
            alt: img.alt || null,
          })) || [],
        },
      },
      include: {
        images: true,
      },
    });

    // Generate QR code for the product
    try {
      const qrCode = await generateQRCode(product.id);

      // Update product with QR code
      const updatedProduct = await prisma.product.update({
        where: { id: product.id },
        data: { qrCode },
        include: {
          images: true,
        },
      });

      return NextResponse.json(updatedProduct, { status: 201 });
    } catch (qrError) {
      console.error("Error generating QR code:", qrError);
      // Return product without QR code rather than failing completely
      return NextResponse.json(product, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
