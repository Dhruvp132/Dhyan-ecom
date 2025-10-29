import { prismaDB } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  const { productId, categoryId, newName } = await req.json(); // Assuming newName is the new name for the category

  // Validate input
  if (!productId || !categoryId) {
    return NextResponse.json(
      { message: "Product ID and category ID are required" },
      { status: 400 }
    );
  }
  if (!newName || newName.trim() === "") {
    return NextResponse.json(
      { message: "New name for the category cannot be empty" },
      { status: 400 }
    );
  }

  try {
    // Ensure the product exists
    const product = await prismaDB.product.findUnique({
      where: { id: productId },
      include: { categories: true }, // Include categories to find the one to update
    });
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Ensure the category exists within the product
    const categoryExists = product.categories.some((c) => c.id === categoryId);
    if (!categoryExists) {
      return NextResponse.json(
        { message: "Category not found under this product" },
        { status: 404 }
      );
    }

    // Update the category's name
    await prismaDB.category.update({
      where: { id: categoryId },
      data: { name: newName },
    });

    return NextResponse.json(
      { message: "Category name updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update category name:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the category name." },
      { status: 500 }
    );
  }
};
