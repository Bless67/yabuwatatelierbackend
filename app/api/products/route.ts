import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
    const { name, description, markupPrice, salePrice, images } = body;

    if (!name || markupPrice === undefined || salePrice === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        markupPrice: parseFloat(markupPrice),
        salePrice: parseFloat(salePrice),
        images: {
          create: images?.map((img: any) => ({
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

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
