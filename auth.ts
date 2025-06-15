// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Import server-only dependencies inside the authorize function
        const { connectDB } = await import("./lib/mongodb");
        const { default: User } = await import("./schemas/User");
        const { comparePassword } = await import("./lib/auth");

        try {
          await connectDB();
          const existingUser = await User.findOne({ email: credentials.email });

          if (!existingUser) {
            console.log("No user found with that email.");
            return null;
          }

          const isPasswordValid = await comparePassword(
            credentials.password as string,
            existingUser.password
          );

          if (!isPasswordValid) {
            console.log("Password is not valid.");
            return null;
          }

          const userObj = existingUser.toObject();
          delete userObj.password;
          return userObj;
        } catch (error) {
          console.error("Authentication error:", error);
          // In production, you might want to throw a more generic error
          // For now, returning null is safe for the login flow.
          return null;
        }
      },
    }),
  ],
});
