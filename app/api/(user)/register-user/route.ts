import { prismaDB } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        message: "Invalid email format",
        status: 400,
      });
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({
        message:
          "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character",
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
