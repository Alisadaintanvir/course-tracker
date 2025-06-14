import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Course, { ICourse } from "@/models/Course";
import { Document } from "mongoose";

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
    await connectDB();
    const courses = await Course.find({}).sort({ lastAccessed: -1 });
    return NextResponse.json(courses.map(transformCourse));
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const courseData = await request.json();

    const course = await Course.create(courseData);
    console.log("Course created successfully");

    return NextResponse.json(transformCourse(course), { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course", details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(transformCourse(deletedCourse));
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
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

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(transformCourse(updatedCourse));
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}
