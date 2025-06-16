import { ChevronDown } from "lucide-react";
import { Course } from "@/types/course-page";

interface CourseContentProps {
  course: Course | null;
  expandedSection: number | null;
  onToggleSection: (sectionIndex: number) => void;
  onSectionChange: (sectionIndex: number) => void;
  onVideoChange: (sectionIndex: number, moduleIndex: number) => void;
}

export default function CourseContent({
  course,
  expandedSection,
  onToggleSection,
  onSectionChange,
  onVideoChange,
}: CourseContentProps) {
  if (!course) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Course Content
      </h2>
      <div className="space-y-4">
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
              onClick={() => onToggleSection(sectionIndex)}
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
                    e.stopPropagation();
                    onSectionChange(sectionIndex);
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
                    onClick={() => onVideoChange(sectionIndex, moduleIndex)}
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
  );
}
