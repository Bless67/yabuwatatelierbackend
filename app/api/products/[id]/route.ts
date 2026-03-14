import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, markupPrice, salePrice, images } = body;

    // Update product
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: name || undefined,
        description: description ?? undefined,
        markupPrice: markupPrice !== undefined ? parseFloat(markupPrice) : undefined,
        salePrice: salePrice !== undefined ? parseFloat(salePrice) : undefined,
      },
      include: { images: true },
    });

    // If new images provided, replace them
    if (images && Array.isArray(images)) {
      // Delete old images
      await prisma.productImage.deleteMany({
        where: { productId: parseInt(id) },
      });

      // Create new images
      await prisma.productImage.createMany({
        data: images.map((img: any) => ({
          productId: parseInt(id),
          url: img.url,
          publicId: img.publicId,
          alt: img.alt || null,
        })),
      });
    }

    // Fetch updated product with images
    const updatedProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { images: true },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
