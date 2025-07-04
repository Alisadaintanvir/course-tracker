import { NextResponse } from "next/server";
import Course, { ICourse } from "@/schemas/Course";
import { Document } from "mongoose";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";

const transformCourse = (course: Document & ICourse) => {
  const courseObj = course.toObject();
  return {
    ...courseObj,
    id: courseObj._id.toString(),
    _id: undefined,
  };
};

export async function GET() {
  try {
    // Connect to database first
    await connectDB();

    const session = await auth();

    // Check for authentication
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const courses = await Course.find({ userId: session.user.id }).sort({
      lastAccessed: -1,
    });

    return NextResponse.json(courses.map(transformCourse));
  } catch (error) {
    console.error("Error in GET /api/courses:", error);

    // Provide more specific error information
    if (error instanceof Error) {
      if (error.message.includes("buffering timed out")) {
        return NextResponse.json(
          {
            error:
              "Database connection timeout. Please check your MongoDB connection.",
          },
          { status: 503 }
        );
      }
      if (
        error.message.includes("ENOTFOUND") ||
        error.message.includes("ECONNREFUSED")
      ) {
        return NextResponse.json(
          {
            error: "Cannot connect to database. Please check your MONGODB_URI.",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Connect to database first
    await connectDB();

    const session = await auth();

    // Check for authentication
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }    const courseData = await request.json();

    // Add userId to the course data
    const courseWithUser = {
      ...courseData,
      userId: session.user.id,
    };

    const course = await Course.create(courseWithUser);

    return NextResponse.json(transformCourse(course), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/courses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    // Check for authentication
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Only delete if the course belongs to the current user
    const deletedCourse = await Course.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!deletedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(transformCourse(deletedCourse));
  } catch (error) {
    console.error("Error in DELETE /api/courses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // Connect to database first
    await connectDB();

    const session = await auth();

    // Check for authentication
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const courseData = await request.json();

    // Ensure we're updating the isActive field
    const updateData = {
      ...courseData,
      isActive: courseData.isActive ?? false,
    };

    // Only update if the course belongs to the current user
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: updateData },
      { new: true }
    );

    if (!updatedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(transformCourse(updatedCourse));
  } catch (error) {
    console.error("Error in PATCH /api/courses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
