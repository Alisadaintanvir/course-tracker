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
}
