"use client";

import { useState } from "react";
import { FolderOpen, Video } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Extend the input element to include webkitdirectory
declare module "react" {
  interface InputHTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    webkitdirectory?: string;
  }
}

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

interface CourseStructure {
  name: string;
  path: string;
  sections: Section[];
  modules: Video[];
}

interface CourseScannerProps {
  onAddCourse: (courseData: {
    title: string;
    category: string;
    description: string;
    totalModules: number;
    sections: Section[];
    isCompleted: boolean;
  }) => Promise<boolean>;
}

export default function CourseScanner({ onAddCourse }: CourseScannerProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [courseName, setCourseName] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseStructure, setCourseStructure] =
    useState<CourseStructure | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFiles(files);
    setError(null);
    setCourseStructure(null);
  };

  const handleScan = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError("Please select course files");
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("files", selectedFiles[i]);
      }

      const response = await fetch("/api/scan-course", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to scan course");
      }

      setCourseStructure(data);
      // Set default course name from scanned data if not already set
      if (!courseName) {
        setCourseName(data.name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to scan course");
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddToCourses = async () => {
    if (!courseStructure) return;

    // Calculate total modules from sections
    const totalModules = courseStructure.sections.reduce(
      (total, section) => total + section.modules.length,
      0
    );

    const courseData = {
      title: courseName || courseStructure.name, // Use custom name if set, otherwise use scanned name
      category: "Web Development", // You can make this dynamic if needed
      description: `Course with ${totalModules} videos across ${courseStructure.sections.length} sections`,
      totalModules,
      sections: courseStructure.sections,
      isCompleted: false,
    };
    try {
      const success = await onAddCourse(courseData);
      if (success) {
        setSelectedFiles(null);
        setCourseName("");
        setCourseStructure(null);
        // Reset file input
        const fileInput = document.getElementById(
          "courseFiles"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setError("A course with this name already exists");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add course");
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="space-y-4">
        {" "}
        <div>
          <label
            htmlFor="courseFiles"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Select Course Files
          </label>
          <div className="space-y-2">
            {" "}
            <input
              type="file"
              id="courseFiles"
              multiple
              webkitdirectory=""
              onChange={handleFileSelect}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select a folder containing your course videos. The folder
              structure will be preserved as sections.
            </p>
            {selectedFiles && selectedFiles.length > 0 && (
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                {selectedFiles.length} files selected
              </p>
            )}
            <button
              onClick={handleScan}
              disabled={
                isScanning || !selectedFiles || selectedFiles.length === 0
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isScanning ? "Scanning..." : "Scan Course"}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
        {courseStructure && (
          <div className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="courseName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Course Name
              </label>
              <input
                type="text"
                id="courseName"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Enter a custom name for the course"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <FolderOpen size={20} />
              <span className="font-medium">
                {courseName || courseStructure.name}
              </span>
            </div>

            <ScrollArea className="h-[400px] rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4">
                {/* Root level modules */}
                {courseStructure.modules.length > 0 && (
                  <div className="mb-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="root-modules">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-2">
                            <FolderOpen className="text-yellow-500" size={20} />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                              Root Level Videos
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                              ({courseStructure.modules.length} videos)
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-1 mt-2">
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
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* Sections */}
                <Accordion type="multiple" className="w-full">
                  {courseStructure.sections.map((section) => (
                    <AccordionItem key={section.path} value={section.path}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="text-yellow-500" size={20} />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {section.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            ({section.modules.length} videos)
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 mt-2">
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
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </ScrollArea>

            <button
              onClick={handleAddToCourses}
              className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Add to Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
