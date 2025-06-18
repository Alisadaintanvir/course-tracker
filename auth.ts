// auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userService } from "./lib/userService";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await userService(
            credentials?.email as string,
            credentials?.password as string
          );
          if (!user) {
            throw new Error("Invalid email or password");
          }
          return user;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // If the user object exists (during sign in), add the user id to the token
      if (user) {
        token.id = user.id; // Assuming your user object has an 'id' property
      }
      return token;
    },
    async session({ session, token }) {
      // Add the user id to the session object
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
