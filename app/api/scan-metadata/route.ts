import { NextResponse } from "next/server";

interface DirectoryStructure {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  lastModified?: Date;
  children?: DirectoryStructure[];
}

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
  totalSize: number;
  totalFiles: number;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const metadataJson = formData.get('metadata') as string;
    
    if (!metadataJson) {
      return NextResponse.json(
        { error: "No metadata provided" },
        { status: 400 }
      );
    }

    // Parse the directory structure metadata
    const directoryStructure: DirectoryStructure[] = JSON.parse(metadataJson);
    
    if (!directoryStructure || directoryStructure.length === 0) {
      return NextResponse.json(
        { error: "Invalid directory structure" },
        { status: 400 }
      );
    }

    // Process the directory structure to extract course info
    const courseStructure = await processDirectoryStructure(directoryStructure);
    
    return NextResponse.json(courseStructure);
  } catch (error) {
    console.error("Error processing course metadata:", error);
    return NextResponse.json(
      { error: "Failed to process course metadata" },
      { status: 500 }
    );
  }
}

async function processDirectoryStructure(structure: DirectoryStructure[]): Promise<CourseStructure> {
  const sectionsMap = new Map<string, Module[]>();
  const rootModules: Module[] = [];
  let totalSize = 0;
  let totalFiles = 0;
  
  // Get course name from the root directory
  const rootDir = structure[0];
  const courseName = rootDir?.name || 'Course';
    function processDirectory(items: DirectoryStructure[]) {
    for (const item of items) {
      if (item.type === 'file') {
        // Check if it's a video file
        const ext = item.name.split('.').pop()?.toLowerCase();
        if (ext && ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm', 'flv', 'm4v'].includes(ext)) {
          const videoModule: Module = {
            name: item.name,
            path: item.path,
            size: item.size || 0,
            lastModified: item.lastModified || new Date(),
          };
          
          totalSize += videoModule.size;
          totalFiles++;
          
          // Determine if this is in a section (subdirectory) or root level
          const pathParts = item.path.split('/').filter(part => part);
          if (pathParts.length > 1) {
            // File is in a subdirectory (section)
            const sectionName = pathParts[pathParts.length - 2];
            
            if (!sectionsMap.has(sectionName)) {
              sectionsMap.set(sectionName, []);
            }
            sectionsMap.get(sectionName)!.push(videoModule);
          } else {
            // File is in root
            rootModules.push(videoModule);
          }
        }
      } else if (item.type === 'directory' && item.children) {
        // Recursively process subdirectories
        processDirectory(item.children);
      }
    }
  }
  
  processDirectory(structure);
  
  // Convert sections map to array
  const sections: Section[] = Array.from(sectionsMap.entries()).map(([name, modules]) => ({
    name,
    path: name,
    modules: modules.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })),
  }));
  
  return {
    name: courseName,
    path: courseName,
    sections: sections.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })),
    modules: rootModules.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })),
    totalSize,
    totalFiles,
  };
}
