import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import { CourseProvider } from "../context/CourseContext";
import { ToastContainer } from "react-toastify";
import { ThemeScript } from "@/components/ThemeScript";
import { AuthProvider } from "@/components/AuthProvider";
import { connectDB } from "@/lib/mongodb";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Course Pilot",
  description: "Track your learning progress across all courses",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectDB();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:bg-gradient-to-br dark:from-indigo-900 dark:via-purple-900 dark:to-gray-900`}
      >
        <AuthProvider>
          <CourseProvider>
            <ThemeProvider>
              <ToastContainer position="top-right" autoClose={3000} />
              <div className="relative">
                {children}
                <div className="fixed bottom-6 right-6 z-50">
                  <ThemeToggle />
                </div>
              </div>
            </ThemeProvider>
          </CourseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
