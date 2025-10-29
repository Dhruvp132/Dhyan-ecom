import { prismaDB } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
  const { userId, productId } = await req.json();
  try {
    if (!userId || !productId) {
      return NextResponse.json({
        error: "User ID and Product ID are required",
        status: 400,
      });
    }

    const userExists = await prismaDB.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return NextResponse.json({ error: "User not found", status: 404 });
    }

    const productExists = await prismaDB.product.findUnique({
      where: { id: productId },
    });
    if (!productExists) {
      return NextResponse.json({ error: "Product not found", status: 404 });
    }

    const existingCartItem = await prismaDB.cart.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingCartItem) {
      await prismaDB.cart.delete({
        where: {
          id: existingCartItem.id,
        },
      });
      return NextResponse.json({
        message: "Product removed from cart",
        status: 200,
      });
    } else {
      return NextResponse.json({
        error: "Cart item does not exist",
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "Something went wrong while removing product from cart",
      status: 500,
    });
  }
};
