import { prismaDB } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export const POST = async (req: NextRequest) => {
  const { userId } = await req.json();

  try {
    if (!userId) {
      return NextResponse.json({ error: "User ID is required", status: 400 });
    }

    // Validate ObjectId format
    if (!isValidObjectId(userId)) {
      console.error("Invalid userId format:", userId);
      return NextResponse.json({ 
        error: "Invalid user ID format. Please log out and log back in.", 
        status: 400 
      });
    }

    const userExists = await prismaDB.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userExists) {
      return NextResponse.json({ error: "User not found", status: 404 });
    }

    const cartItems = await prismaDB.cart.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: {
          select: {
            name: true,
            mainImage: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json({ data: cartItems, status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "Something went wrong while fetching cart items",
      status: 500,
    });
  }
};
