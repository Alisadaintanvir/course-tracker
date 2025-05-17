"use client";

import {
  BookOpen,
  Clock,
  ChevronRight,
  Plus,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useState, useEffect } from "react";
import AddCourseModal from "./components/AddCourseModal";
import CourseScanner from "./components/CourseScanner";
import Link from "next/link";
import ModuleControls from "./components/ModuleControls";

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

const dummyCourses: Course[] = [
  {
    id: "1",
    title: "Next.js Masterclass",
    category: "Web Development",
    description: "Learn Next.js from scratch to advanced",
    totalModules: 12,
    currentModule: 8,
    lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    sections: [
      {
        name: "Getting Started",
        path: "/courses/nextjs/getting-started",
        modules: [
          {
            name: "Introduction to Next.js",
            path: "/courses/nextjs/getting-started/intro.mp4",
            size: 1024000,
            lastModified: new Date(),
          },
          {
            name: "Setting up your environment",
            path: "/courses/nextjs/getting-started/setup.mp4",
            size: 2048000,
            lastModified: new Date(),
          },
        ],
      },
      {
        name: "Core Concepts",
        path: "/courses/nextjs/core-concepts",
        modules: [
          {
            name: "Routing in Next.js",
            path: "/courses/nextjs/core-concepts/routing.mp4",
            size: 3072000,
            lastModified: new Date(),
          },
          {
            name: "Data Fetching",
            path: "/courses/nextjs/core-concepts/data-fetching.mp4",
            size: 4096000,
            lastModified: new Date(),
          },
        ],
      },
    ],
    currentSection: 0,
    currentVideo: 0,
  },
  {
    id: "2",
    title: "React Fundamentals",
    category: "Web Development",
    description: "Master the basics of React",
    totalModules: 10,
    currentModule: 5,
    lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    sections: [
      {
        name: "React Basics",
        path: "/courses/react/basics",
        modules: [
          {
            name: "Components and Props",
            path: "/courses/react/basics/components.mp4",
            size: 1536000,
            lastModified: new Date(),
          },
          {
            name: "State and Lifecycle",
            path: "/courses/react/basics/state.mp4",
            size: 2560000,
            lastModified: new Date(),
          },
        ],
      },
    ],
    currentSection: 0,
    currentVideo: 0,
  },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Initialize with dummy data if no courses exist
    const storedCourses = localStorage.getItem("courses");
    if (!storedCourses) {
      localStorage.setItem("courses", JSON.stringify(dummyCourses));
      setCourses(dummyCourses);
    } else {
      // Parse stored courses and convert dates
      const parsedCourses = JSON.parse(storedCourses).map((course: any) => {
        const processedCourse = {
          ...course,
          lastAccessed: new Date(course.lastAccessed),
          sections: course.sections.map((section: any) => ({
            ...section,
            modules: section.modules.map((module: any) => ({
              ...module,
              lastModified: new Date(module.lastModified),
            })),
          })),
        };
        return processedCourse as Course;
      });
      setCourses(parsedCourses);
    }
  }, []);

  const handleAddCourse = (
    courseData: Omit<
      Course,
      | "id"
      | "currentModule"
      | "lastAccessed"
      | "currentSection"
      | "currentVideo"
    >
  ) => {
    // Check if a course with the same title already exists
    const isDuplicate = courses.some(
      (course) => course.title.toLowerCase() === courseData.title.toLowerCase()
    );

    if (isDuplicate) {
      return false;
    }

    const newCourse: Course = {
      ...courseData,
      id: Math.random().toString(36).substr(2, 9),
      currentModule: 1,
      lastAccessed: new Date(),
      currentSection: 0,
      currentVideo: 0,
    };
    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    return true;
  };

  const getProgress = (course: Course) => {
    if (!course.sections.length) return 0;

    // Calculate total videos across all sections
    const totalVideos = course.sections.reduce(
      (total, section) => total + section.modules.length,
      0
    );

    // Calculate completed videos
    let completedVideos = 0;

    // Count videos in completed sections
    for (let i = 0; i < course.currentSection; i++) {
      completedVideos += course.sections[i].modules.length;
    }

    // Add videos from current section
    completedVideos += course.currentVideo;

    return Math.round((completedVideos / totalVideos) * 100);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffInDays === 0 ? "Today" : `${diffInDays} days ago`;
  };

  const handleSectionChange = (courseId: string, newSection: number) => {
    setCourses((prevCourses) => {
      const updatedCourses = prevCourses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              currentSection: newSection,
              currentVideo: 0,
              lastAccessed: new Date(),
            }
          : course
      );
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      return updatedCourses;
    });
  };

  const handleVideoChange = (courseId: string, newVideo: number) => {
    setCourses((prevCourses) => {
      const updatedCourses = prevCourses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              currentVideo: newVideo,
              lastAccessed: new Date(),
            }
          : course
      );
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      return updatedCourses;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header with Stats */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-yellow-500" size={24} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Learning Journey
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Track your progress across all courses
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
                  <BookOpen
                    className="text-blue-600 dark:text-blue-400"
                    size={24}
                  />
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

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-xl">
                  <Target
                    className="text-purple-600 dark:text-purple-400"
                    size={24}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Completion Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(
                      courses.reduce(
                        (acc, course) => acc + getProgress(course),
                        0
                      ) / courses.length
                    )}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-xl">
                  <Trophy
                    className="text-yellow-600 dark:text-yellow-400"
                    size={24}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {
                      courses.filter((course) => getProgress(course) === 100)
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Scanner */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Scan Local Course
          </h2>
          <CourseScanner onAddCourse={handleAddCourse} />
        </div>

        {/* Add New Course Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-8 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Plus size={20} />
          Add New Course
        </button>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1"
            >
              <Link href={`/course/${course.id}`} className="block">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
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
                  <ChevronRight
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    size={20}
                  />
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Clock size={16} />
                    <span>
                      Last accessed: {getTimeAgo(course.lastAccessed)}
                    </span>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">
                        Progress
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {getProgress(course)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${getProgress(course)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="mt-6 text-sm">
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Course Progress:
                </p>
                <ModuleControls
                  sections={course.sections}
                  currentSection={course.currentSection}
                  onSectionChange={(newSection) =>
                    handleSectionChange(course.id, newSection)
                  }
                  currentVideo={course.currentVideo}
                  onVideoChange={(newVideo) =>
                    handleVideoChange(course.id, newVideo)
                  }
                />
              </div>
            </div>
          ))}

          {/* Add Course Card */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 flex items-center justify-center hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 cursor-pointer group"
          >
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mx-auto mb-3 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                <Plus
                  className="text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                  size={32}
                />
              </div>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Add another course
              </p>
            </div>
          </div>
        </div>
      </div>

      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCourse}
      />
    </div>
  );
}
