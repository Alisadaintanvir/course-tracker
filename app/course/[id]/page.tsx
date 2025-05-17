"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { BookOpen, Clock, ChevronLeft, StickyNote } from "lucide-react";
import Link from "next/link";
import ModuleControls from "@/app/components/ModuleControls";
import NotesModal from "@/app/components/NotesModal";

interface Video {
  name: string;
  path: string;
  size: number;
  lastModified: Date;
}

interface Section {
  name: string;
  path: string;
  modules: Video[];
}

interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  totalModules: number;
  currentModule: number;
  lastAccessed: Date;
  sections: Section[];
  currentSection: number;
  currentVideo: number;
  notes?: string;
}

export default function CoursePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const viewNotes = searchParams.get("view") === "notes";

  useEffect(() => {
    const storedCourses = localStorage.getItem("courses");
    if (storedCourses) {
      const courses = JSON.parse(storedCourses).map((course: any) => ({
        ...course,
        lastAccessed: new Date(course.lastAccessed),
        sections: course.sections.map((section: any) => ({
          ...section,
          modules: section.modules.map((module: any) => ({
            ...module,
            lastModified: new Date(module.lastModified),
          })),
        })),
      }));
      const foundCourse = courses.find((c: Course) => c.id === params.id);
      if (foundCourse) {
        setCourse(foundCourse);
        if (viewNotes) {
          setIsNotesModalOpen(true);
        }
      }
    }
  }, [params.id, viewNotes]);

  const handleSectionChange = (newSection: number) => {
    if (!course) return;
    const updatedCourse = {
      ...course,
      currentSection: newSection,
      currentVideo: 0,
      lastAccessed: new Date(),
    };
    setCourse(updatedCourse);
    updateLocalStorage(updatedCourse);
  };

  const handleVideoChange = (newVideo: number) => {
    if (!course) return;
    const updatedCourse = {
      ...course,
      currentVideo: newVideo,
      lastAccessed: new Date(),
    };
    setCourse(updatedCourse);
    updateLocalStorage(updatedCourse);
  };

  const handleSaveNotes = (notes: string) => {
    if (!course) return;
    const updatedCourse = {
      ...course,
      notes,
    };
    setCourse(updatedCourse);
    updateLocalStorage(updatedCourse);
  };

  const updateLocalStorage = (updatedCourse: Course) => {
    const storedCourses = localStorage.getItem("courses");
    if (storedCourses) {
      const courses = JSON.parse(storedCourses);
      const updatedCourses = courses.map((c: Course) =>
        c.id === updatedCourse.id ? updatedCourse : c
      );
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
    }
  };

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Course not found
          </h1>
          <Link
            href="/"
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <ChevronLeft size={20} />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const getProgress = (course: Course) => {
    if (!course.sections.length) return 0;

    const totalVideos = course.sections.reduce(
      (total, section) => total + section.modules.length,
      0
    );

    let completedVideos = 0;
    for (let i = 0; i < course.currentSection; i++) {
      completedVideos += course.sections[i].modules.length;
    }
    completedVideos += course.currentVideo;

    return Math.round((completedVideos / totalVideos) * 100);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
        >
          <ChevronLeft size={20} />
          Back to Courses
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {course.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {course.description}
            </p>
          </div>
        </div>
      </div>

      {/* Course Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <BookOpen
                className="text-blue-600 dark:text-blue-400"
                size={24}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Category
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {course.category}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
              <Clock
                className="text-purple-600 dark:text-purple-400"
                size={24}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last Accessed
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(course.lastAccessed).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg">
              <StickyNote
                className="text-indigo-600 dark:text-indigo-400"
                size={24}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Course Notes
                </h2>
                <button
                  onClick={() => setIsNotesModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                >
                  <StickyNote size={16} />
                  {course.notes ? "Edit Notes" : "Add Notes"}
                </button>
              </div>
              {course.notes ? (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {course.notes}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  No notes yet. Click the button above to add notes for this
                  course.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Module Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Course Content
        </h2>
        <ModuleControls
          sections={course.sections}
          currentSection={course.currentSection}
          onSectionChange={handleSectionChange}
          currentVideo={course.currentVideo}
          onVideoChange={handleVideoChange}
        />
      </div>

      <NotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        courseId={course.id}
        initialNotes={course.notes}
        onSave={handleSaveNotes}
      />
    </div>
  );
}
