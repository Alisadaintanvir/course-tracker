"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Course, CompletionRecord } from "@/app/types/course";

interface CourseContextType {
  courses: Course[];
  updateCourse: (updatedCourse: Course) => void;
  addCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  getCourse: (courseId: string) => Course | undefined;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);

  // Load courses from localStorage on mount
  useEffect(() => {
    const storedCourses = localStorage.getItem("courses");
    if (storedCourses) {
      const parsedCourses = JSON.parse(storedCourses).map((course: any) => ({
        ...course,
        lastAccessed: new Date(course.lastAccessed),
        sections: course.sections.map((section: any) => ({
          ...section,
          modules: section.modules.map((module: any) => ({
            ...module,
            lastModified: new Date(module.lastModified),
          })),
        })),
        completionHistory:
          course.completionHistory?.map((record: any) => ({
            ...record,
            completedAt: new Date(record.completedAt),
          })) || [],
      }));
      setCourses(parsedCourses);
    }
  }, []);

  // Update localStorage whenever courses change
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  const updateCourse = (updatedCourse: Course) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  };

  const addCourse = (course: Course) => {
    setCourses((prevCourses) => [...prevCourses, course]);
  };

  const deleteCourse = (courseId: string) => {
    setCourses((prevCourses) =>
      prevCourses.filter((course) => course.id !== courseId)
    );
  };

  const getCourse = (courseId: string) => {
    return courses.find((course) => course.id === courseId);
  };

  return (
    <CourseContext.Provider
      value={{ courses, updateCourse, addCourse, deleteCourse, getCourse }}
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
