import { useState, useRef } from "react";
import {
  FolderOpen,
  Video,
  ChevronDown,
  ChevronRight,
  FolderInput,
  Plus,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Module {
  name: string;
  path: string;
  size: number;
  lastModified: Date;
}

interface Section {
  name: string;
  path: string;
  modules: Module[];
}

interface CourseStructure {
  name: string;
  path: string;
  sections: Section[];
  modules: Module[];
}

interface CourseScannerProps {
  onAddCourse: (courseData: {
    title: string;
    category: string;
    description: string;
    totalModules: number;
  }) => boolean;
}

export default function CourseScanner({ onAddCourse }: CourseScannerProps) {
  const [coursePath, setCoursePath] = useState("");
  const [courseStructure, setCourseStructure] =
    useState<CourseStructure | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDirectorySelect = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Due to browser security restrictions, we can't get the full path
      // Instead, we'll show a message to enter the path manually
      setError(
        "Due to browser security restrictions, please enter the full path manually in the input field above (e.g., D:\\become-a-wordpress-developer)"
      );
    }
  };

  const handleScan = async (path?: string) => {
    if (!path && !coursePath) {
      setError("Course path is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/scan-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coursePath: path || coursePath }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to scan course");
      }

      const data = await response.json();
      setCourseStructure(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to scan course");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionPath: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionPath)) {
        next.delete(sectionPath);
      } else {
        next.add(sectionPath);
      }
      return next;
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
  };

  const handleAddToCourses = () => {
    if (!courseStructure) return;

    // Calculate total modules
    const totalModules = courseStructure.sections.reduce(
      (total, section) => total + section.modules.length,
      courseStructure.modules.length
    );

    // Create course data
    const courseData = {
      title: courseStructure.name,
      category: "Web Development", // Default category
      description: `Local course with ${totalModules} modules`,
      totalModules,
    };

    const success = onAddCourse(courseData);

    if (success) {
      // Clear the scan results only if course was added successfully
      setCourseStructure(null);
      setCoursePath("");
      setError(null);
    } else {
      // Show error message for duplicate course
      setError(
        `A course with the name "${courseStructure.name}" already exists. Please use a different name.`
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={coursePath}
            onChange={(e) => setCoursePath(e.target.value)}
            placeholder="Enter course directory path (e.g., D:\\become-a-wordpress-developer)"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleDirectorySelect}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Select Directory"
          >
            <FolderInput size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: "none" }}
            // @ts-expect-error webkitdirectory is a valid attribute but not in TypeScript types
            webkitdirectory=""
            directory=""
          />
        </div>
        <button
          onClick={() => handleScan()}
          disabled={loading || !coursePath}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Scanning..." : "Scan Course"}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {courseStructure && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleAddToCourses}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-colors"
            >
              <Plus size={20} />
              Add to Courses
            </button>
          </div>
          <ScrollArea className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm h-[600px]">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {courseStructure.name}
            </h3>

            {/* Root level modules */}
            {courseStructure.modules.length > 0 && (
              <div className="space-y-2 mb-4">
                {courseStructure.modules.map((module) => (
                  <div
                    key={module.path}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <Video className="text-blue-500" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">
                      {module.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                      {formatFileSize(module.size)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Sections */}
            {courseStructure.sections.map((section) => (
              <div key={section.path} className="mb-4">
                <button
                  onClick={() => toggleSection(section.path)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  {expandedSections.has(section.path) ? (
                    <ChevronDown className="text-gray-500" size={20} />
                  ) : (
                    <ChevronRight className="text-gray-500" size={20} />
                  )}
                  <FolderOpen className="text-yellow-500" size={20} />
                  <span className="text-gray-700 dark:text-gray-300">
                    {section.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                    {section.modules.length} modules
                  </span>
                </button>

                {expandedSections.has(section.path) && (
                  <div className="ml-8 mt-2 space-y-2">
                    {section.modules.map((module) => (
                      <div
                        key={module.path}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <Video className="text-blue-500" size={20} />
                        <span className="text-gray-700 dark:text-gray-300">
                          {module.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                          {formatFileSize(module.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
