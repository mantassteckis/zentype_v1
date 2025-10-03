# API Endpoints Documentation# API Endpoints Documentation



**Last Updated:** October 3, 2025  **Last Updated:** October 3, 2025  

**API Version:** v1  **API Version:** v1  

**Status:** Production Ready  **Status:** Production Ready  



This document provides comprehensive documentation for all ZenType API endpoints, including Next.js API routes and Firebase Cloud Functions.This document provides comprehensive documentation for all ZenType API endpoints, including Next.js API routes and Firebase Cloud Functions.



------



## 📋 Table of Contents## 📋 Table of Contents



1. [Next.js API Routes](#nextjs-api-routes)1. [Next.js API Routes](#nextjs-api-routes)

   - [GET /api/v1/tests](#get-apiv1tests)   - [GET /api/v1/tests](#get-apiv1tests)

   - [POST /api/submit-test-result](#post-apisubmit-test-result)   - [POST /api/submit-test-result](#post-apisubmit-test-result)

2. [Firebase Cloud Functions](#firebase-cloud-functions)2. [Firebase Cloud Functions](#firebase-cloud-functions)

   - [generateAiTest](#generateaitest)   - [generateAiTest](#generateaitest)

   - [submitTestResult](#submittestresult)   - [submitTestResult](#submittestresult)

3. [Rate Limiting](#rate-limiting)3. [Rate Limiting](#rate-limiting)

4. [CORS Configuration](#cors-configuration)4. [CORS Configuration](#cors-configuration)

5. [Planned Endpoints](#planned-endpoints)5. [Legacy Endpoints](#legacy-endpoints-deprecated)

6. [Legacy Endpoints](#legacy-endpoints-deprecated)

---

---

## Next.js API Routes

## Next.js API Routes

### GET /api/v1/tests

### GET /api/v1/tests

Retrieves pre-made typing tests with optional filtering and pagination support.

Retrieves pre-made typing tests with optional filtering and pagination support.

**Status:** ✅ Fully Implemented  

**Status:** ✅ Fully Implemented  **Authentication:** Not Required

**Authentication:** Not Required

#### Query Parameters

#### Query Parameters

| Parameter | Type | Required | Description |

| Parameter | Type | Required | Description ||-----------|------|----------|-------------|

|-----------|------|----------|-------------|| `difficulty` | string | No | Filter tests by difficulty level (`Easy`, `Medium`, `Hard`) |

| `difficulty` | string | No | Filter tests by difficulty level (`Easy`, `Medium`, `Hard`) || `timeLimit` | number | No | Filter tests by time limit in seconds |

| `timeLimit` | number | No | Filter tests by time limit in seconds || `category` | string | No | Filter tests by category |

| `category` | string | No | Filter tests by category || `limit` | number | No | Number of tests to return per page (default: 20, max: 50) |

| `limit` | number | No | Number of tests to return per page (default: 20, max: 50) || `cursor` | string | No | Cursor for pagination (document ID from previous page) |

| `cursor` | string | No | Cursor for pagination (document ID from previous page) |

#### Response Format

#### Response Format

```json

```json{

{  "data": [

  "data": [    {

    {      "id": "test_id",

      "id": "test_id",      "source": "Test Source",

      "source": "Test Source",      "difficulty": "Easy|Medium|Hard",

      "difficulty": "Easy|Medium|Hard",      "timeLimit": 60,

      "timeLimit": 60,      "wordCount": 150,

      "wordCount": 150,      "text": "Test content...",

      "text": "Test content...",      "category": "general"

      "category": "general"    }

    }  ],

  ],  "pagination": {

  "pagination": {    "nextCursor": "document_id_or_null",

    "nextCursor": "document_id_or_null",    "hasNextPage": true,

    "hasNextPage": true,    "currentPage": 1,

    "currentPage": 1,    "totalResults": 45

    "totalResults": 45  }

  }}

}```

```

#### Error Response

#### Error Response

```json

```json{

{  "error": "Error message",

  "error": "Error message",  "details": "Additional error details"

  "details": "Additional error details"}

}```

```

#### Examples

#### Examples

**Basic request:**

**Basic request:**```

```GET /api/v1/tests

GET /api/v1/tests```

```

**Filtered request:**

**Filtered request:**```

```GET /api/v1/tests?difficulty=Easy&timeLimit=60

GET /api/v1/tests?difficulty=Easy&timeLimit=60```

```

**Paginated request:**

**Paginated request:**```

```GET /api/v1/tests?limit=10&cursor=test_doc_id_123

GET /api/v1/tests?limit=10&cursor=test_doc_id_123```

```

#### Implementation Notes

#### Implementation Notes

- Uses cursor-based pagination for consistent results

- Uses cursor-based pagination for consistent results- Tests are ordered by creation date (newest first)

- Tests are ordered by creation date (newest first)- Cursor is the document ID of the last item in the current page

- Cursor is the document ID of the last item in the current page- Maximum limit is enforced server-side to prevent performance issues

- Maximum limit is enforced server-side to prevent performance issues- All filters are applied before pagination

- All filters are applied before pagination

---

---

### POST /api/submit-test-result

### POST /api/submit-test-result

**Status:** ✅ Fully Implemented (Proxy to Cloud Function)  

**Status:** ✅ Fully Implemented (Proxy to Cloud Function)  **Authentication:** Required  

**Authentication:** Required  **Purpose:** Proxy endpoint that validates authentication and forwards to submitTestResult Cloud Function

**Purpose:** Proxy endpoint that validates authentication and forwards to submitTestResult Cloud Function

This endpoint serves as a bridge between the Next.js frontend and the Firebase Cloud Function, handling authentication validation before forwarding the request.

This endpoint serves as a bridge between the Next.js frontend and the Firebase Cloud Function, handling authentication validation before forwarding the request.

**Request Body:**

#### Request Body```json

{

```json  "wpm": 75,

{  "accuracy": 95.5,

  "wpm": 75,  "errors": 3,

  "accuracy": 95.5,  "timeTaken": 58,

  "errors": 3,  "textLength": 450,

  "timeTaken": 58,  "userInput": "user typed text...",

  "textLength": 450,  "testType": "practice|ai-generated",

  "userInput": "user typed text...",  "difficulty": "Easy|Medium|Hard",

  "testType": "practice|ai-generated",  "testId": "optional_test_id"

  "difficulty": "Easy|Medium|Hard",}

  "testId": "optional_test_id"```

}

```**Response Format:**

```json

#### Response Format{

  "success": true,

```json  "message": "Test result submitted successfully"

{}

  "success": true,```

  "message": "Test result submitted successfully"

}**Error Responses:**

```

Authentication required (401):

#### Error Responses```json

{

**Authentication required (401):**  "error": "Authentication required"

```json}

{```

  "error": "Authentication required"

}Validation error (400):

``````json

{

**Validation error (400):**  "error": "Invalid test data",

```json  "details": "Validation error details"

{}

  "error": "Invalid test data",```

  "details": "Validation error details"

}---

```

## Firebase Cloud Functions

---

### generateAiTest

## Firebase Cloud Functions

**Status:** ✅ Fully Implemented  

### generateAiTest**Type:** Firebase Cloud Function (Callable)  

**Purpose:** Generate AI-powered typing tests using Google Gemini AI  

**Status:** ✅ Fully Implemented  **Authentication:** Required  

**Type:** Firebase Cloud Function (Callable)  **Rate Limit:** 20 requests per hour per user

**Purpose:** Generate AI-powered typing tests using Google Gemini AI  

**Authentication:** Required  #### Request Body

**Rate Limit:** 20 requests per hour per user

```json

Generates personalized typing tests based on user preferences and interests.{

  "testData": {

#### Request Body    "testId": "string",

    "testType": "practice|ai",

```typescript    "source": "string",

{    "difficulty": "Easy|Medium|Hard",

  topic: string;           // Topic for test generation    "timeLimit": 60,

  difficulty: 'Easy' | 'Medium' | 'Hard';    "wordCount": 150,

  timeLimit?: number;      // Optional: 30, 60, 120, 300 seconds    "text": "Test content..."

  saveTest: boolean;       // Whether to save to aiGeneratedTests collection  },

  userInterests?: string[]; // Optional: user interests for personalization  "results": {

}    "wpm": 75,

```    "accuracy": 95.5,

    "timeSpent": 58,

#### Response Format    "errors": 3,

    "completedAt": "2025-01-23T10:30:00Z"

```typescript  }

{}

  success: boolean;```

  text: string;           // Generated typing test content

  testId?: string;        // ID if saved to Firestore#### Response Format

  wordCount: number;      // Word count of generated text

  saved: boolean;         // Whether test was saved```json

  userInterestsIncluded: boolean;{

  message: string;  "success": true,

}  "testResultId": "document_id",

```  "message": "Test result submitted successfully"

}

#### Error Responses```



**Rate limit exceeded (429):**#### Error Responses

```json

{**Rate limit exceeded (429):**

  "error": "Rate limit exceeded. Please try again later."```json

}{

```  "error": "Rate limit exceeded. Please try again later."

}

**Authentication required (401):**```

```json

{**Authentication required (401):**

  "error": "Authentication required"```json

}{

```  "error": "Authentication required"

}

**AI generation failed (500):**```

```json

{**Validation error (400):**

  "error": "Failed to generate test",```json

  "details": "AI service error details"{

}  "error": "Invalid test data",

```  "details": "Validation error details"

}

---```



### submitTestResult### generateAiTest



**Status:** ✅ Fully Implemented  **Endpoint:** Firebase Cloud Function  

**Type:** Firebase Cloud Function (Callable)  **Method:** POST  

**Purpose:** Save typing test results and update user statistics  **Authentication:** Required  

**Authentication:** Required  **Rate Limit:** 20 requests per hour per user

**Rate Limit:** 100 requests per hour per user

Generates AI-powered typing tests using Google Gemini.

Submits test results for both practice and AI-generated tests. Updates user statistics including average WPM, accuracy, and total tests completed.

#### Request Body

#### Request Body

```json

```typescript{

{  "difficulty": "Easy|Medium|Hard",

  wpm: number;  "timeLimit": 60,

  accuracy: number;  "category": "general|programming|literature",

  errors: number;  "customPrompt": "Optional custom prompt for test generation"

  timeTaken: number;      // in seconds}

  textLength: number;```

  userInput: string;

  testType: string;       // 'practice', 'ai-generated', etc.#### Response Format

  difficulty: string;     // 'Easy', 'Medium', 'Hard'

  testId?: string;        // Optional for practice tests```json

}{

```  "success": true,

  "test": {

#### Response Format    "id": "generated_test_id",

    "source": "AI Generated",

```typescript    "difficulty": "Easy",

{    "timeLimit": 60,

  success: boolean;    "wordCount": 150,

  message: string;    "text": "Generated test content...",

  testResultId?: string;  // Document ID of saved result    "category": "general"

}  }

```}

```

#### Error Responses

#### Error Responses

**Rate limit exceeded (429):**

```json**Rate limit exceeded (429):**

{```json

  "error": "Rate limit exceeded. Please try again later."{

}  "error": "Rate limit exceeded. Please try again later."

```}

```

**Authentication required (401):**

```json**AI generation failed (500):**

{```json

  "error": "Authentication required"{

}  "error": "Failed to generate test",

```  "details": "AI service error details"

}

**Validation error (400):**```

```json

{---

  "error": "Invalid test data",

  "details": "Validation error details"## Legacy Endpoints (Deprecated)

}

```### POST /api/submit-test-result



---**Status:** Deprecated - Use Firebase Cloud Function `submitTestResult` instead  

**Removal Date:** TBD

## Rate Limiting

### GET /api/tests

All Firebase Cloud Functions implement rate limiting using `firebase-functions-rate-limiter` with Firestore backend:

**Status:** Deprecated - Use `/api/v1/tests` instead  

- **generateAiTest:** 20 requests per hour per authenticated user**Removal Date:** TBD

- **submitTestResult:** 100 requests per hour per authenticated user

---

Rate limits are enforced per user ID and reset every hour. When exceeded, endpoints return HTTP 429 with appropriate error messages.

## Rate Limiting

### Rate Limit Headers

All Firebase Cloud Functions implement rate limiting using `firebase-functions-rate-limiter` with Firestore backend:

All responses include rate limit information:

```- **submitTestResult:** 100 requests per hour per authenticated user

X-RateLimit-Limit: 20- **generateAiTest:** 20 requests per hour per authenticated user

X-RateLimit-Remaining: 15

X-RateLimit-Reset: 1672531200Rate limits are enforced per user ID and reset every hour. When exceeded, endpoints return HTTP 429 with appropriate error messages.

```

---

---

## CORS Configuration

## CORS Configuration

Firebase Cloud Functions are configured with explicit CORS whitelisting for security:

Firebase Cloud Functions are configured with explicit CORS whitelisting for security:

### **Allowed Origins**

### Allowed Origins

#### **Development Environments**

#### Development Environments- `http://localhost:3000` and `https://localhost:3000`

- `http://localhost:3000` and `https://localhost:3000`- `http://127.0.0.1:3000` and `https://127.0.0.1:3000`

- `http://127.0.0.1:3000` and `https://127.0.0.1:3000`- `http://localhost:3001` and `https://localhost:3001`

- `http://localhost:3001` and `https://localhost:3001`- `http://127.0.0.1:3001` and `https://127.0.0.1:3001`

- `http://127.0.0.1:3001` and `https://127.0.0.1:3001`

#### **Production Environments**

#### Production Environments- `https://zentype-v0--solotype-23c1f.europe-west4.hosted.app` (Firebase App Hosting)

- `https://zentype-v0--solotype-23c1f.europe-west4.hosted.app` (Firebase App Hosting)- `https://solotype-23c1f.web.app` (Firebase Hosting)

- `https://solotype-23c1f.web.app` (Firebase Hosting)- `https://solotype-23c1f.firebaseapp.com` (Firebase Hosting Alternative)

- `https://solotype-23c1f.firebaseapp.com` (Firebase Hosting Alternative)

### **CORS Security Notes**

### CORS Security Notes- **No wildcard origins** - Only explicitly whitelisted domains are allowed

- **No wildcard origins** - Only explicitly whitelisted domains are allowed- **HTTPS enforced** for all production domains

- **HTTPS enforced** for all production domains- **Preflight requests** (OPTIONS) are automatically handled by Firebase

- **Preflight requests** (OPTIONS) are automatically handled by Firebase- **Cross-origin credentials** are supported for authenticated requests

- **Cross-origin credentials** are supported for authenticated requests

### **Troubleshooting CORS Issues**

### Troubleshooting CORS Issues

If you encounter CORS errors:

If you encounter CORS errors:

1. **Check the origin:** Ensure your domain is in the whitelist above

1. **Check the origin:** Ensure your domain is in the whitelist above2. **Verify HTTPS:** Production domains must use HTTPS

2. **Verify HTTPS:** Production domains must use HTTPS3. **Browser console:** Look for specific CORS error messages

3. **Browser console:** Look for specific CORS error messages4. **GCP logs:** Check if OPTIONS requests are succeeding but POST requests are blocked

4. **GCP logs:** Check if OPTIONS requests are succeeding but POST requests are blocked

**Common CORS Error:**

**Common CORS Error:**```

```Access to fetch at 'https://us-central1-solotype-23c1f.cloudfunctions.net/generateAiTest' 

Access to fetch at 'https://us-central1-solotype-23c1f.cloudfunctions.net/generateAiTest' from origin 'https://your-domain.com' has been blocked by CORS policy

from origin 'https://your-domain.com' has been blocked by CORS policy```

```

**Solution:** Add your domain to the CORS whitelist in `functions/src/index.ts` and redeploy.

**Solution:** Add your domain to the CORS whitelist in `functions/src/index.ts` and redeploy.

---

---

**Last Updated:** October 2, 2025  

## Planned Endpoints**API Version:** v1  

**Status:** Production Ready  

These endpoints are planned for future implementation:**Recent Updates:** CORS configuration updated for Firebase App Hosting deployment

### GET /api/leaderboard
**Status:** 📅 Planned  
**Purpose:** Fetch global leaderboard data  
**Authentication:** Not required  

**Planned Response:**
```typescript
{
  leaderboard: Array<{
    rank: number;
    username: string;
    bestWpm: number;
    testsCompleted: number;
    averageAccuracy: number;
  }>;
}
```

### GET /api/user/profile
**Status:** 📅 Planned  
**Purpose:** Fetch detailed user profile and statistics  
**Authentication:** Required  

**Planned Response:**
```typescript
{
  user: {
    id: string;
    username: string;
    email: string;
    stats: {
      averageWpm: number;
      averageAccuracy: number;
      testsCompleted: number;
      rank: number;
      bestWpm: number;
      recentTests: TestResult[];
    };
  };
}
```

### GET /api/test/history
**Status:** 📅 Planned  
**Purpose:** Retrieve user's test history with pagination  
**Authentication:** Required  

**Planned Query Parameters:**
- `limit`: number (default: 50)
- `offset`: number (default: 0)
- `sort`: 'date' | 'wpm' | 'accuracy'

---

## Legacy Endpoints (Deprecated)

### GET /api/tests

**Status:** ⚠️ Deprecated - Use `/api/v1/tests` instead  
**Removal Date:** TBD

This endpoint is maintained for backward compatibility but will be removed in a future version. Please migrate to `/api/v1/tests`.

---

## Implementation Notes

- **Firebase Integration:** All user authentication and data storage handled through Firebase
- **Security:** All endpoints (except public test retrieval) require valid authentication tokens
- **Validation:** All inputs are validated and sanitized on the backend
- **Error Handling:** Consistent error response format across all endpoints
- **Logging:** All requests are logged with correlation IDs for tracing
- **Performance:** Database queries are optimized with proper indexing

## API Best Practices

When integrating with these APIs:

1. **Always include correlation IDs** for request tracing
2. **Handle rate limits gracefully** with exponential backoff
3. **Validate user input** on the client side before API calls
4. **Use HTTPS** for all production requests
5. **Store auth tokens securely** (never in localStorage for sensitive apps)
6. **Implement proper error handling** for all possible error codes
7. **Cache responses** when appropriate to reduce API calls

---

**Last Updated:** October 3, 2025  
**API Version:** v1  
**Maintainer:** ZenType Development Team  
**Questions?** See `API_DESIGN_DOCUMENTATION.md` for architectural details
