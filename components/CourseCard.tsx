"use client";

import {
  BookOpen,
  Clock,
  StickyNote,
  Trash2,
  Star,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Course } from "@/types/course";
import ModuleControls from "./ModuleControls";
import { useEffect } from "react";

interface CourseCardProps {
  course: Course;
  getProgress: (course: Course) => number;
  getTimeAgo: (date: Date) => string;
  onDelete: (course: Course) => void;
  onNotesClick: (course: Course) => void;
  onSectionChange: (courseId: string, newSection: number) => void;
  onVideoChange: (courseId: string, newVideo: number) => void;
  onToggleActive: (courseId: string) => void;
}

export default function CourseCard({
  course,
  getProgress,
  getTimeAgo,
  onDelete,
  onNotesClick,
  onSectionChange,
  onVideoChange,
  onToggleActive,
}: CourseCardProps) {
  // Effect to automatically set isActive to false when course is completed
  useEffect(() => {
    if (course.isCompleted && course.isActive) {
      onToggleActive(course.id);
    }
  }, [course.isCompleted, course.isActive, course.id, onToggleActive]);
  return (
    <div
      className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border w-full overflow-hidden ${
        course.isCompleted
          ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20"
          : "border-gray-100 dark:border-gray-700"
      } transform hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link href={`/course/${course.id}`} className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl flex-shrink-0 ${
                course.isCompleted
                  ? "bg-gradient-to-br from-green-500 to-emerald-500"
                  : "bg-gradient-to-br from-pink-500 to-rose-500"
              }`}
            >
              {course.isCompleted ? (
                <CheckCircle2 className="text-white" size={24} />
              ) : (
                <BookOpen className="text-white" size={24} />
              )}
            </div>{" "}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-1 break-words"
                  title={course.title}
                >
                  {course.title}
                </h3>
                {course.isCompleted && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full whitespace-nowrap">
                    Completed
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-full">
                {course.category}
              </p>
            </div>
          </div>{" "}
        </Link>
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="w-8 h-8 flex items-center justify-center">
            {!course.isCompleted && (
              <button
                onClick={() => onToggleActive(course.id)}
                className={`p-1 rounded-lg transition-colors ${
                  course.isActive
                    ? "text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300"
                    : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                }`}
                title={course.isActive ? "Mark as inactive" : "Mark as active"}
              >
                <Star
                  size={20}
                  className={course.isActive ? "fill-current" : ""}
                />
              </button>
            )}{" "}
          </div>
          <button
            onClick={() => onDelete(course)}
            className="p-1 text-gray-400 hover:text-rose-600 dark:text-gray-500 dark:hover:text-rose-400 transition-colors"
            title="Delete Course"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <Link href={`/course/${course.id}`}>
        <div className="mt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Clock size={16} />
            <span>Last accessed: {getTimeAgo(course.lastAccessed)}</span>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-300">Progress</span>
              <span
                className={`font-medium ${
                  course.isCompleted
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {getProgress(course)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  course.isCompleted
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
                }`}
                style={{ width: `${getProgress(course)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Course Progress:
          </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              onNotesClick(course);
            }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <StickyNote size={18} />
            <span className="text-sm">
              {course.notes ? "View Notes" : "Add Notes"}
            </span>
          </button>
        </div>
        <ModuleControls
          sections={course.sections}
          currentSection={course.currentSection}
          onSectionChange={(newSection) =>
            onSectionChange(course.id, newSection)
          }
          currentVideo={course.currentVideo}
          onVideoChange={(newVideo) => onVideoChange(course.id, newVideo)}
        />
      </div>
    </div>
  );
}
