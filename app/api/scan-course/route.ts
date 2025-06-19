import { NextResponse } from "next/server";

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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Group files by their folder structure
    const sectionsMap = new Map<string, Module[]>();
    const rootModules: Module[] = [];

    for (const file of files) {
      // Skip non-video files
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!ext || !["mp4", "avi", "mov", "wmv", "mkv"].includes(ext)) {
        continue;
      }

      // Extract folder structure from webkitRelativePath
      const relativePath =
        (file as File & { webkitRelativePath?: string }).webkitRelativePath ||
        file.name;
      const pathParts = relativePath.split("/");

      const videoModule: Module = {
        name: file.name,
        path: relativePath,
        size: file.size,
        lastModified: new Date(file.lastModified),
      };

      if (pathParts.length > 1) {
        // File is in a subfolder (section)
        const sectionName = pathParts[pathParts.length - 2]; // Get parent folder name

        if (!sectionsMap.has(sectionName)) {
          sectionsMap.set(sectionName, []);
        }
        sectionsMap.get(sectionName)!.push(videoModule);
      } else {
        // File is in root
        rootModules.push(videoModule);
      }
    }

    // Convert sections map to array
    const sections: Section[] = Array.from(sectionsMap.entries()).map(
      ([name, modules]) => ({
        name,
        path: name,
        modules,
      })
    );

    // Get course name from the first file's path or use default
    const firstFile = files[0];
    const firstPath =
      (firstFile as File & { webkitRelativePath?: string })
        .webkitRelativePath || firstFile.name;
    const courseName = firstPath.split("/")[0] || "Uploaded Course";

    const structure: CourseStructure = {
      name: courseName,
      path: courseName,
      sections,
      modules: rootModules,
    };

    return NextResponse.json(structure);
  } catch (error) {
    console.error("Error scanning course:", error);
    return NextResponse.json(
      { error: "Failed to scan course files" },
      { status: 500 }
    );
  }
}
