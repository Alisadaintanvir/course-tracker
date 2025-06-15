// components/landing/Header.tsx
"use client";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 border-b border-white/10 backdrop-blur-md">
      <div className="flex items-center space-x-2">
        <BookOpen className="text-blue-400" size={28} />
        <h1 className="text-xl font-bold">CoursePilot</h1>
      </div>
      <nav className="hidden md:flex items-center space-x-6">
        <Link
          href="#features"
          className="hover:text-blue-300 transition-colors"
        >
          Features
        </Link>
        <Link
          href="#how-it-works"
          className="hover:text-blue-300 transition-colors"
        >
          How It Works
        </Link>
        <Link
          href="#testimonials"
          className="hover:text-blue-300 transition-colors"
        >
          Testimonials
        </Link>
      </nav>
      <Link
        href="/login"
        className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors shadow-lg flex items-center"
      >
        Login <ArrowRight className="ml-2" size={16} />
      </Link>
    </header>
  );
}
