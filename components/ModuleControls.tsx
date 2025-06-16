import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Play,
} from "lucide-react";
import { useState } from "react";

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

interface ModuleControlsProps {
  sections: Section[];
  currentSection: number;
  onSectionChange: (newSection: number) => void;
  currentVideo: number;
  onVideoChange: (newVideo: number) => void;
}

export default function ModuleControls({
  sections,
  currentSection,
  onSectionChange,
  currentVideo,
  onVideoChange,
}: ModuleControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if this is a course without sections (single section with name "All Modules")
  const isSimpleCourse =
    sections.length === 1 && sections[0].name === "All Modules";

  const handlePrevious = () => {
    if (isSimpleCourse) {
      // For simple courses, treat modules as sections
      if (currentVideo > 0) {
        onVideoChange(currentVideo - 1);
      }
    } else {
      // For courses with sections
      if (currentVideo > 0) {
        // Go to previous video in current section
        onVideoChange(currentVideo - 1);
      } else if (currentSection > 0) {
        // Go to last video of previous section
        onSectionChange(currentSection - 1);
        onVideoChange(sections[currentSection - 1].modules.length - 1);
      }
    }
  };

  const handleNext = () => {
    if (isSimpleCourse) {
      // For simple courses, treat modules as sections
      const totalModules = sections[0].modules.length;
      if (currentVideo < totalModules - 1) {
        onVideoChange(currentVideo + 1);
      }
    } else {
      // For courses with sections
      const currentSectionVideos = sections[currentSection].modules;
      if (currentVideo < currentSectionVideos.length - 1) {
        // Go to next video in current section
        onVideoChange(currentVideo + 1);
      } else if (currentSection < sections.length - 1) {
        // Go to first video of next section
        onSectionChange(currentSection + 1);
        onVideoChange(0);
      }
    }
  };

  const handleSectionChange = (sectionIndex: number) => {
    onSectionChange(sectionIndex);
    onVideoChange(0); // Reset to first video of the section
  };

  return (
    <div className="space-y-4">
      {/* Main Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={
            isSimpleCourse
              ? currentVideo === 0
              : currentSection === 0 && currentVideo === 0
          }
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={isSimpleCourse ? "Previous Module" : "Previous Video"}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex-1">
          {isSimpleCourse ? (
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Module {currentVideo + 1} of {sections[0].modules.length}
            </div>
          ) : (
            <>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Section {currentSection + 1}: {sections[currentSection]?.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Video {currentVideo + 1} of{" "}
                {sections[currentSection]?.modules.length}
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={
            isSimpleCourse
              ? currentVideo === sections[0].modules.length - 1
              : currentSection === sections.length - 1 &&
                currentVideo === sections[currentSection].modules.length - 1
          }
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={isSimpleCourse ? "Next Module" : "Next Video"}
        >
          <ChevronRight size={20} />
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title={isExpanded ? "Collapse List" : "Expand List"}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Expanded List */}
      {isExpanded && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {isSimpleCourse ? (
            // Simple course view - just show modules
            <div className="space-y-1">
              {sections[0].modules.map((module, index) => (
                <button
                  key={module.path}
                  onClick={() => onVideoChange(index)}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                    index === currentVideo
                      ? "bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <Play size={16} />
                  <span className="truncate">{module.name}</span>
                </button>
              ))}
            </div>
          ) : (
            // Course with sections view
            sections.map((section, sectionIndex) => (
              <div key={section.path} className="space-y-1">
                <button
                  onClick={() => handleSectionChange(sectionIndex)}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    sectionIndex === currentSection
                      ? "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{section.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {section.modules.length} videos
                    </span>
                  </div>
                </button>

                {sectionIndex === currentSection && (
                  <div className="ml-4 space-y-1">
                    {section.modules.map((video, videoIndex) => (
                      <button
                        key={video.path}
                        onClick={() => onVideoChange(videoIndex)}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                          videoIndex === currentVideo
                            ? "bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <Play size={16} />
                        <span className="truncate">{video.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
