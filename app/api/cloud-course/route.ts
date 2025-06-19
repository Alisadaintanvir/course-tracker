import { NextResponse } from "next/server";

// This is a cloud-friendly alternative that works with URL-based course content
// For example: YouTube playlists, Vimeo collections, or cloud storage links

interface CloudModule {
  name: string;
  url: string;
  duration?: string;
  thumbnail?: string;
}

interface CloudSection {
  name: string;
  modules: CloudModule[];
}

interface CloudCourseStructure {
  name: string;
  sections: CloudSection[];
  modules: CloudModule[];
}

export async function POST(request: Request) {
  try {
    const { courseUrl, courseType } = await request.json();

    if (!courseUrl) {
      return NextResponse.json(
        { error: "Course URL is required" },
        { status: 400 }
      );
    }

    // This is a placeholder for different course types
    // You can extend this to support:
    // - YouTube playlists
    // - Vimeo collections
    // - Google Drive folders
    // - Dropbox shared folders
    // - Custom video hosting solutions

    let structure: CloudCourseStructure;

    switch (courseType) {
      case "youtube-playlist":
        structure = await handleYouTubePlaylist(courseUrl);
        break;
      case "manual-urls":
        structure = await handleManualUrls(courseUrl);
        break;
      default:
        return NextResponse.json(
          { error: "Unsupported course type" },
          { status: 400 }
        );
    }

    return NextResponse.json(structure);
  } catch (error) {
    console.error("Error scanning cloud course:", error);
    return NextResponse.json(
      { error: "Failed to scan cloud course" },
      { status: 500 }
    );
  }
}

async function handleYouTubePlaylist(
  playlistUrl: string
): Promise<CloudCourseStructure> {
  // This would require YouTube API integration
  // For now, return a placeholder structure
  const playlistId = extractPlaylistId(playlistUrl);

  return {
    name: `YouTube Playlist ${playlistId}`,
    sections: [
      {
        name: "Main Playlist",
        modules: [
          {
            name: "Sample Video 1",
            url: playlistUrl,
            duration: "10:30",
            thumbnail: "",
          },
        ],
      },
    ],
    modules: [],
  };
}

async function handleManualUrls(
  urlList: string
): Promise<CloudCourseStructure> {
  // Parse manually entered URLs (one per line)
  const urls = urlList.split("\n").filter((url) => url.trim());

  const modules: CloudModule[] = urls.map((url, index) => ({
    name: `Video ${index + 1}`,
    url: url.trim(),
  }));

  return {
    name: "Manual URL Course",
    sections: [],
    modules,
  };
}

function extractPlaylistId(url: string): string {
  const match = url.match(/[?&]list=([^#\&\?]*)/);
  return match ? match[1] : "unknown";
}
