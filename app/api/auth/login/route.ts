import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/schemas/User";
import { comparePassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return NextResponse.json(
        { error: "No user found with that email" },
        { status: 401 }
      );
    }

    const isPasswordValid = await comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const userObj = existingUser.toObject();
    userObj.id = existingUser._id.toString();
    delete userObj.password;

    return NextResponse.json(userObj);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
