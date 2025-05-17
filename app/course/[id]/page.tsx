"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  ChevronLeft,
  StickyNote,
  History,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import NotesModal from "@/app/components/NotesModal";
import CompletionHistoryModal from "@/app/components/CompletionHistoryModal";
import { useCourse } from "@/app/context/CourseContext";

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
  completionHistory?: CompletionRecord[];
  isCompleted: boolean;
  completedAt?: Date;
}

interface CompletionRecord {
  sectionIndex: number;
  videoIndex: number;
  completedAt: Date;
  moduleName: string;
  sectionName: string;
}

export default function CoursePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { getCourse, updateCourse, toggleCourseCompletion } = useCourse();
  const [course, setCourse] = useState<Course | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const viewNotes = searchParams.get("view") === "notes";

  useEffect(() => {
    const foundCourse = getCourse(params.id as string);
    if (foundCourse) {
      setCourse(foundCourse);
      if (viewNotes) {
        setIsNotesModalOpen(true);
      }
    }
  }, [params.id, viewNotes, getCourse]);

  // Update expanded section when current section changes
  useEffect(() => {
    if (course) {
      setExpandedSection(course.currentSection);
    }
  }, [course?.currentSection]);

  const handleSectionChange = (newSection: number) => {
    if (!course) return;

    const updatedCourse = {
      ...course,
      currentSection: newSection,
      currentVideo: 0,
      lastAccessed: new Date(),
    };

    setCourse(updatedCourse);
    updateCourse(updatedCourse);
  };

  const handleVideoChange = (sectionIndex: number, moduleIndex: number) => {
    if (!course) return;

    const updatedCourse = {
      ...course,
      currentSection: sectionIndex,
      currentVideo: moduleIndex,
      lastAccessed: new Date(),
    };

    if (
      course.currentVideo <
      course.sections[course.currentSection].modules.length
    ) {
      const currentSection = course.sections[course.currentSection];
      const currentModule = currentSection.modules[course.currentVideo];

      const completionRecord = {
        sectionIndex: course.currentSection,
        videoIndex: course.currentVideo,
        completedAt: new Date(),
        moduleName: currentModule.name,
        sectionName: currentSection.name,
      };

      updatedCourse.completionHistory = [
        ...(course.completionHistory || []),
        completionRecord,
      ];
    }

    setCourse(updatedCourse);
    updateCourse(updatedCourse);
  };

  const handleSaveNotes = (notes: string) => {
    if (!course) return;
    const updatedCourse = {
      ...course,
      notes,
    };
    setCourse(updatedCourse);
    updateCourse(updatedCourse);
  };

  const toggleSection = (sectionIndex: number) => {
    setExpandedSection(expandedSection === sectionIndex ? null : sectionIndex);
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
    if (course.isCompleted) return 100;

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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {course.title}
              </h1>
              <button
                onClick={() => toggleCourseCompletion(course.id)}
                className={`p-2 rounded-full transition-colors ${
                  course.isCompleted
                    ? "text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
                    : "text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                }`}
                title={
                  course.isCompleted ? "Mark as incomplete" : "Mark as complete"
                }
              >
                <CheckCircle2 size={24} />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {course.description}
            </p>
            {course.isCompleted && course.completedAt && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Completed on {new Date(course.completedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Course Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg ${
                course.isCompleted
                  ? "bg-green-100 dark:bg-green-900"
                  : "bg-indigo-100 dark:bg-indigo-900"
              }`}
            >
              <History
                className={
                  course.isCompleted
                    ? "text-green-600 dark:text-green-400"
                    : "text-indigo-600 dark:text-indigo-400"
                }
                size={24}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {course.isCompleted ? "Completion Status" : "Completed Modules"}
              </p>
              {course.isCompleted ? (
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  Completed
                </p>
              ) : (
                <button
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  {course.completionHistory?.length || 0} modules
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
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
                {getProgress(course)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${getProgress(course)}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current Section
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {course.sections[course.currentSection]?.name ||
                    "Not Started"}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current Video
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {course.sections[course.currentSection]?.modules[
                    course.currentVideo
                  ]?.name || "Not Started"}
                </p>
              </div>
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
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {course.sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className={`border rounded-lg overflow-hidden ${
                sectionIndex === course.currentSection
                  ? "border-indigo-500 dark:border-indigo-400"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div
                className={`p-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50`}
                onClick={() => toggleSection(sectionIndex)}
              >
                <div className="flex items-center gap-3">
                  <ChevronDown
                    className={`transform transition-transform duration-200 ${
                      expandedSection === sectionIndex ? "rotate-180" : ""
                    }`}
                    size={20}
                  />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {section.name}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  {sectionIndex === course.currentSection && (
                    <span className="text-sm text-indigo-600 dark:text-indigo-400">
                      Current Section
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent section toggle when clicking button
                      handleSectionChange(sectionIndex);
                    }}
                    className={`px-3 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                      sectionIndex === course.currentSection
                        ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {sectionIndex === course.currentSection
                      ? "Current"
                      : "Set as Current"}
                  </button>
                </div>
              </div>

              {/* Accordion Content */}
              <div
                className={`transition-all duration-200 ${
                  expandedSection === sectionIndex
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {section.modules.map((module, moduleIndex) => (
                    <div
                      key={moduleIndex}
                      onClick={() =>
                        handleVideoChange(sectionIndex, moduleIndex)
                      }
                      className={`p-4 flex items-center justify-between cursor-pointer ${
                        sectionIndex === course.currentSection &&
                        moduleIndex === course.currentVideo
                          ? "bg-indigo-50 dark:bg-indigo-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            sectionIndex < course.currentSection ||
                            (sectionIndex === course.currentSection &&
                              moduleIndex < course.currentVideo)
                              ? "bg-green-500"
                              : sectionIndex === course.currentSection &&
                                moduleIndex === course.currentVideo
                              ? "bg-indigo-500"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {module.name}
                        </span>
                      </div>
                      {sectionIndex === course.currentSection &&
                        moduleIndex === course.currentVideo && (
                          <span className="text-sm text-indigo-600 dark:text-indigo-400">
                            Current
                          </span>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        courseId={course.id}
        initialNotes={course.notes}
        onSave={handleSaveNotes}
      />

      <CompletionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        courseTitle={course.title}
        completionHistory={course.completionHistory || []}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(75, 85, 99, 0.7);
        }
      `}</style>
    </div>
  );
}
