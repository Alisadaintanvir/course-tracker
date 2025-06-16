import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useCourse } from "@/context/CourseContext";
import { Course } from "@/types/course-page";

export function useCourseData() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { getCourse, updateCourse, toggleCourseCompletion, deleteCourse } =
    useCourse();

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const viewNotes = searchParams.get("view") === "notes";

  useEffect(() => {
    setIsLoading(true);
    const foundCourse = getCourse(params.id as string);
    if (foundCourse) {
      const courseWithDates = {
        ...foundCourse,
        lastAccessed: new Date(foundCourse.lastAccessed),
        completedAt: foundCourse.completedAt
          ? new Date(foundCourse.completedAt)
          : undefined,
        completionHistory: foundCourse.completionHistory?.map((record) => ({
          ...record,
          completedAt: new Date(record.completedAt),
        })),
      };
      setCourse(courseWithDates);
    }
    setIsLoading(false);
  }, [params.id, getCourse]);

  useEffect(() => {
    if (course) {
      setExpandedSection(course.currentSection);
    }
  }, [course]);

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

  const handleResetCourse = async () => {
    if (!course) return;

    if (
      !window.confirm(
        "Are you sure you want to reset this course? This will clear all progress, notes, and completion history."
      )
    ) {
      return;
    }

    const resetCourse = {
      ...course,
      currentSection: 0,
      currentVideo: 0,
      currentModule: 1,
      lastAccessed: new Date(),
      notes: "",
      completionHistory: [],
      isCompleted: false,
      completedAt: undefined,
    };

    setCourse(resetCourse);
    await updateCourse(resetCourse);
  };

  const toggleSection = (sectionIndex: number) => {
    setExpandedSection(expandedSection === sectionIndex ? null : sectionIndex);
  };

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

  const courseValue = <T>(accessor: (c: Course) => T, defaultValue: T): T => {
    if (!course) return defaultValue;
    try {
      return accessor(course);
    } catch {
      return defaultValue;
    }
  };

  return {
    course,
    isLoading,
    viewNotes,
    expandedSection,
    handleSectionChange,
    handleVideoChange,
    handleSaveNotes,
    handleResetCourse,
    toggleSection,
    getProgress,
    courseValue,
    toggleCourseCompletion,
    deleteCourse,
  };
}
