import { BookOpen } from "lucide-react";
import { Course } from "@/types/course-page";

interface CourseProgressProps {
  courseValue: <T>(accessor: (c: Course) => T, defaultValue: T) => T;
  getProgress: (course: Course) => number;
}

export default function CourseProgress({
  courseValue,
  getProgress,
}: CourseProgressProps) {
  return (
    <div className="mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-3 rounded-lg">
            <BookOpen className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Course Progress
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              Overall Progress
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              {courseValue((c) => getProgress(c), 0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${courseValue((c) => getProgress(c), 0)}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current Section
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {courseValue(
                  (c) => c.sections[c.currentSection]?.name,
                  "Not Started"
                )}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current Video
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {courseValue(
                  (c) =>
                    c.sections[c.currentSection]?.modules[c.currentVideo]?.name,
                  "Not Started"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
