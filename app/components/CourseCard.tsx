"use client";

import { BookOpen, Clock, StickyNote, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { Course } from "@/types/course";
import ModuleControls from "./ModuleControls";

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
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <Link href={`/course/${course.id}`} className="flex-1">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-3 rounded-xl">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {course.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {course.category}
              </p>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleActive(course.id)}
            className={`p-2 rounded-lg transition-colors ${
              course.isActive
                ? "text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300"
                : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            }`}
            title={course.isActive ? "Mark as inactive" : "Mark as active"}
          >
            <Star size={20} className={course.isActive ? "fill-current" : ""} />
          </button>
          <button
            onClick={() => onDelete(course)}
            className="p-2 text-gray-400 hover:text-rose-600 dark:text-gray-500 dark:hover:text-rose-400 transition-colors"
            title="Delete Course"
          >
            <Trash2 size={20} />
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
              <span className="text-gray-900 dark:text-white font-medium">
                {getProgress(course)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-300"
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
