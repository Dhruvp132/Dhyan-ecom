import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { getToken } from "next-auth/jwt";
import { prismaDB } from "@/db/db.config";
import { INVALID_PASSWORD_MESSAGE, isValidPassword } from "@/lib/auth-validation";

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = (await req.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current and new password are required" },
        { status: 400 }
      );
    }

    if (!isValidPassword(newPassword)) {
      return NextResponse.json(
        { message: INVALID_PASSWORD_MESSAGE },
        { status: 400 }
      );
    }

    const user = await prismaDB.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json(
        { message: "Password login is not enabled for this account" },
        { status: 400 }
      );
    }

    const isCurrentPasswordValid = await bcryptjs.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await prismaDB.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Password updated successfully" },
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