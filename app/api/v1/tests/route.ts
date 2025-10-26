import { NextRequest, NextResponse } from 'next/server';
import { PreMadeTest, COLLECTIONS } from '@/lib/types/database';
import { CORRELATION_ID_HEADER } from '@/lib/correlation-id';
import { logger, createApiContext, createTimingContext } from '@/lib/structured-logger';
import { withPerformanceMonitoring } from '@/src/lib/performance-middleware';
import { db } from '@/lib/firebase-admin';

async function handleGET(request: NextRequest) {
  const { startTime } = createTimingContext();
  const context = createApiContext(request, 'GET /api/v1/tests');
  
  try {
    logger.info(context, 'API Route: v1/tests called');
    
    // Extract query parameters
    const { searchParams } = request.nextUrl;
    const difficulty = searchParams.get('difficulty');
    const timeLimit = searchParams.get('timeLimit');
    const category = searchParams.get('category');
    
    // Pagination parameters
    const limitParam = searchParams.get('limit');
    const cursor = searchParams.get('cursor');
    const pageLimit = limitParam ? Math.min(parseInt(limitParam), 50) : 20; // Default 20, max 50
    
    logger.info(context, 'Query parameters extracted', { 
      difficulty, 
      timeLimit, 
      category, 
      limit: pageLimit, 
      cursor: cursor ? 'provided' : 'none' 
    });

    // Create base query using Firebase Admin SDK
    let baseQuery: FirebaseFirestore.Query | FirebaseFirestore.CollectionReference = db.collection(COLLECTIONS.TEST_CONTENTS);

    // Add filters based on query parameters
    if (difficulty) {
      baseQuery = baseQuery.where('difficulty', '==', difficulty);
      logger.info(context, 'Added difficulty filter', { difficulty });
    }

    if (timeLimit) {
      const timeLimitNum = parseInt(timeLimit);
      if (!isNaN(timeLimitNum)) {
        baseQuery = baseQuery.where('timeLimit', '==', timeLimitNum);
        logger.info(context, 'Added timeLimit filter', { timeLimit: timeLimitNum });
      }
    }

    if (category) {
      baseQuery = baseQuery.where('category', '==', category);
      logger.info(context, 'Added category filter', { category });
    }

    // Add ordering for consistent pagination
    baseQuery = baseQuery.orderBy('__name__');
    
    // Add pagination limit (fetch one extra to check if there's a next page)
    baseQuery = baseQuery.limit(pageLimit + 1);

    // Handle cursor-based pagination
    if (cursor) {
      try {
        const cursorDoc = await db.collection(COLLECTIONS.TEST_CONTENTS).doc(cursor).get();
        if (cursorDoc.exists) {
          baseQuery = baseQuery.startAfter(cursorDoc);
          logger.info(context, 'Added cursor pagination', { cursor });
        } else {
          logger.warn(context, 'Invalid cursor provided', { cursor });
        }
      } catch (cursorError) {
        logger.warn(context, 'Error processing cursor', { cursor, error: cursorError });
      }
    }

    // Execute query
    const querySnapshot = await baseQuery.get();
    
    logger.info(context, 'Firestore query executed', { 
      resultsCount: querySnapshot.size 
    });

    // Transform documents to PreMadeTest format
    const allTests: PreMadeTest[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      allTests.push({
        id: doc.id,
        text: data.text || '',
        difficulty: data.difficulty || 'Medium',
        category: data.category || 'General',
        source: data.source || 'Unknown',
        wordCount: data.wordCount || 0,
        timeLimit: data.timeLimit || 60,
        createdAt: data.createdAt || new Date().toISOString(),
      });
    });

    // Determine if there's a next page and prepare response
    const hasNextPage = allTests.length > pageLimit;
    const tests = hasNextPage ? allTests.slice(0, pageLimit) : allTests;
    const nextCursor = hasNextPage ? tests[tests.length - 1].id : null;

    logger.info(context, 'Tests transformed successfully', { 
      testsCount: tests.length,
      hasNextPage,
      nextCursor: nextCursor ? 'provided' : 'none'
    });

    // Create paginated response format
    const responseData = {
      data: tests,
      pagination: {
        nextCursor,
        hasNextPage,
        limit: pageLimit,
        count: tests.length
      }
    };

    const response = NextResponse.json(responseData);
    response.headers.set(CORRELATION_ID_HEADER, context.correlationId || 'unknown');
    
    logger.info(context, 'API Route: v1/tests completed successfully', { 
      testsReturned: tests.length,
      responseTime: Date.now() - startTime 
    });
    
    return response;

  } catch (error) {
    logger.error(context, 'Error in v1/tests API route', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: Date.now() - startTime 
    });

    const errorResponse = NextResponse.json(
      { 
        error: 'Failed to fetch tests',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        correlationId: context.correlationId || 'unknown'
      },
      { status: 500 }
    );
    errorResponse.headers.set(CORRELATION_ID_HEADER, context.correlationId || 'unknown');
    return errorResponse;
  }
}

// Export the handler with performance monitoring
export const GET = withPerformanceMonitoring(handleGET);