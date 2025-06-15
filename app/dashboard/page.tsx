"use client";

import { Plus, Sparkles, FolderOpen, Star } from "lucide-react";
import { useState, useEffect } from "react";
import AddCourseModal from "../../components/AddCourseModal";
import CourseScanner from "../../components/CourseScanner";
import NotesModal from "../../components/NotesModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Stats from "../../components/Stats";
import CourseCard from "../../components/CourseCard";
import { Course, Section, Video } from "../../types/course";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedCourseForNotes, setSelectedCourseForNotes] =
    useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(
          data.map((course: Course) => ({
            ...course,
            lastAccessed: new Date(course.lastAccessed),
            sections: course.sections.map((section: Section) => ({
              ...section,
              modules: section.modules.map((module: Video) => ({
                ...module,
                lastModified: new Date(module.lastModified),
              })),
            })),
          }))
        );
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleAddCourse = async (courseData: {
    title: string;
    category: string;
    description?: string;
    totalModules: number;
    sections: Section[];
    isCompleted: boolean;
  }) => {
    try {
      const isDuplicate = courses.some(
        (course) =>
          course.title.toLowerCase() === courseData.title.toLowerCase()
      );

      if (isDuplicate) return false;

      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...courseData,
          description: courseData.description || "",
          currentModule: 1,
          lastAccessed: new Date(),
          currentSection: 0,
          currentVideo: 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add course");
      }

      const newCourse = await response.json();
      setCourses((prevCourses) => [
        ...prevCourses,
        {
          ...newCourse,
          lastAccessed: new Date(newCourse.lastAccessed),
          sections: newCourse.sections.map((section: Section) => ({
            ...section,
            modules: section.modules.map((module: Video) => ({
              ...module,
              lastModified: new Date(module.lastModified),
            })),
          })),
        },
      ]);
      return true;
    } catch (error) {
      console.error("Error adding course:", error);
      return false;
    }
  };

  const getProgress = (course: Course) => {
    if (course.isCompleted) return 100;

    if (!course.sections.length) return 0;

    const totalVideos = course.sections.reduce(
      (total: number, section: Section) => total + section.modules.length,
      0
    );

    let completedVideos = 0;
    for (let i = 0; i < course.currentSection; i++) {
      completedVideos += course.sections[i].modules.length;
    }
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

  const handleSaveNotes = (courseId: string, notes: string) => {
    setCourses((prevCourses) => {
      const updatedCourses = prevCourses.map((course) =>
        course.id === courseId ? { ...course, notes } : course
      );
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      return updatedCourses;
    });
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses?id=${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      setCourses((prevCourses) => {
        const updatedCourses = prevCourses.filter(
          (course) => course.id !== courseId
        );
        localStorage.setItem("courses", JSON.stringify(updatedCourses));
        return updatedCourses;
      });
      setCourseToDelete(null);
    } catch (error) {
      console.error("Error deleting course:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleToggleActive = async (courseId: string) => {
    try {
      const course = courses.find((c) => c.id === courseId);
      if (!course) return;

      const response = await fetch(`/api/courses?id=${courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...course,
          isActive: !course.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      const updatedCourse = await response.json();
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId
            ? {
                ...course,
                isActive: updatedCourse.isActive,
              }
            : course
        )
      );
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const filteredCourses = showActiveOnly
    ? courses.filter((course) => course.isActive)
    : courses;

  return (
    <div>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-pink-500 dark:text-pink-400" size={24} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              My Learning Journey
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Track your progress across all courses
          </p>

          <Stats courses={courses} getProgress={getProgress} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Add New Course
          </button>

          <button
            onClick={() => setShowScanner(!showScanner)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <FolderOpen size={20} />
            {showScanner ? "Hide Scanner" : "Scan Local Course"}
          </button>

          <button
            onClick={() => setShowActiveOnly(!showActiveOnly)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
              showActiveOnly
                ? "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Star size={20} className={showActiveOnly ? "fill-current" : ""} />
            {showActiveOnly ? "Show All Courses" : "Show Active Courses"}
          </button>
        </div>

        {/* Course Scanner */}
        {showScanner && (
          <div className="mb-12">
            <CourseScanner onAddCourse={handleAddCourse} />
          </div>
        )}

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center min-h-[400px]">
              <LoadingSpinner size={64} text="Loading your courses..." />
            </div>
          ) : (
            <>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  getProgress={getProgress}
                  getTimeAgo={getTimeAgo}
                  onDelete={setCourseToDelete}
                  onNotesClick={setSelectedCourseForNotes}
                  onSectionChange={handleSectionChange}
                  onVideoChange={handleVideoChange}
                  onToggleActive={handleToggleActive}
                />
              ))}

              {/* Add Course Card */}
              <div
                onClick={() => setIsModalOpen(true)}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 flex items-center justify-center hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-300 cursor-pointer group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <div className="text-center flex flex-col items-center justify-center">
                  <div className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-full mb-3 group-hover:from-pink-200 dark:group-hover:from-pink-800/30 group-hover:to-purple-200 dark:group-hover:to-purple-800/30 transition-colors flex items-center justify-center">
                    <Plus
                      className="text-pink-600 dark:text-pink-400 group-hover:text-pink-700 dark:group-hover:text-pink-300"
                      size={32}
                    />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                    Add another course
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCourse}
      />

      <NotesModal
        isOpen={!!selectedCourseForNotes}
        onClose={() => setSelectedCourseForNotes(null)}
        courseId={selectedCourseForNotes?.id || ""}
        initialNotes={selectedCourseForNotes?.notes}
        onSave={handleSaveNotes}
      />

      <DeleteConfirmationModal
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={() =>
          courseToDelete && handleDeleteCourse(courseToDelete.id)
        }
        courseTitle={courseToDelete?.title || ""}
      />
    </div>
  );
}
