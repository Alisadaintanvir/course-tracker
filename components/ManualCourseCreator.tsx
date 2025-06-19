"use client";

import { useState } from "react";
import { Plus, Trash2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface ManualCourseCreatorProps {
  onAddCourse: (courseData: {
    title: string;
    category: string;
    description: string;
    totalModules: number;
    sections: Section[];
    isCompleted: boolean;
  }) => Promise<boolean>;
}

export default function ManualCourseCreator({
  onAddCourse,
}: ManualCourseCreatorProps) {
  const [courseName, setCourseName] = useState("");
  const [courseCategory, setCourseCategory] = useState("Web Development");
  const [sections, setSections] = useState<
    { name: string; videos: string[] }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const addSection = () => {
    setSections([...sections, { name: "", videos: [""] }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSectionName = (index: number, name: string) => {
    const newSections = [...sections];
    newSections[index].name = name;
    setSections(newSections);
  };

  const addVideo = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].videos.push("");
    setSections(newSections);
  };

  const removeVideo = (sectionIndex: number, videoIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].videos = newSections[sectionIndex].videos.filter(
      (_, i) => i !== videoIndex
    );
    setSections(newSections);
  };

  const updateVideoName = (
    sectionIndex: number,
    videoIndex: number,
    name: string
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].videos[videoIndex] = name;
    setSections(newSections);
  };

  const handleSubmit = async () => {
    if (!courseName.trim()) {
      setError("Course name is required");
      return;
    }

    if (sections.length === 0) {
      setError("Please add at least one section");
      return;
    }

    // Validate sections
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (!section.name.trim()) {
        setError(`Section ${i + 1} name is required`);
        return;
      }
      if (section.videos.some((video) => !video.trim())) {
        setError(`All videos in ${section.name} must have names`);
        return;
      }
    }

    const courseData = {
      title: courseName,
      category: courseCategory,
      description: `Manually created course with ${sections.reduce(
        (total, section) => total + section.videos.length,
        0
      )} videos across ${sections.length} sections`,
      totalModules: sections.reduce(
        (total, section) => total + section.videos.length,
        0
      ),
      sections: sections.map((section) => ({
        name: section.name,
        path: section.name,
        modules: section.videos.map((video) => ({
          name: video,
          path: `${section.name}/${video}`,
          size: 0, // Unknown size for manually created courses
          lastModified: new Date(),
        })),
      })),
      isCompleted: false,
    };

    try {
      const success = await onAddCourse(courseData);
      if (success) {
        setCourseName("");
        setCourseCategory("Web Development");
        setSections([]);
        setError(null);
      } else {
        setError("A course with this name already exists");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Create Course Manually
      </h3>

      <div className="space-y-4">
        {/* Course Name */}
        <div>
          <Label htmlFor="courseName">Course Name</Label>
          <Input
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Enter course name"
          />
        </div>

        {/* Course Category */}
        <div>
          <Label htmlFor="courseCategory">Category</Label>
          <select
            id="courseCategory"
            value={courseCategory}
            onChange={(e) => setCourseCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
          >
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Design">Design</option>
            <option value="Business">Business</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Sections */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Sections</Label>
            <Button onClick={addSection} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Section
            </Button>
          </div>

          {sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4"
            >
              <div className="flex justify-between items-center mb-2">
                <Input
                  value={section.name}
                  onChange={(e) =>
                    updateSectionName(sectionIndex, e.target.value)
                  }
                  placeholder={`Section ${sectionIndex + 1} name`}
                  className="flex-1 mr-2"
                />
                <Button
                  onClick={() => removeSection(sectionIndex)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="ml-4 space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">Videos</Label>
                  <Button
                    onClick={() => addVideo(sectionIndex)}
                    size="sm"
                    variant="outline"
                  >
                    <Video className="w-4 h-4 mr-1" />
                    Add Video
                  </Button>
                </div>

                {section.videos.map((video, videoIndex) => (
                  <div key={videoIndex} className="flex items-center gap-2">
                    <Input
                      value={video}
                      onChange={(e) =>
                        updateVideoName(
                          sectionIndex,
                          videoIndex,
                          e.target.value
                        )
                      }
                      placeholder={`Video ${videoIndex + 1} name`}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeVideo(sectionIndex, videoIndex)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!courseName.trim() || sections.length === 0}
          className="w-full"
        >
          Create Course
        </Button>
      </div>
    </div>
  );
}
