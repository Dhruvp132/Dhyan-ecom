import { prismaDB } from "@/db/db.config";
// import { client } from "@/lib/Redis";
import { NextResponse } from "next/server";

export const GET = async (_: any) => {
  try {
    // Redis temporarily disabled
    // const cachedUsers = await client.get("users");
    // let Users;

    // if (cachedUsers) {
    //   Users = JSON.parse(cachedUsers);
    // } else {
    const Users = await prismaDB.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // if (Users && Users.length > 0) {
    //   await client.setex("users", 300, JSON.stringify(Users));
    // }
    // }

    if (Users.length === 0) {
      return NextResponse.json({ message: "No Users Found", status: 404 });
    }

    return NextResponse.json(Users, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
};
