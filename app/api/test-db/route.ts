import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    console.log("Testing MongoDB connection...");
    
    // Check environment variable
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { 
          error: "MONGODB_URI environment variable is not set",
          success: false 
        },
        { status: 500 }
      );
    }

    // Test connection
    await connectDB();
    
    // Check connection state
    const connectionState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful",
      connectionState: states[connectionState as keyof typeof states],
      mongooseVersion: mongoose.version,
      uri: process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
    });
  } catch (error) {
    console.error("MongoDB connection test failed:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        mongooseVersion: mongoose.version,
      },
      { status: 500 }
    );
  }
}
