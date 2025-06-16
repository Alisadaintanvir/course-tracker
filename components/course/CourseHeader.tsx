import { ChevronLeft, CheckCircle2, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { Course } from "@/types/course-page";

interface CourseHeaderProps {
  course: Course | null;
  courseValue: <T>(accessor: (c: Course) => T, defaultValue: T) => T;
  onToggleCompletion: (courseId: string) => void;
  onReset: () => void;
  onDelete: () => void;
}

export default function CourseHeader({
  course,
  courseValue,
  onToggleCompletion,
  onReset,
  onDelete,
}: CourseHeaderProps) {
  return (
    <div className="mb-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
      >
        <ChevronLeft size={20} />
        Back to Courses
      </Link>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {courseValue((c) => c.title, "")}
            </h1>
            {course && (
              <button
                onClick={() => onToggleCompletion(course.id)}
                className={`p-2 rounded-full transition-colors ${
                  courseValue((c) => c.isCompleted, false)
                    ? "text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
                    : "text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                }`}
                title={
                  courseValue((c) => c.isCompleted, false)
                    ? "Mark as incomplete"
                    : "Mark as complete"
                }
              >
                <CheckCircle2 size={24} />
              </button>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {courseValue((c) => c.description, "")}
          </p>
          {courseValue((c) => c.isCompleted && !!c.completedAt, false) && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Completed on{" "}
              {courseValue(
                (c) =>
                  c.completedAt
                    ? new Date(c.completedAt).toLocaleDateString()
                    : "",
                ""
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800"
            title="Reset course progress"
          >
            <RotateCcw size={18} />
            <span className="text-sm font-medium">Reset Progress</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800"
            title="Delete course"
          >
            <Trash2 size={18} />
            <span className="text-sm font-medium">Delete Course</span>
          </button>
        </div>
      </div>
    </div>
  );
}
