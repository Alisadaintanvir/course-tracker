"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { BookOpen, Clock, ChevronLeft } from "lucide-react";
import ModuleControls from "../../components/ModuleControls";

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
}

export default function CourseDetails() {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    // Get course data from localStorage
    const courses = JSON.parse(localStorage.getItem("courses") || "[]");
    const courseData = courses.find((c: any) => c.id === params.id);
    if (courseData) {
      // Convert string dates back to Date objects
      const processedCourse = {
        ...courseData,
        lastAccessed: new Date(courseData.lastAccessed),
        sections: courseData.sections.map((section: any) => ({
          ...section,
          modules: section.modules.map((module: any) => ({
            ...module,
            lastModified: new Date(module.lastModified),
          })),
        })),
      } as Course;
      setCourse(processedCourse);
    }
  }, [params.id]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Course not found
            </h1>
          </div>
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

  const handleSectionChange = (newSection: number) => {
    setCourse((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        currentSection: newSection,
        currentVideo: 0,
        lastAccessed: new Date(),
      };
      // Update localStorage
      const courses = JSON.parse(localStorage.getItem("courses") || "[]");
      const updatedCourses = courses.map((c: any) =>
        c.id === course.id ? updated : c
      );
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      return updated;
    });
  };

  const handleVideoChange = (newVideo: number) => {
    setCourse((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        currentVideo: newVideo,
        lastAccessed: new Date(),
      };
      // Update localStorage
      const courses = JSON.parse(localStorage.getItem("courses") || "[]");
      const updatedCourses = courses.map((c: any) =>
        c.id === course.id ? updated : c
      );
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-8 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Courses
        </button>

        {/* Course Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm mb-8">
          <div className="flex items-start gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl">
              <BookOpen className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {course.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {course.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>
                    Last accessed: {course.lastAccessed.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Category: {course.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-300">Progress</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {getProgress(course)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${getProgress(course)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
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
      </div>
    </div>
  );
}
