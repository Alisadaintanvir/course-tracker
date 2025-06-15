import { Button } from "@/components/ui/button";
import { RocketIcon, ScanIcon } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center  overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-purple-500 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-indigo-600 blur-3xl animate-pulse delay-300"></div>
      </div>

      <div className="relative z-10 container px-4 mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Track. Learn.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
            Master.
          </span>
        </h1>

        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Organize your learning journey, track progress, and take notes - all
          in one place. Whether scanning course files or adding manually,
          we&apos;ve got you covered.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="gap-2 bg-white text-gray-900 hover:bg-gray-200 h-12 px-6">
            <RocketIcon className="w-5 h-5" />
            Get Started
          </Button>
          <Button
            variant="outline"
            className="gap-2  hover:bg-gray-800 h-12 px-6 text-indigo-600 dark:text-white"
          >
            <ScanIcon className="w-5 h-5" />
            Scan Courses
          </Button>
        </div>
      </div>

      {/* Floating mockup */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
        <div className="relative bg-gray-800 rounded-xl p-2 shadow-2xl border border-gray-700">
          <div className="absolute -top-3 left-4 w-3 h-3 rounded-full bg-red-500"></div>
          <div className="absolute -top-3 left-8 w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="absolute -top-3 left-12 w-3 h-3 rounded-full bg-green-500"></div>

          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
              </div>
              <div className="mx-auto text-sm text-gray-500">CourseTracker</div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
