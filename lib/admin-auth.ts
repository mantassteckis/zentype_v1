/**
 * Admin Authentication Middleware
 *
 * Provides authentication and authorization checks for admin-only API routes.
 * Uses Firebase Admin SDK to verify ID tokens and check custom claims.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from '@/lib/firebase-admin';
import { CORRELATION_ID_HEADER } from '@/lib/correlation-id';
import { logger } from '@/lib/structured-logger';

export interface AdminUser {
  uid: string;
  email?: string;
  isAdmin: boolean;
}

/**
 * Verify that the request is from an authenticated admin user
 *
 * @param request - The incoming Next.js request
 * @returns AdminUser object if verification succeeds, null otherwise
 */
export async function verifyAdmin(request: NextRequest): Promise<AdminUser | null> {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Just return null without logging - caller will log
      return null;
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Check if user has admin custom claim
    if (!decodedToken.admin) {
      // Just return null - caller will log forbidden access
      return null;
    }

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      isAdmin: true
    };
  } catch (error) {
    // Return null on error - caller will handle
    return null;
  }
}

/**
 * Higher-order function that wraps an API route handler with admin authentication
 *
 * @param handler - The original API route handler function
 * @returns A wrapped handler that requires admin authentication
 *
 * @example
 * ```typescript
 * async function handleGET(request: NextRequest) {
 *   // This code only runs if user is admin
 *   return NextResponse.json({ data: 'admin-only data' });
 * }
 *
 * export const GET = requireAdmin(handleGET);
 * ```
 */
export function requireAdmin(
  handler: (request: NextRequest, adminUser: AdminUser) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const adminUser = await verifyAdmin(request);

    if (!adminUser) {
      const correlationId = request.headers.get(CORRELATION_ID_HEADER) || 'unknown';
      const errorResponse = NextResponse.json(
        {
          error: 'Forbidden - Admin access required',
          correlationId
        },
        { status: 403 }
      );
      errorResponse.headers.set(CORRELATION_ID_HEADER, correlationId);
      return errorResponse;
    }

    return handler(request, adminUser);
  };
}
