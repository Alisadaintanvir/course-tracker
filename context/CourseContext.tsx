"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Course } from "@/types/course";
import { useSession } from "next-auth/react";

interface CourseContextType {
  courses: Course[];
  getCourse: (id: string) => Course | undefined;
  addCourse: (course: Omit<Course, "id">) => Promise<void>;
  updateCourse: (course: Course) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  toggleCourseCompletion: (id: string) => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Only fetch courses if user is authenticated
    if (status === "authenticated") {
      fetchCourses();
    } else if (status === "unauthenticated") {
      // Clear courses when user is not authenticated
      setCourses([]);
    }
  }, [status]);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const getCourse = (id: string) => {
    return courses.find((course) => course.id === id);
  };

  const addCourse = async (course: Omit<Course, "id">) => {
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });

      if (!response.ok) throw new Error("Failed to add course");
      const newCourse = await response.json();
      setCourses((prev) => [...prev, newCourse]);
    } catch (error) {
      console.error("Error adding course:", error);
      throw error;
    }
  };

  const updateCourse = async (course: Course) => {
    try {
      const response = await fetch(`/api/courses?id=${course.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });

      if (!response.ok) throw new Error("Failed to update course");
      const updatedCourse = await response.json();
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? updatedCourse : c))
      );
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const response = await fetch(`/api/courses?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete course");
      setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  };

  const toggleCourseCompletion = async (id: string) => {
    const course = getCourse(id);
    if (!course) return;

    const updatedCourse = {
      ...course,
      isCompleted: !course.isCompleted,
      completedAt: !course.isCompleted ? new Date() : undefined,
    };

    await updateCourse(updatedCourse);
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        getCourse,
        addCourse,
        updateCourse,
        deleteCourse,
        toggleCourseCompletion,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
}
