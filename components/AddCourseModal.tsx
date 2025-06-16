import { X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courseData: CourseData) => void;
}

interface CourseData {
  title: string;
  category: string;
  description?: string;
  totalModules: number;
  sections: Section[];
  isCompleted: boolean;
  currentSection: number;
  currentVideo: number;
}

interface Section {
  name: string;
  path: string;
  modules: Video[];
}

interface Video {
  name: string;
  path: string;
  size: number;
  lastModified: Date;
}

export default function AddCourseModal({
  isOpen,
  onClose,
  onSubmit,
}: AddCourseModalProps) {
  const [useSections, setUseSections] = useState(false);
  const [totalModules, setTotalModules] = useState(1);
  const [sections, setSections] = useState<Section[]>([
    {
      name: "Section 1",
      path: "",
      modules: [
        { name: "Module 1", path: "", size: 0, lastModified: new Date() },
      ],
    },
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let courseData: CourseData;

    if (useSections) {
      // Validate that all sections have at least one module
      const validSections = sections.filter(
        (section) => section.modules.length > 0
      );
      if (validSections.length === 0) {
        alert("Please add at least one module to your course");
        return;
      }

      courseData = {
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        description: formData.get("description") as string,
        totalModules: validSections.reduce(
          (acc, section) => acc + section.modules.length,
          0
        ),
        sections: validSections.map((section) => ({
          ...section,
          path:
            section.path ||
            `/sections/${section.name.toLowerCase().replace(/\s+/g, "-")}`,
          modules: section.modules.map((module) => ({
            ...module,
            path:
              module.path ||
              `/modules/${module.name.toLowerCase().replace(/\s+/g, "-")}`,
          })),
        })),
        isCompleted: false,
        currentSection: 0,
        currentVideo: 0,
      };
    } else {
      // Create a single section with the specified number of modules
      const modules = Array.from({ length: totalModules }, (_, i) => ({
        name: `Module ${i + 1}`,
        path: `/modules/module-${i + 1}`,
        size: 0,
        lastModified: new Date(),
      }));

      courseData = {
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        description: formData.get("description") as string,
        totalModules: totalModules,
        sections: [
          {
            name: "All Modules",
            path: "/sections/all-modules",
            modules: modules,
          },
        ],
        isCompleted: false,
        currentSection: 0,
        currentVideo: 0,
      };
    }

    onSubmit(courseData);
    onClose();
  };

  const addSection = () => {
    const newSectionNumber = sections.length + 1;
    setSections([
      ...sections,
      {
        name: `Section ${newSectionNumber}`,
        path: "",
        modules: [
          { name: `Module 1`, path: "", size: 0, lastModified: new Date() },
        ],
      },
    ]);
  };

  const removeSection = (index: number) => {
    if (sections.length > 1) {
      setSections(sections.filter((_, i) => i !== index));
    } else {
      alert("You must have at least one section");
    }
  };

  const addModule = (sectionIndex: number) => {
    const newSections = [...sections];
    const moduleNumber = newSections[sectionIndex].modules.length + 1;
    newSections[sectionIndex].modules.push({
      name: `Module ${moduleNumber}`,
      path: "",
      size: 0,
      lastModified: new Date(),
    });
    setSections(newSections);
  };

  const removeModule = (sectionIndex: number, moduleIndex: number) => {
    const newSections = [...sections];
    if (newSections[sectionIndex].modules.length > 1) {
      newSections[sectionIndex].modules = newSections[
        sectionIndex
      ].modules.filter((_, i) => i !== moduleIndex);
      setSections(newSections);
    } else {
      alert("You must have at least one module in each section");
    }
  };

  const updateSection = (
    index: number,
    field: keyof Section,
    value: string
  ) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
  };

  const updateModule = (
    sectionIndex: number,
    moduleIndex: number,
    field: keyof Video,
    value: string | number | Date
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].modules[moduleIndex] = {
      ...newSections[sectionIndex].modules[moduleIndex],
      [field]: value,
    };
    setSections(newSections);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Add New Course
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Course Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., Next.js Masterclass"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Design">Design</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Brief description of the course..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useSections"
                checked={useSections}
                onChange={(e) => setUseSections(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="useSections"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Use Sections (Optional)
              </label>
            </div>

            {useSections ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Sections and Modules
                  </h3>
                  <button
                    type="button"
                    onClick={addSection}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    <Plus size={16} />
                    Add Section
                  </button>
                </div>

                {sections.map((section, sectionIndex) => (
                  <div
                    key={sectionIndex}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">
                        Section {sectionIndex + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeSection(sectionIndex)}
                        className="text-gray-400 hover:text-rose-600 dark:text-gray-500 dark:hover:text-rose-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={section.name}
                        onChange={(e) =>
                          updateSection(sectionIndex, "name", e.target.value)
                        }
                        placeholder="Section Name"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={section.path}
                        onChange={(e) =>
                          updateSection(sectionIndex, "path", e.target.value)
                        }
                        placeholder="Section Path"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Modules
                        </h5>
                        <button
                          type="button"
                          onClick={() => addModule(sectionIndex)}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                        >
                          <Plus size={14} />
                          Add Module
                        </button>
                      </div>

                      {section.modules.map((module, moduleIndex) => (
                        <div
                          key={moduleIndex}
                          className="flex gap-2 items-center"
                        >
                          <input
                            type="text"
                            value={module.name}
                            onChange={(e) =>
                              updateModule(
                                sectionIndex,
                                moduleIndex,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Module Name"
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            value={module.path}
                            onChange={(e) =>
                              updateModule(
                                sectionIndex,
                                moduleIndex,
                                "path",
                                e.target.value
                              )
                            }
                            placeholder="Module Path"
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeModule(sectionIndex, moduleIndex)
                            }
                            className="text-gray-400 hover:text-rose-600 dark:text-gray-500 dark:hover:text-rose-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <label
                  htmlFor="totalModules"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Total Modules
                </label>
                <input
                  type="number"
                  id="totalModules"
                  value={totalModules}
                  onChange={(e) =>
                    setTotalModules(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Number of modules in the course"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-colors"
            >
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
