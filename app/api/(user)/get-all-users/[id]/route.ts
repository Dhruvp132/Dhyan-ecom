import { prismaDB } from "@/db/db.config";
// import { client } from "@/lib/Redis";
import { NextResponse } from "next/server";

export const GET = async (_: any, { params }: { params: { id: string } }) => {
  try {
    // Redis temporarily disabled
    // const cachedUser = await client.get(`user:${params.id}`);
    // let user;

    // if (cachedUser) {
    //   user = JSON.parse(cachedUser);
    // } else {
    const user = await prismaDB.user.findUnique({
      where: {
        id: params?.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        orders: true,
      },
    });

    // if (user) {
    //   await client.setex(`user:${params.id}`, 30, JSON.stringify(user));
    // }
    // }

    if (!user) {
      return NextResponse.json({ message: "No User Found", status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
};
