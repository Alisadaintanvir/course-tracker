"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ICourse } from "@/app/models/Course";

interface CourseContextType {
  courses: ICourse[];
  getCourse: (id: string) => ICourse | undefined;
  addCourse: (course: Omit<ICourse, "_id">) => Promise<void>;
  updateCourse: (course: ICourse) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  toggleCourseCompletion: (id: string) => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

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
    return courses.find((course) => course._id === id);
  };

  const addCourse = async (course: Omit<ICourse, "_id">) => {
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

  const updateCourse = async (course: ICourse) => {
    try {
      const response = await fetch(`/api/courses/${course._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });

      if (!response.ok) throw new Error("Failed to update course");
      const updatedCourse = await response.json();
      setCourses((prev) =>
        prev.map((c) => (c._id === course._id ? updatedCourse : c))
      );
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete course");
      setCourses((prev) => prev.filter((course) => course._id !== id));
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
