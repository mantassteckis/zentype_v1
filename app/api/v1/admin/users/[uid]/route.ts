import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import { getUserWithClaims } from '@/lib/firebase-admin'
import { db } from '@/lib/firebase-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    // Verify admin authorization
    const adminVerification = await requireAdmin(request)
    if (!adminVerification.authorized) {
      console.error('[AdminUserDetailAPI] Unauthorized access attempt', {
        adminUserId: adminVerification.userId,
        targetUid: params.uid
      })
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }

    const { uid } = params

    console.info('[AdminUserDetailAPI] Fetching user details', {
      adminUserId: adminVerification.userId,
      targetUid: uid
    })

    // Get user from Firebase Auth with custom claims
    const authUser = await getUserWithClaims(uid)
    if (!authUser) {
      console.warn('[AdminUserDetailAPI] User not found', { uid })
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch profile data from Firestore
    const profileDoc = await db.collection('profiles').doc(uid).get()
    const profileData = profileDoc.exists ? profileDoc.data() : null

    // Fetch subscription data from Firestore
    const subscriptionDoc = await db.collection('subscriptions').doc(uid).get()
    const subscriptionData = subscriptionDoc.exists ? subscriptionDoc.data() : null

    // Fetch recent tests (last 10) from testResults collection
    // Note: Removed orderBy to avoid Firestore index requirement - will sort client-side
    const recentTestsSnapshot = await db
      .collection('testResults')
      .where('userId', '==', uid)
      .limit(10)
      .get()

    const recentTests = recentTestsSnapshot.docs
      .map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          mode: data.mode || 'Unknown',
          wpm: data.wpm || 0,
          accuracy: data.accuracy || 0,
          completedAt: data.completedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        }
      })
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

    // Construct enriched user object
    const enrichedUser = {
      // Auth data
      uid: authUser.uid,
      email: authUser.email || '',
      displayName: authUser.displayName || null,
      photoURL: authUser.photoURL || null,
      emailVerified: authUser.emailVerified || false,
      disabled: authUser.disabled || false,
      createdAt: authUser.metadata.creationTime || new Date().toISOString(),
      lastSignInTime: authUser.metadata.lastSignInTime || null,
      customClaims: authUser.customClaims || {},

      // Profile data (Firestore)
      // Note: Profile uses nested stats object per FIRESTORE_SCHEMA
      profile: profileData
        ? {
            username: profileData.username || profileData.displayName || '',
            bio: profileData.bio || '',
            globalRank: profileData.stats?.rank || profileData.globalRank || 999999,
            testsCompleted: profileData.stats?.testsCompleted || profileData.testsCompleted || 0,
            bestWPM: profileData.bestWpm || profileData.stats?.avgWpm || 0,
            averageAccuracy: profileData.stats?.avgAcc || profileData.averageAccuracy || 0
          }
        : null,

      // Subscription data (Firestore)
      subscription: subscriptionData
        ? {
            tier: subscriptionData.tier || 'free',
            status: subscriptionData.status || 'active',
            aiGenerationCount: subscriptionData.aiGenerationCount || 0,
            lastAIGenerationReset:
              subscriptionData.lastAIGenerationReset?.toDate?.()?.toISOString() ||
              new Date().toISOString(),
            createdAt:
              subscriptionData.createdAt?.toDate?.()?.toISOString() ||
              new Date().toISOString(),
            updatedAt:
              subscriptionData.updatedAt?.toDate?.()?.toISOString() ||
              new Date().toISOString()
          }
        : null,

      // Recent tests
      recentTests
    }

    console.info('[AdminUserDetailAPI] User details fetched successfully', {
      adminUserId: adminVerification.userId,
      targetUid: uid,
      hasProfile: !!profileData,
      hasSubscription: !!subscriptionData,
      testCount: recentTests.length
    })

    return NextResponse.json({
      success: true,
      ...enrichedUser
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[AdminUserDetailAPI] Error fetching user details', {
      error: errorMessage,
      uid: params.uid
    })

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch user details',
        error: errorMessage
      },
      { status: 500 }
    )
  }
}
