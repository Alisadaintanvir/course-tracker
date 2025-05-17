import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
    const { coursePath } = await request.json();

    if (!coursePath) {
      return NextResponse.json(
        { error: "Course path is required" },
        { status: 400 }
      );
    }

    // Normalize the path for Windows
    const normalizedPath = coursePath.replace(/[\/\\]/g, path.sep);

    console.log("Processing path:", {
      originalPath: coursePath,
      normalizedPath,
    });

    // Check if the path exists
    if (!fs.existsSync(normalizedPath)) {
      return NextResponse.json(
        {
          error: `Course path does not exist: ${coursePath}. Please make sure the path is correct and the directory exists.`,
        },
        { status: 400 }
      );
    }

    // Get directory name as course name
    const courseName = path.basename(normalizedPath);
    console.log("Course name:", courseName);
    console.log("Full path:", normalizedPath);

    // Scan the directory structure
    const structure: CourseStructure = {
      name: courseName,
      path: normalizedPath,
      sections: [],
      modules: [],
    };

    // Read directory contents
    const items = fs.readdirSync(normalizedPath);

    // Process each item in the directory
    for (const item of items) {
      const itemPath = path.join(normalizedPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        // It's a section
        const section: Section = {
          name: item,
          path: itemPath,
          modules: [],
        };

        // Read section contents
        const sectionItems = fs.readdirSync(itemPath);
        for (const sectionItem of sectionItems) {
          const modulePath = path.join(itemPath, sectionItem);
          const moduleStats = fs.statSync(modulePath);

          if (moduleStats.isFile()) {
            // Only include video files
            const ext = path.extname(sectionItem).toLowerCase();
            if ([".mp4", ".avi", ".mov", ".wmv", ".mkv"].includes(ext)) {
              section.modules.push({
                name: sectionItem,
                path: modulePath,
                size: moduleStats.size,
                lastModified: moduleStats.mtime,
              });
            }
          }
        }

        structure.sections.push(section);
      } else if (stats.isFile()) {
        // It's a root level module (only include video files)
        const ext = path.extname(item).toLowerCase();
        if ([".mp4", ".avi", ".mov", ".wmv", ".mkv"].includes(ext)) {
          structure.modules.push({
            name: item,
            path: itemPath,
            size: stats.size,
            lastModified: stats.mtime,
          });
        }
      }
    }

    return NextResponse.json(structure);
  } catch (error) {
    console.error("Error scanning course:", error);
    return NextResponse.json(
      { error: "Failed to scan course directory" },
      { status: 500 }
    );
  }
}
