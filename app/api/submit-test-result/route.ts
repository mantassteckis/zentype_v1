import { NextRequest, NextResponse } from 'next/server';
import { db as adminDb, auth as adminAuth } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/types/database';
import { CORRELATION_ID_HEADER } from '@/lib/correlation-id';
import { logger, createApiContext, createTimingContext } from '@/lib/structured-logger';
import { withPerformanceMonitoring } from '@/src/lib/performance-middleware';
import { FieldValue } from 'firebase-admin/firestore';

// Use Firebase Admin SDK for server-side operations

interface TestResultData {
  wpm: number;
  accuracy: number;
  errors: number;
  timeTaken: number;
  textLength: number;
  userInput: string;
  testType: string;
  difficulty: string;
  testId: string;
}

/**
 * Compute the UTC-local week boundaries for a given date where the week runs Sunday through Saturday.
 *
 * @param date - The reference date used to determine the week
 * @returns An object with `weekStart` set to the Sunday of that week at 00:00:00.000 and `weekEnd` set to the following Saturday at 23:59:59.999
 */
function getWeekBounds(date: Date) {
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay()); // Sunday
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // Saturday
  weekEnd.setHours(23, 59, 59, 999);
  
  return { weekStart, weekEnd };
}

/**
 * Computes the month boundary timestamps for the month containing the given date.
 *
 * @param date - A Date within the target month
 * @returns An object with `monthStart` set to the first day at 00:00:00.000 and `monthEnd` set to the last day at 23:59:59.999
 */
function getMonthBounds(date: Date) {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);
  
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);
  
  return { monthStart, monthEnd };
}

/**
 * Update weekly and monthly leaderboard documents for a user by aggregating metrics from a test result.
 *
 * This function reads the user's profile and the current week's and month's leaderboard documents, then
 * atomically creates or updates those leaderboard entries with updated counts, totals, averages, and best WPM.
 * If the user's profile is missing, the function logs a warning and returns without making changes.
 *
 * @param userId - UID of the user whose leaderboard entries will be updated
 * @param testData - Test result whose metrics (`wpm`, `accuracy`, etc.) are aggregated into the leaderboards
 * @param context - Logging/telemetry context passed to logger calls
 */
async function updateLeaderboardCollections(userId: string, testData: TestResultData, context: any) {
  const now = new Date();
  const { weekStart, weekEnd } = getWeekBounds(now);
  const { monthStart, monthEnd } = getMonthBounds(now);

  // STEP 1: Perform ALL reads first to avoid transaction issues
  const profileRef = adminDb.collection('profiles').doc(userId);
  const weeklyDocId = `${userId}_${weekStart.getFullYear()}_${weekStart.getMonth()}_${weekStart.getDate()}`;
  const monthlyDocId = `${userId}_${monthStart.getFullYear()}_${monthStart.getMonth()}`;
  const weeklyRef = adminDb.collection('leaderboard_weekly').doc(weeklyDocId);
  const monthlyRef = adminDb.collection('leaderboard_monthly').doc(monthlyDocId);

  // Read all documents at once
  const [profileSnap, weeklySnap, monthlySnap] = await Promise.all([
    profileRef.get(),
    weeklyRef.get(),
    monthlyRef.get()
  ]);
  
  if (!profileSnap.exists) {
    logger.warn(context, 'User profile not found for leaderboard update', { userId });
    return;
  }

  const profileData = profileSnap.data();
  const username = profileData?.username || 'Unknown User';

  // STEP 2: Use Firestore batch for atomic writes
  const batch = adminDb.batch();
  
  // Prepare weekly leaderboard update
  if (weeklySnap.exists) {
    const weeklyData = weeklySnap.data();
    const newTestsCompleted = (weeklyData?.testsCompleted || 0) + 1;
    const newTotalWpm = (weeklyData?.totalWpm || 0) + testData.wpm;
    const newTotalAccuracy = (weeklyData?.totalAccuracy || 0) + testData.accuracy;
    const newAvgWpm = newTotalWpm / newTestsCompleted;
    const newAvgAccuracy = newTotalAccuracy / newTestsCompleted;
    const newBestWpm = Math.max(weeklyData?.bestWpm || 0, testData.wpm);

    batch.update(weeklyRef, {
      testsCompleted: newTestsCompleted,
      totalWpm: newTotalWpm,
      totalAccuracy: newTotalAccuracy,
      avgWpm: newAvgWpm,
      avgAccuracy: newAvgAccuracy,
      bestWpm: newBestWpm,
      lastUpdated: FieldValue.serverTimestamp()
    });
  } else {
    batch.set(weeklyRef, {
      userId,
      username,
      testsCompleted: 1,
      totalWpm: testData.wpm,
      totalAccuracy: testData.accuracy,
      avgWpm: testData.wpm,
      avgAccuracy: testData.accuracy,
      bestWpm: testData.wpm,
      weekStart,
      weekEnd,
      createdAt: FieldValue.serverTimestamp(),
      lastUpdated: FieldValue.serverTimestamp()
    });
  }
  
  // Prepare monthly leaderboard update
  if (monthlySnap.exists) {
    const monthlyData = monthlySnap.data();
    const newTestsCompleted = (monthlyData?.testsCompleted || 0) + 1;
    const newTotalWpm = (monthlyData?.totalWpm || 0) + testData.wpm;
    const newTotalAccuracy = (monthlyData?.totalAccuracy || 0) + testData.accuracy;
    const newAvgWpm = newTotalWpm / newTestsCompleted;
    const newAvgAccuracy = newTotalAccuracy / newTestsCompleted;
    const newBestWpm = Math.max(monthlyData?.bestWpm || 0, testData.wpm);

    batch.update(monthlyRef, {
      testsCompleted: newTestsCompleted,
      totalWpm: newTotalWpm,
      totalAccuracy: newTotalAccuracy,
      avgWpm: newAvgWpm,
      avgAccuracy: newAvgAccuracy,
      bestWpm: newBestWpm,
      lastUpdated: FieldValue.serverTimestamp()
    });
  } else {
    batch.set(monthlyRef, {
      userId,
      username,
      testsCompleted: 1,
      totalWpm: testData.wpm,
      totalAccuracy: testData.accuracy,
      avgWpm: testData.wpm,
      avgAccuracy: testData.accuracy,
      bestWpm: testData.wpm,
      monthStart,
      monthEnd,
      createdAt: FieldValue.serverTimestamp(),
      lastUpdated: FieldValue.serverTimestamp()
    });
  }
  
  // STEP 3: Commit the batch
  await batch.commit();
  
  logger.info(context, 'Leaderboard collections updated successfully', { 
    userId, 
    weeklyDocId, 
    monthlyDocId 
  });
}

/**
 * Handles POST requests to submit a typing test result: validates authorization and payload, saves the result to Firestore, and returns a JSON response with a correlation ID.
 *
 * @param request - Incoming NextRequest expected to include an Authorization `Bearer` token header and a JSON body matching `TestResultData`
 * @returns A NextResponse with a JSON payload indicating success or an error and including a `correlationId`; responses use HTTP 200 for success, 400 for validation failures, 401 for authorization failures, and 500 for internal errors.
 */
async function handlePOST(request: NextRequest) {
  const { startTime } = createTimingContext();
  const context = createApiContext(request, 'POST /api/submit-test-result');
  
  try {
    logger.info(context, 'API Route: submit-test-result called');

    // Get and verify the authorization token
    const authHeader = request.headers.get('authorization');
    logger.info(context, 'Auth header validation', { authHeaderPresent: !!authHeader });

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(context, 'No valid auth header provided');
      const correlationId = request.headers.get(CORRELATION_ID_HEADER) || 'unknown';
      const errorResponse = NextResponse.json(
        { error: 'Unauthorized - No valid token provided', correlationId },
        { status: 401 }
      );
      errorResponse.headers.set(CORRELATION_ID_HEADER, correlationId);
      logger.logRequest(context, startTime, 401, { reason: 'No valid auth header' });
      return errorResponse;
    }

    const idToken = authHeader.split('Bearer ')[1];
    let userId: string;

    try {
      // Verify token using Firebase Admin SDK
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      userId = decodedToken.uid;
      logger.info(context, 'Token verified successfully', { userId });
    } catch (error) {
      logger.error(context, error instanceof Error ? error : new Error(String(error)), {
        message: 'Token verification failed'
      });
      const correlationId = request.headers.get(CORRELATION_ID_HEADER) || 'unknown';
      const errorResponse = NextResponse.json(
        { error: 'Unauthorized - Invalid token', correlationId },
        { status: 401 }
      );
      errorResponse.headers.set(CORRELATION_ID_HEADER, correlationId);
      logger.logRequest(context, startTime, 401, { reason: 'Token verification failed' });
      return errorResponse;
    }
    const testData: TestResultData = await request.json();
    logger.info(context, 'Test data received', { 
      wpm: testData.wpm, 
      accuracy: testData.accuracy, 
      testType: testData.testType,
      difficulty: testData.difficulty
    });

    // Validate the test data
    const validationErrors: string[] = [];
    
    if (isNaN(testData.wpm) || !isFinite(testData.wpm) || testData.wpm < 0 || testData.wpm > 400) {
      validationErrors.push("WPM must be a valid number between 0 and 400");
    }
    
    if (isNaN(testData.accuracy) || !isFinite(testData.accuracy) || testData.accuracy < 0 || testData.accuracy > 100) {
      validationErrors.push("Accuracy must be a valid number between 0 and 100");
    }
    
    if (isNaN(testData.errors) || !isFinite(testData.errors) || testData.errors < 0) {
      validationErrors.push("Errors must be a valid non-negative number");
    }
    
    if (isNaN(testData.timeTaken) || !isFinite(testData.timeTaken) || testData.timeTaken <= 0) {
      validationErrors.push("Time taken must be a valid positive number");
    }
    
    if (isNaN(testData.textLength) || !isFinite(testData.textLength) || testData.textLength <= 0) {
      validationErrors.push("Text length must be a valid positive number");
    }
    
    if (!testData.userInput || typeof testData.userInput !== "string") {
      validationErrors.push("User input is required");
    }
    
    if (!testData.testType || typeof testData.testType !== "string") {
      validationErrors.push("Test type is required");
    }
    
    if (!testData.difficulty || typeof testData.difficulty !== "string") {
      validationErrors.push("Difficulty is required");
    }
    
    if (!testData.testId || typeof testData.testId !== "string") {
      validationErrors.push("Test ID is required");
    }

    if (validationErrors.length > 0) {
      logger.warn(context, 'Test data validation failed', { validationErrors });
      const correlationId = request.headers.get(CORRELATION_ID_HEADER) || 'unknown';
      const errorResponse = NextResponse.json(
        { error: 'Validation failed', details: validationErrors, correlationId },
        { status: 400 }
      );
      errorResponse.headers.set(CORRELATION_ID_HEADER, correlationId);
      logger.logRequest(context, startTime, 400, { validationErrors });
      return errorResponse;
    }

    // Simple approach: Just save the test result for now
    // We'll handle stats updates separately to avoid transaction complexity
    const testResultData = {
      userId: userId,
      wpm: testData.wpm,
      accuracy: testData.accuracy,
      errors: testData.errors,
      timeTaken: testData.timeTaken,
      textLength: testData.textLength,
      userInput: testData.userInput,
      testType: testData.testType,
      difficulty: testData.difficulty,
      testId: testData.testId,
      createdAt: new Date(),
    };
    
    logger.info(context, 'Attempting to save test result', {
      userId,
      testType: testResultData.testType,
      difficulty: testResultData.difficulty
    });

    try {
      logger.info(context, 'Creating document in testResults collection');
      const testResultsRef = adminDb.collection('testResults');

      const docRef = await testResultsRef.add(testResultData);
      logger.info(context, 'Test result saved successfully', { documentId: docRef.id });

      // Leaderboard update functionality temporarily removed to avoid transaction issues
      logger.info(context, 'Test result saved successfully without leaderboard update');
    } catch (firestoreError) {
      logger.error(context, firestoreError instanceof Error ? firestoreError : new Error(String(firestoreError)), {
        firestoreErrorCode: (firestoreError as any).code
      });
      throw firestoreError;
    }

    const correlationId = request.headers.get(CORRELATION_ID_HEADER) || 'unknown';
    const successResponse = NextResponse.json({ 
      success: true, 
      message: 'Test result saved successfully',
      correlationId
    });
    successResponse.headers.set(CORRELATION_ID_HEADER, correlationId);
    
    logger.logRequest(context, startTime, 200, { userId, testSaved: true });
    return successResponse;

  } catch (error) {
    logger.error(context, error instanceof Error ? error : new Error(String(error)), {
      errorType: typeof error
    });
    
    const correlationId = request.headers.get(CORRELATION_ID_HEADER) || 'unknown';
    const errorResponse = NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        type: typeof error,
        correlationId
      },
      { status: 500 }
    );
    errorResponse.headers.set(CORRELATION_ID_HEADER, correlationId);
    
    logger.logRequest(context, startTime, 500, { 
      errorMessage: error instanceof Error ? error.message : String(error)
    });
    return errorResponse;
  }
}

// Export the performance-monitored version
export const POST = withPerformanceMonitoring(handlePOST, {
  enablePayloadTracking: true,
  slowRequestThreshold: 2000, // 2 seconds for database operations
  maxPayloadSizeToLog: 5000
});
