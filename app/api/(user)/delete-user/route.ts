import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { prismaDB } from "@/db/db.config";

export const DELETE = async (req: NextRequest) => {
  try {
    const { userId, password } = await req.json();

    // Validate input
    if (!userId || !password) {
      return NextResponse.json(
        { message: "User ID and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prismaDB.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // Delete user and related data
    await deleteUserAndRelatedData(userId);

    return NextResponse.json(
      { message: "User and related data deleted successfully" },
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

// Function to delete user and related data
async function deleteUserAndRelatedData(userId: string) {
  // Fetch products to identify related categories
  const products = await prismaDB.product.findMany({
    where: { userId: userId },
    include: { categories: true },
  });

  // Delete categories related to each product
  for (const product of products) {
    await prismaDB.category.deleteMany({
      where: { productId: product.id },
    });
  }

  // Delete the products now that their categories are deleted
  await prismaDB.product.deleteMany({
    where: { userId: userId },
  });

  // Finally, delete the user
  await prismaDB.user.delete({
    where: { id: userId },
  });
}
