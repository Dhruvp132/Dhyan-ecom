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
      return NextResponse.json(
        { message: "User id is required" },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID format. Please log out and log back in." },
        { status: 400 }
      );
    }

    const orders = await prismaDB.order.findMany({
      where: {
        usersId: userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                mainImage: true,
              },
            },
          },
        },
        address: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json({ orders, status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
};
