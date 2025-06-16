import { BookOpen, Clock, History } from "lucide-react";
import { Course } from "@/types/course-page";

interface CourseInfoCardsProps {
  courseValue: <T>(accessor: (c: Course) => T, defaultValue: T) => T;
  onShowHistory: () => void;
}

export default function CourseInfoCards({
  courseValue,
  onShowHistory,
}: CourseInfoCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
            <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {courseValue((c) => c.category, "")}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
            <Clock className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last Accessed
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {courseValue(
                (c) => new Date(c.lastAccessed).toLocaleDateString(),
                ""
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-lg ${
              courseValue((c) => c.isCompleted, false)
                ? "bg-green-100 dark:bg-green-900"
                : "bg-indigo-100 dark:bg-indigo-900"
            }`}
          >
            <History
              className={
                courseValue((c) => c.isCompleted, false)
                  ? "text-green-600 dark:text-green-400"
                  : "text-indigo-600 dark:text-indigo-400"
              }
              size={24}
            />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {courseValue((c) => c.isCompleted, false)
                ? "Completion Status"
                : "Completed Modules"}
            </p>
            {courseValue((c) => c.isCompleted, false) ? (
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                Completed
              </p>
            ) : (
              <button
                onClick={onShowHistory}
                className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                {courseValue((c) => c.completionHistory?.length || 0, 0)}{" "}
                modules
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
