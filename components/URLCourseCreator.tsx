"use client";

import { useState } from "react";
import { Link } from "lucide-react";
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

interface URLCourseCreatorProps {
  onAddCourse: (courseData: {
    title: string;
    category: string;
    description: string;
    totalModules: number;
    sections: Section[];
    isCompleted: boolean;
  }) => Promise<boolean>;
}

export default function URLCourseCreator({ onAddCourse }: URLCourseCreatorProps) {
  const [courseName, setCourseName] = useState("");
  const [courseCategory, setCourseCategory] = useState("Web Development");
  const [courseType, setCourseType] = useState<'manual-urls' | 'youtube-playlist'>('manual-urls');
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [videoUrls, setVideoUrls] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateYouTubeUrl = (url: string): boolean => {
    return url.includes('youtube.com') && url.includes('list=');
  };

  const validateVideoUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!courseName.trim()) {
      setError("Course name is required");
      return;
    }

    if (courseType === 'youtube-playlist') {
      if (!playlistUrl.trim()) {
        setError("YouTube playlist URL is required");
        return;
      }
      if (!validateYouTubeUrl(playlistUrl)) {
        setError("Please enter a valid YouTube playlist URL");
        return;
      }
    } else {
      if (!videoUrls.trim()) {
        setError("Video URLs are required");
        return;
      }
      
      const urls = videoUrls.split('\n').filter(url => url.trim());
      const invalidUrls = urls.filter(url => !validateVideoUrl(url.trim()));
      
      if (invalidUrls.length > 0) {
        setError(`Invalid URLs found: ${invalidUrls.slice(0, 3).join(', ')}${invalidUrls.length > 3 ? '...' : ''}`);
        return;
      }
    }

    setIsProcessing(true);
    setError(null);

    try {
      // For now, create a simple structure based on URLs
      // In the future, this could call the cloud-course API
      let sections: Section[] = [];
      let totalModules = 0;

      if (courseType === 'youtube-playlist') {
        // For YouTube playlists, we'll create a single section
        sections = [{
          name: "Playlist Videos",
          path: "playlist",
          modules: [{
            name: "YouTube Playlist",
            path: playlistUrl,
            size: 0,
            lastModified: new Date(),
          }]
        }];
        totalModules = 1; // We don't know the actual count without API access
      } else {
        // For manual URLs, create individual modules
        const urls = videoUrls.split('\n').filter(url => url.trim());
        const modules: Video[] = urls.map((url, index) => ({
          name: `Video ${index + 1}`,
          path: url.trim(),
          size: 0,
          lastModified: new Date(),
        }));

        sections = [{
          name: "Course Videos",
          path: "videos",
          modules
        }];
        totalModules = modules.length;
      }

      const courseData = {
        title: courseName,
        category: courseCategory,
        description: `${courseType === 'youtube-playlist' ? 'YouTube playlist' : 'URL-based'} course with ${totalModules} videos`,
        totalModules,
        sections,
        isCompleted: false,
      };

      const success = await onAddCourse(courseData);
      if (success) {
        setCourseName("");
        setCourseCategory("Web Development");
        setPlaylistUrl("");
        setVideoUrls("");
        setError(null);
      } else {
        setError("A course with this name already exists");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Create Course from URLs
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

        {/* Course Type Selection */}
        <div>
          <Label>Course Type</Label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="manual-urls"
                checked={courseType === 'manual-urls'}
                onChange={(e) => setCourseType(e.target.value as 'manual-urls')}
                className="mr-2"
              />
              Individual Video URLs
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="youtube-playlist"
                checked={courseType === 'youtube-playlist'}
                onChange={(e) => setCourseType(e.target.value as 'youtube-playlist')}
                className="mr-2"
              />
              YouTube Playlist
            </label>
          </div>
        </div>

        {/* URL Input based on type */}
        {courseType === 'youtube-playlist' ? (
          <div>
            <Label htmlFor="playlistUrl">YouTube Playlist URL</Label>
            <Input
              id="playlistUrl"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter a YouTube playlist URL. Make sure the playlist is public.
            </p>
          </div>
        ) : (
          <div>
            <Label htmlFor="videoUrls">Video URLs</Label>
            <textarea
              id="videoUrls"
              value={videoUrls}
              onChange={(e) => setVideoUrls(e.target.value)}
              placeholder={`Enter video URLs, one per line:
https://example.com/video1.mp4
https://youtube.com/watch?v=...
https://vimeo.com/...`}
              rows={6}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent resize-vertical"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supports YouTube, Vimeo, direct video files, and other video URLs
            </p>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isProcessing || !courseName.trim() || 
            (courseType === 'youtube-playlist' ? !playlistUrl.trim() : !videoUrls.trim())}
          className="w-full"
        >
          <Link className="w-4 h-4 mr-2" />
          {isProcessing ? "Creating Course..." : "Create Course from URLs"}
        </Button>
      </div>
    </div>
  );
}
