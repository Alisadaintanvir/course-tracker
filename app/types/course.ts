export interface Video {
  name: string;
  path: string;
  size: number;
  lastModified: Date;
}

export interface Section {
  name: string;
  path: string;
  modules: Video[];
}

export interface CompletionRecord {
  sectionIndex: number;
  videoIndex: number;
  completedAt: Date;
  moduleName: string;
  sectionName: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  totalModules: number;
  currentModule: number;
  lastAccessed: Date;
  sections: Section[];
  currentSection: number;
  currentVideo: number;
  notes?: string;
  isActive?: boolean;
  completionHistory?: CompletionRecord[];
  isCompleted: boolean;
  completedAt?: Date;
}
