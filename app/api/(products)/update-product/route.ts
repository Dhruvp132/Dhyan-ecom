import { prismaDB } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { productId, updateData } = await req.json();

    // Validate input
    if (!productId || !updateData) {
      return NextResponse.json(
        { message: "Product ID and update data are required" },
        { status: 400 }
      );
    }

    if (updateData.name && updateData.name.trim() === "") {
      return NextResponse.json(
        { message: "Product name cannot be empty" },
        { status: 400 }
      );
    }
    if (updateData.price && updateData.price <= 0) {
      return NextResponse.json(
        { message: "Product price must be greater than 0" },
        { status: 400 }
      );
    }

    // Check if product exists
    const productExists = await prismaDB.product.findUnique({
      where: { id: productId },
    });
    if (!productExists) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Normalize arrays if provided (accept string or array)
    const toStringArray = (val: unknown): string[] => {
      if (Array.isArray(val)) {
        return val.map((v) => (typeof v === 'string' ? v.trim() : ''))
                 .filter(Boolean);
      }
      if (typeof val === 'string') {
        return val.split(/[\n,]+/)
                 .map((v) => v.trim())
                 .filter(Boolean);
      }
      return [];
    };

    if ('otherImages' in updateData) {
      updateData.otherImages = toStringArray(updateData.otherImages);
    }
    if ('sizes' in updateData) {
      updateData.sizes = toStringArray(updateData.sizes);
    }
    if ('colors' in updateData) {
      updateData.colors = toStringArray(updateData.colors);
    }
    if ('tags' in updateData) {
      updateData.tags = toStringArray(updateData.tags);
    }

    // Update product
    const updatedProduct = await prismaDB.product.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
};
