# Course Tracker

A comprehensive course progress tracking application built with Next.js, featuring multiple course creation methods that work both locally and in production deployments.

## 🚀 Features

- **Multiple Course Creation Methods**:
  - 📁 **Upload Mode**: Upload entire course folders (local development)
  - ✏️ **Manual Mode**: Create courses manually (works everywhere)
  - 🔗 **URL Mode**: Create courses from video URLs (YouTube, Vimeo, etc.)
- **Progress Tracking**: Track your learning progress across all courses
- **Notes System**: Take and manage notes for each course
- **Dark/Light Theme**: Responsive design with theme switching
- **Authentication**: Secure user authentication with NextAuth.js
- **Cloud-Ready**: Designed to work in both local and production environments

## 🔧 Production Deployment Solution

**Problem**: The original course scanner only worked locally because it relied on file system access.

**Solution**: We've implemented three complementary approaches:

1. **Upload-Based Scanner** (`/components/CourseScanner.tsx`)
   - Uses HTML5 file input with folder upload capability
   - Perfect for local development and modern browsers
   - Maintains original folder structure

2. **Manual Course Creator** (`/components/ManualCourseCreator.tsx`)
   - Form-based course structure creation
   - Works in all environments including production
   - No file system dependencies

3. **URL-Based Course Creator** (`/components/URLCourseCreator.tsx`)
   - Supports YouTube playlists, Vimeo, and direct video URLs
   - Ideal for online courses and cloud deployments
   - Extensible for various video platforms

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- NextAuth.js configuration

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd course-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📂 Project Structure

```
course-tracker/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── scan-course/   # Upload-based course scanner
│   │   └── cloud-course/  # URL-based course processor
│   ├── dashboard/         # Main dashboard
│   └── course/           # Individual course pages
├── components/           # React components
│   ├── CourseScanner.tsx        # Upload-based scanner
│   ├── ManualCourseCreator.tsx  # Manual course creator
│   ├── URLCourseCreator.tsx     # URL-based creator
│   └── ...
└── lib/                 # Utility libraries
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy - the app will automatically use production-ready course creation methods

### Other Platforms
The application is designed to work on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted servers

### Deployment Notes
- **Upload Mode**: May have limitations on some platforms due to file size restrictions
- **Manual Mode**: Works everywhere without limitations
- **URL Mode**: Perfect for production deployments with online courses

## 🔗 Course Creation Methods

### 1. Upload Mode (Local Development)
Best for: Local courses stored on your computer
- Select entire course folders
- Maintains folder structure as sections
- Automatic video file detection

### 2. Manual Mode (Production Ready)
Best for: Any environment, maximum compatibility
- Create course structure by typing section and video names
- No file system dependencies
- Works on all deployment platforms

### 3. URL Mode (Cloud Courses)
Best for: Online courses, YouTube playlists, cloud-hosted content
- YouTube playlist support
- Individual video URLs
- Extensible for other platforms

## 📋 Environment Variables

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Optional: API Keys for enhanced features
YOUTUBE_API_KEY=your_youtube_api_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔧 Technical Details

- **Framework**: Next.js 15 with App Router
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **File Handling**: HTML5 File API + FormData
- **Type Safety**: TypeScript
