"use client";

import { useState } from "react";
import NotesModal from "@/components/NotesModal";
import CompletionHistoryModal from "@/components/CompletionHistoryModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import CourseHeader from "@/components/course/CourseHeader";
import CourseInfoCards from "@/components/course/CourseInfoCards";
import CourseProgress from "@/components/course/CourseProgress";
import CourseNotes from "@/components/course/CourseNotes";
import CourseContent from "@/components/course/CourseContent";
import { useCourseData } from "@/hooks/useCourseData";

export default function CoursePage() {
  const {
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
  } = useCourseData();

  const [isNotesModalOpen, setIsNotesModalOpen] = useState(viewNotes);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[600px]">
          <LoadingSpinner size={64} text="Loading course..." />
        </div>
      </div>
    );
  }

  if (!course && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The course you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <CourseHeader
        course={course}
        courseValue={courseValue}
        onToggleCompletion={toggleCourseCompletion}
        onReset={handleResetCourse}
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      <CourseInfoCards
        courseValue={courseValue}
        onShowHistory={() => setIsHistoryModalOpen(true)}
      />

      <CourseProgress courseValue={courseValue} getProgress={getProgress} />

      <CourseNotes
        courseValue={courseValue}
        onEditNotes={() => setIsNotesModalOpen(true)}
      />

      <CourseContent
        course={course}
        expandedSection={expandedSection}
        onToggleSection={toggleSection}
        onSectionChange={handleSectionChange}
        onVideoChange={handleVideoChange}
      />

      {course && (
        <>
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

          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              deleteCourse(course.id);
              window.location.href = "/";
            }}
            courseTitle={course.title || ""}
          />
        </>
      )}

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
