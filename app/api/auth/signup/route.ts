import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { registrationSchema } from "@/utils/zod";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(Request: Request) {
  const body = await Request.json();
  const result = registrationSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return {
      success: false,
      errors,
    };
  }

  const { name, email, password } = result.data;

  try {
    await connectDB();
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 409 }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });
    await newUser.save();
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during signup",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "User created successfully." },
    { status: 201 }
  );
}
