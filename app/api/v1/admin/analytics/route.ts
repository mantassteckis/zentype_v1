import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import { db } from '@/lib/firebase-admin'
import { getAuth } from 'firebase-admin/auth'

/**
 * GET /api/v1/admin/analytics
 * Fetch analytics data for admin dashboard
 * Requires: Admin role
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authorization
    const adminVerification = await requireAdmin(request)
    if (!adminVerification.authorized) {
      console.error('[AdminAnalyticsAPI] Unauthorized access attempt', {
        adminUserId: adminVerification.userId
      })
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }

    console.info('[AdminAnalyticsAPI] Fetching analytics', {
      adminUserId: adminVerification.userId
    })

    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Fetch all users from Firebase Auth
    const auth = getAuth()
    let allUsers: any[] = []
    let nextPageToken: string | undefined

    do {
      const listUsersResult = await auth.listUsers(1000, nextPageToken)
      allUsers = allUsers.concat(listUsersResult.users)
      nextPageToken = listUsersResult.pageToken
    } while (nextPageToken)

    // User statistics
    const totalUsers = allUsers.length
    const newUsersLast7Days = allUsers.filter(
      (user) => new Date(user.metadata.creationTime) > last7Days
    ).length
    const newUsersLast30Days = allUsers.filter(
      (user) => new Date(user.metadata.creationTime) > last30Days
    ).length

    // Active users (users who signed in recently)
    const activeUsersLast24Hours = allUsers.filter(
      (user) => user.metadata.lastSignInTime && new Date(user.metadata.lastSignInTime) > last24Hours
    ).length

    // Subscription statistics
    const subscriptionsSnapshot = await db.collection('subscriptions').get()
    const subscriptions = subscriptionsSnapshot.docs.map((doc) => doc.data())

    const premiumUsers = subscriptions.filter((sub) => sub.tier === 'premium').length
    const freeUsers = totalUsers - premiumUsers

    const subscriptionDistribution = {
      premium: premiumUsers,
      free: freeUsers
    }

    // AI test statistics (last 24 hours)
    const aiTestsSnapshot = await db
      .collection('aiGeneratedTests')
      .where('createdAt', '>=', last24Hours.toISOString())
      .get()

    const aiTestsToday = aiTestsSnapshot.size

    // Test results statistics (last 24 hours)
    const testsSnapshot = await db
      .collection('testResults')
      .where('completedAt', '>=', last24Hours)
      .get()

    const testsCompletedToday = testsSnapshot.size

    // Calculate average WPM from test results
    const testResults = testsSnapshot.docs.map((doc) => doc.data())
    const totalWpm = testResults.reduce((sum, test) => sum + (test.wpm || 0), 0)
    const averageWpm = testResults.length > 0 ? Math.round(totalWpm / testResults.length) : 0

    // Admin action statistics
    const adminAuditSnapshot = await db
      .collection('adminAuditLog')
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get()

    const recentAdminActions = adminAuditSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        action: data.action,
        adminEmail: data.adminEmail,
        targetUserEmail: data.targetUserEmail || null,
        timestamp: data.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
        success: data.success || false
      }
    })

    const totalAdminActions = adminAuditSnapshot.size

    // User growth over time (last 30 days, grouped by day)
    const userGrowthData: { date: string; count: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const startOfDay = new Date(date.setHours(0, 0, 0, 0))
      const endOfDay = new Date(date.setHours(23, 59, 59, 999))

      const count = allUsers.filter((user) => {
        const createdAt = new Date(user.metadata.creationTime)
        return createdAt >= startOfDay && createdAt <= endOfDay
      }).length

      userGrowthData.push({
        date: startOfDay.toISOString().split('T')[0], // YYYY-MM-DD format
        count
      })
    }

    // Construct analytics response
    const analytics = {
      users: {
        total: totalUsers,
        newLast7Days: newUsersLast7Days,
        newLast30Days: newUsersLast30Days,
        activeLast24Hours: activeUsersLast24Hours
      },
      subscriptions: {
        distribution: subscriptionDistribution,
        premiumCount: premiumUsers,
        freeCount: freeUsers,
        conversionRate:
          totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100 * 10) / 10 : 0 // 1 decimal place
      },
      activity: {
        aiTestsToday,
        testsCompletedToday,
        averageWpm
      },
      admin: {
        recentActions: recentAdminActions,
        totalActionsRecorded: totalAdminActions
      },
      charts: {
        userGrowth: userGrowthData
      }
    }

    console.info('[AdminAnalyticsAPI] Analytics fetched successfully', {
      adminUserId: adminVerification.userId,
      totalUsers,
      premiumUsers,
      aiTestsToday
    })

    return NextResponse.json({
      success: true,
      ...analytics
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[AdminAnalyticsAPI] Error fetching analytics', {
      error: errorMessage
    })

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch analytics',
        error: errorMessage
      },
      { status: 500 }
    )
  }
}
