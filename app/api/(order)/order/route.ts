import { prismaDB } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export const POST = async (req: NextRequest) => {
  try {
    const { userId, firstName, lastName, address, city, state, zip } =
      await req.json();

    const missingFields = [];

    if (!userId) missingFields.push("userId");
    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");
    if (!address) missingFields.push("address");
    if (!city) missingFields.push("city");
    if (!state) missingFields.push("state");
    if (!zip) missingFields.push("zip");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: `All fields are required. Missing: ${missingFields.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        {
          message: "Invalid user ID format. Please log out and log back in.",
        },
        { status: 400 }
      );
    }

    const userExists = await prismaDB.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 404 }
      );
    }

    const cartItems = await prismaDB.cart.findMany({
      where: { userId: userId },
      include: {
        product: {
          select: {
            price: true,
            name: true,
          }
        }
      }
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 404 });
    }

    // Create address
    const userAddress = await prismaDB.orderAddress.create({
      data: { firstName, lastName, address, city, state, zip, userId: userId },
    });

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Create single order with all items
    const order = await prismaDB.order.create({
      data: {
        orderNumber,
        totalAmount,
        usersId: userId,
        addressId: userAddress.id,
        status: "PENDING",
        paymentMethod: "Razorpay",
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            color: item.color,
            size: item.size,
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        address: true
      }
    });

    // Clear cart after order creation
    await prismaDB.cart.deleteMany({
      where: { userId: userId },
    });

    return NextResponse.json(
      { 
        message: "Order created successfully, cart cleared",
        order: order
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: error || "An error occurred" },
      { status: 500 }
    );
  }
};
