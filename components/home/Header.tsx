// components/landing/Header.tsx
"use client";
import { ArrowRight, BookOpen, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

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
          href="/#testimonials"
          className="hover:text-blue-300 transition-colors"
        >
          Testimonials
        </Link>
        <Link
          href="/dashboard"
          className="hover:text-blue-300 transition-colors"
        >
          Dashboard
        </Link>
      </nav>

      {session ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors shadow-lg flex items-center"
          >
            <User className="mr-2" size={16} />
            {session.user?.name || "Account"}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <LogOut size={14} className="mr-2" />
                  Logout
                </div>
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors shadow-lg flex items-center"
        >
          Login <ArrowRight className="ml-2" size={16} />
        </Link>
      )}
    </header>
  );
}
