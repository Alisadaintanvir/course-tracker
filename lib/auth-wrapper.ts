/**
 * Authentication wrapper for API requests
 * Ensures that all API requests are properly authenticated
 */

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";

export interface AuthenticatedRequest extends NextRequest {
  userId: string;
  session: Session;
}

export async function withAuth<T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>,
  request: NextRequest,
  ...args: T
): Promise<NextResponse> {
  try {
    const session = await auth();    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Attach user info to the request
    (request as AuthenticatedRequest).userId = session.user.id;
    (request as AuthenticatedRequest).session = session;

    return await handler(request, ...args);
  } catch (error) {
    console.error("Error in authentication wrapper:", error);
    return NextResponse.json(
      { error: "Authentication error" },
      { status: 500 }
    );
  }
}
