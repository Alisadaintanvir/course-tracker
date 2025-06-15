import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  category: string;
  description: string;
  totalModules: number;
  currentModule: number;
  lastAccessed: Date;
  sections: {
    name: string;
    path: string;
    modules: {
      name: string;
      path: string;
      size: number;
      lastModified: Date;
    }[];
  }[];
  currentSection: number;
  currentVideo: number;
  notes?: string;
  completionHistory?: {
    sectionIndex: number;
    videoIndex: number;
    completedAt: Date;
    moduleName: string;
    sectionName: string;
  }[];
  isCompleted: boolean;
  completedAt?: Date;
}

const VideoSchema = new Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  lastModified: { type: Date, required: true },
});

const SectionSchema = new Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  modules: [VideoSchema],
});

const CompletionRecordSchema = new Schema({
  sectionIndex: { type: Number, required: true },
  videoIndex: { type: Number, required: true },
  completedAt: { type: Date, required: true },
  moduleName: { type: String, required: true },
  sectionName: { type: String, required: true },
});

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    totalModules: { type: Number, required: true },
    currentModule: { type: Number, required: true, default: 0 },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    sections: [SectionSchema],
    currentSection: { type: Number, required: true, default: 0 },
    currentVideo: { type: Number, required: true, default: 0 },
    notes: { type: String },
    isActive: { type: Boolean, default: false },
    completionHistory: [CompletionRecordSchema],
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
CourseSchema.index({ title: "text", description: "text", category: "text" });

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);
