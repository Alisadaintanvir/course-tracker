import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import { CourseProvider } from "../context/CourseContext";
import { ToastContainer } from "react-toastify";
import { ThemeScript } from "@/components/ThemeScript";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Course Tracker",
  description: "Track your learning progress across all courses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-slate-950 dark:via-purple-900/40 dark:to-indigo-900/40`}
      >
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
      </body>
    </html>
  );
}
