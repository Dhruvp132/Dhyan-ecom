import { prismaDB } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
  try {
    const { productId } = await req.json();

    // Validate input
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prismaDB.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Delete product and related data
    await deleteProductAndRelatedData(productId);

    return NextResponse.json(
      { message: "Product and related data deleted successfully" },
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

// Function to delete product and related data
async function deleteProductAndRelatedData(productId: string) {
  // Fetch categories related to the product
  const categories = await prismaDB.category.findMany({
    where: { productId: productId },
  });

  // Delete categories related to the product
  for (const category of categories) {
    await prismaDB.category.delete({
      where: { id: category.id },
    });
  }

  // Delete the product
  await prismaDB.product.delete({
    where: { id: productId },
  });
}
