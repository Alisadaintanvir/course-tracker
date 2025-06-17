import { User } from "@/schemas/User";
import { comparePassword } from "./auth";
import { connectDB } from "./mongodb";

export const userService = async (email: string, password: string) => {
  try {
    await connectDB();
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return null;
    }

    const isPasswordValid = await comparePassword(
      password as string,
      existingUser.password
    );

    if (!isPasswordValid) {
      return null;
    }

    // Return user without password
    const userObj = existingUser.toObject();
    delete userObj.password;
    return userObj;
  } catch (err) {
    console.error("Error in userService:", err);
    throw new Error("An error occurred while processing your request.");
  }
};
