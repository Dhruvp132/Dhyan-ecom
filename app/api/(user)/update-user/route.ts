import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { prismaDB } from "@/db/db.config";
import { INVALID_PASSWORD_MESSAGE, isValidPassword } from "@/lib/auth-validation";

export const PATCH = async (req: NextRequest) => {
  try {
    const { userId, updateData } = await req.json();

    // Validate input
    if (!userId || !updateData) {
      return NextResponse.json(
        { message: "User ID and update data are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExists = await prismaDB.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Validate and update email
    if (updateData.email) {
      const emailTaken = await prismaDB.user.findUnique({
        where: { email: updateData.email },
      });
      if (emailTaken && emailTaken.id !== userId) {
        return NextResponse.json(
          { message: "Email already exists" },
          { status: 400 }
        );
      }
    }

    // Validate and hash password
    if (updateData.password) {
      const hasValidPassword = isValidPassword(updateData.password);
      if (!hasValidPassword) {
        return NextResponse.json(
          { message: INVALID_PASSWORD_MESSAGE },
          { status: 400 }
        );
      }
      updateData.password = await bcryptjs.hash(updateData.password, 10);
    }

    // Update user
    await prismaDB.user.update({ where: { id: userId }, data: updateData });
    return NextResponse.json(
      { message: "User updated successfully" },
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
