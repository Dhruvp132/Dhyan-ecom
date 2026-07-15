import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { prismaDB } from "@/db/db.config";
import { getToken } from "next-auth/jwt";
import {
  INVALID_PASSWORD_MESSAGE,
  isValidEmail,
  isValidPassword,
} from "@/lib/auth-validation";

const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

type UpdateData = {
  name?: string;
  email?: string;
  phone?: string | null;
  avatarUrl?: string | null;
  password?: string;
};

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    const sessionUser = session?.user as { id?: string; isAdmin?: boolean } | undefined;
    if (!sessionUser?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId, updateData } = (await req.json()) as {
      userId?: string;
      updateData?: UpdateData;
    };

    // Validate input
    if (!userId || !updateData) {
      return NextResponse.json(
        { message: "User ID and update data are required" },
        { status: 400 }
      );
    }

    if (sessionUser.id !== userId && !sessionUser.isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Check if user exists
    const userExists = await prismaDB.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const safeUpdateData: UpdateData = {};

    if (typeof updateData.name === "string") {
      const trimmedName = updateData.name.trim();
      if (!trimmedName) {
        return NextResponse.json(
          { message: "Name cannot be empty" },
          { status: 400 }
        );
      }
      safeUpdateData.name = trimmedName;
    }

    // Validate and update email
    if (updateData.email) {
      const email = updateData.email.trim().toLowerCase();
      if (!isValidEmail(email)) {
        return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
      }

      const emailTaken = await prismaDB.user.findUnique({
        where: { email },
      });
      if (emailTaken && emailTaken.id !== userId) {
        return NextResponse.json(
          { message: "Email already exists" },
          { status: 400 }
        );
      }

      safeUpdateData.email = email;
    }

    if (Object.prototype.hasOwnProperty.call(updateData, "phone")) {
      if (updateData.phone === null || updateData.phone === "") {
        safeUpdateData.phone = null;
      } else if (typeof updateData.phone === "string") {
        const normalizedPhone = updateData.phone.trim();
        if (!PHONE_REGEX.test(normalizedPhone)) {
          return NextResponse.json(
            { message: "Phone number must be 7-15 digits and may start with +" },
            { status: 400 }
          );
        }
        safeUpdateData.phone = normalizedPhone;
      }
    }

    if (Object.prototype.hasOwnProperty.call(updateData, "avatarUrl")) {
      if (updateData.avatarUrl === null || updateData.avatarUrl === "") {
        safeUpdateData.avatarUrl = null;
      } else if (typeof updateData.avatarUrl === "string") {
        try {
          const parsed = new URL(updateData.avatarUrl);
          safeUpdateData.avatarUrl = parsed.toString();
        } catch {
          return NextResponse.json(
            { message: "Avatar URL is invalid" },
            { status: 400 }
          );
        }
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
      safeUpdateData.password = await bcryptjs.hash(updateData.password, 10);
    }

    if (Object.keys(safeUpdateData).length === 0) {
      return NextResponse.json(
        { message: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    // Update user
    await prismaDB.user.update({ where: { id: userId }, data: safeUpdateData });
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
