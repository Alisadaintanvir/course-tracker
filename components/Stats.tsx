"use client";

import { BookOpen, Target, Trophy } from "lucide-react";
import { Course } from "@/types/course";

interface StatsProps {
  courses: Course[];
  getProgress: (course: Course) => number;
}

export default function Stats({ courses, getProgress }: StatsProps) {
  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-3 rounded-xl">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active Courses
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {courses.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-3 rounded-xl">
              <Target className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {courses.length === 0 ? (
                  <span className="text-gray-400 dark:text-gray-500">-</span>
                ) : (
                  Math.round(
                    courses.reduce(
                      (acc, course) => acc + getProgress(course),
                      0
                    ) / courses.length
                  )
                )}
                {courses.length > 0 && "%"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-3 rounded-xl">
              <Trophy className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Completed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {courses.filter((course) => getProgress(course) === 100).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
