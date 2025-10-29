import { prismaDB } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const orders = await prismaDB.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                mainImage: true,
              },
            },
          },
        },
        address: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
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

export const POST = async (req: NextRequest) => {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { message: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const updatedOrder = await prismaDB.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ order: updatedOrder, status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { message: "Error updating order status" },
      { status: 500 }
    );
  }
};
