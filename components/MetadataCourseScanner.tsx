"use client";

import { useState } from "react";
import { FolderOpen, Video, HardDrive, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
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
  totalSize: number;
  totalFiles: number;
}

interface MetadataCourseScannerProps {
  onAddCourse: (courseData: {
    title: string;
    category: string;
    description: string;
    totalModules: number;
    sections: Section[];
    isCompleted: boolean;
  }) => Promise<boolean>;
}

export default function MetadataCourseScanner({ onAddCourse }: MetadataCourseScannerProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [courseName, setCourseName] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseStructure, setCourseStructure] = useState<CourseStructure | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFiles(files);
    setError(null);
    setCourseStructure(null);
  };
  const buildDirectoryStructure = (files: FileList) => {
    interface DirectoryNode {
      name: string;
      path: string;
      type: 'directory' | 'file';
      size?: number;
      lastModified?: Date;
      children?: Record<string, DirectoryNode>;
    }
    
    const structure: Record<string, DirectoryNode> = {};
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
      const pathParts = filePath.split('/');
      
      let current = structure;
      
      // Build nested structure
      for (let j = 0; j < pathParts.length - 1; j++) {
        const part = pathParts[j];
        if (!current[part]) {
          current[part] = {
            name: part,
            path: pathParts.slice(0, j + 1).join('/'),
            type: 'directory',
            children: {}
          };
        }
        current = current[part].children!;
      }
      
      // Add the file
      const fileName = pathParts[pathParts.length - 1];
      current[fileName] = {
        name: fileName,
        path: filePath,
        type: 'file',
        size: file.size,
        lastModified: new Date(file.lastModified)
      };
    }    // Convert to array format
    function convertToArray(obj: Record<string, DirectoryNode>): unknown[] {
      return Object.values(obj).map((item: DirectoryNode) => {
        if (item.type === 'directory' && item.children) {
          return {
            name: item.name,
            path: item.path,
            type: item.type,
            size: item.size,
            lastModified: item.lastModified,
            children: convertToArray(item.children)
          };
        }
        return {
          name: item.name,
          path: item.path,
          type: item.type,
          size: item.size,
          lastModified: item.lastModified
        };
      });
    }
    
    return convertToArray(structure);
  };

  const handleScan = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError("Please select a course folder");
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      // Build directory structure from selected files (metadata only)
      const directoryStructure = buildDirectoryStructure(selectedFiles);
      
      // Send only metadata to the API
      const formData = new FormData();
      formData.append('metadata', JSON.stringify(directoryStructure));

      const response = await fetch("/api/scan-metadata", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to scan course metadata");
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

    const courseData = {
      title: courseName || courseStructure.name,
      category: "Web Development",
      description: `Course with ${courseStructure.totalFiles} videos (${formatFileSize(courseStructure.totalSize)}) across ${courseStructure.sections.length} sections`,
      totalModules: courseStructure.totalFiles,
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
        const fileInput = document.getElementById('courseFiles') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
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
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">
              Metadata-Only Scanning
            </h3>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            This approach only reads file names, sizes, and folder structure - no actual file content is uploaded.
            Perfect for large courses (30-40GB+) as it&apos;s lightning fast and uses minimal bandwidth.
          </p>
        </div>

        <div>
          <label
            htmlFor="courseFiles"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Select Course Folder
          </label>
          <div className="space-y-2">
            <input
              type="file"
              id="courseFiles"
              multiple
              webkitdirectory=""
              onChange={handleFileSelect}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select a folder containing your course videos. Only file metadata (names, sizes, structure) will be processed - no files uploaded!
            </p>
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                <Clock className="w-4 h-4" />
                {selectedFiles.length} files selected (metadata only)
              </div>
            )}
            <Button
              onClick={handleScan}
              disabled={isScanning || !selectedFiles || selectedFiles.length === 0}
              className="w-full"
            >
              {isScanning ? "Scanning Structure..." : "Scan Course Structure"}
            </Button>
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

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                <FolderOpen size={20} />
                <span className="font-medium">
                  {courseName || courseStructure.name}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Total Videos:</span>
                  <span className="ml-2 font-medium">{courseStructure.totalFiles}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Total Size:</span>
                  <span className="ml-2 font-medium">{formatFileSize(courseStructure.totalSize)}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Sections:</span>
                  <span className="ml-2 font-medium">{courseStructure.sections.length}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Root Videos:</span>
                  <span className="ml-2 font-medium">{courseStructure.modules.length}</span>
                </div>
              </div>
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

            <Button
              onClick={handleAddToCourses}
              className="w-full"
            >
              Add to Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
