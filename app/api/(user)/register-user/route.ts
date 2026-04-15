import { prismaDB } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { INVALID_PASSWORD_MESSAGE, isValidEmail, isValidPassword } from "@/lib/auth-validation";

export const POST = async (req: NextRequest) => {
  const { name, email, password } = await req.json();
  try {
    // Validate input fields
    if (
      [name, email, password].some(
        (field) => field === undefined || String(field).trim() === ""
      )
    ) {
      return NextResponse.json({
        message: "Please fill all the fields",
        status: 400,
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json({
        message: "Invalid email format",
        status: 400,
      });
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return NextResponse.json({
        message: INVALID_PASSWORD_MESSAGE,
        status: 400,
      });
    }

    // Check if user already exists
    const userEmail = await prismaDB.user.findUnique({ where: { email } });
    if (userEmail) {
      return NextResponse.json({ message: "User already exists", status: 400 });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    await prismaDB.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "User created successfully",
      status: 201,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Something went wrong", status: 500 });
  }
};
