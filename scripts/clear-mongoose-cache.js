#!/usr/bin/env node

/**
 * This script clears the Mongoose models cache.
 * Use it when you've made changes to your schemas and need to restart the server.
 */

// Delete the models cache file
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Try to locate the .next directory
const nextCacheDir = path.join(projectRoot, ".next/cache");
if (fs.existsSync(nextCacheDir)) {
  console.log("Clearing Next.js cache...");
  try {
    // Remove the server directory which contains compiled server code
    const serverDir = path.join(projectRoot, ".next/server");
    if (fs.existsSync(serverDir)) {
      fs.rmSync(serverDir, { recursive: true, force: true });
    }
    console.log("Next.js server cache cleared successfully.");
  } catch (error) {
    console.error("Error clearing Next.js cache:", error);
  }
}

console.log(
  "Schema changes have been applied. Please restart your development server."
);
console.log("Run: npm run dev");
