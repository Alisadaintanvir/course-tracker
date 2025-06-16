import { StickyNote } from "lucide-react";
import { Course } from "@/types/course-page";

interface CourseNotesProps {
  courseValue: <T>(accessor: (c: Course) => T, defaultValue: T) => T;
  onEditNotes: () => void;
}

export default function CourseNotes({
  courseValue,
  onEditNotes,
}: CourseNotesProps) {
  return (
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
                onClick={onEditNotes}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
              >
                <StickyNote size={16} />
                {courseValue(
                  (c) => (c.notes ? "Edit Notes" : "Add Notes"),
                  "Add Notes"
                )}
              </button>
            </div>
            {courseValue((c) => !!c.notes, false) ? (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {courseValue((c) => c.notes || "", "")}
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
  );
}
