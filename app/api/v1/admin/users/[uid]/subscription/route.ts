/**
 * API Route: /api/v1/admin/users/[uid]/subscription
 * Purpose: Manage user subscription tiers
 * Authorization: Admin with canManageSubscriptions permission
 */

import { NextRequest, NextResponse } from 'next/server'
import { requirePermission } from '@/lib/admin-middleware'
import { getUserWithClaims, db } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * PUT /api/v1/admin/users/[uid]/subscription
 * Update user subscription tier (free/premium)
 * Requires: canManageSubscriptions permission
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params
    
    // Verify admin authorization with canManageSubscriptions permission
    const adminVerification = await requirePermission(request, 'canManageSubscriptions')
    if (!adminVerification.authorized) {
      console.error('[AdminSubscriptionAPI] Unauthorized access attempt', {
        adminUserId: adminVerification.userId,
        targetUid: uid
      })
      return NextResponse.json(
        { success: false, message: 'Unauthorized: canManageSubscriptions permission required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { tier } = body

    // Validate tier
    if (!tier || !['free', 'premium'].includes(tier)) {
      return NextResponse.json(
        { success: false, message: 'Invalid tier. Must be "free" or "premium"' },
        { status: 400 }
      )
    }

    console.info('[AdminSubscriptionAPI] Updating subscription tier', {
      adminUserId: adminVerification.userId,
      targetUid: uid,
      newTier: tier
    })

    // Get current user data
    const authUser = await getUserWithClaims(uid)
    if (!authUser) {
      console.warn('[AdminSubscriptionAPI] User not found', { uid })
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Get current subscription
    const subscriptionRef = db.collection('subscriptions').doc(uid)
    const subscriptionDoc = await subscriptionRef.get()
    const currentSubscription = subscriptionDoc.exists ? subscriptionDoc.data() : null

    const oldTier = currentSubscription?.tier || 'free'

    // Update subscription with tier change
    const subscriptionUpdate: any = {
      tier,
      status: 'active',
      updatedAt: FieldValue.serverTimestamp()
    }

    // Reset AI test counter when changing to/from premium
    if (tier === 'premium') {
      subscriptionUpdate.aiTestsUsedToday = 0
      subscriptionUpdate.lastResetDate = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    } else if (tier === 'free' && oldTier === 'premium') {
      // Downgrading from premium to free - reset to 0
      subscriptionUpdate.aiTestsUsedToday = 0
      subscriptionUpdate.lastResetDate = new Date().toISOString().split('T')[0]
    }

    // If subscription doesn't exist, create it
    if (!subscriptionDoc.exists) {
      subscriptionUpdate.userId = uid
      subscriptionUpdate.createdAt = FieldValue.serverTimestamp()
      subscriptionUpdate.aiGenerationCount = 0
      subscriptionUpdate.aiTestsUsedToday = 0
      subscriptionUpdate.lastResetDate = new Date().toISOString().split('T')[0]
    }

    await subscriptionRef.set(subscriptionUpdate, { merge: true })

    // Log to audit trail
    await db.collection('adminAuditLog').add({
      timestamp: FieldValue.serverTimestamp(),
      adminUserId: adminVerification.userId || 'unknown',
      adminEmail: adminVerification.email || 'unknown',
      adminRole: adminVerification.claims?.superAdmin ? 'superAdmin' : 'admin',
      action: 'subscription_updated',
      targetUserId: uid,
      targetUserEmail: authUser.email,
      changes: [
        {
          field: 'tier',
          oldValue: oldTier,
          newValue: tier
        }
      ],
      metadata: {
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        aiTestsReset: tier === 'premium' || (tier === 'free' && oldTier === 'premium')
      },
      success: true
    })

    console.info('[AdminSubscriptionAPI] Subscription tier updated successfully', {
      adminUserId: adminVerification.userId,
      targetUid: uid,
      oldTier,
      newTier: tier
    })

    return NextResponse.json({
      success: true,
      message: `Subscription tier updated to ${tier} successfully`,
      tier,
      oldTier
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const { uid: errorUid } = await params
    console.error('[AdminSubscriptionAPI] Error updating subscription tier', {
      error: errorMessage,
      uid: errorUid
    })

    // Log failed attempt
    try {
      const adminVerification = await requirePermission(request, 'canManageSubscriptions')
      if (adminVerification.authorized) {
        await db.collection('adminAuditLog').add({
          timestamp: FieldValue.serverTimestamp(),
          adminUserId: adminVerification.userId || 'unknown',
          adminEmail: adminVerification.email || 'unknown',
          adminRole: adminVerification.claims?.superAdmin ? 'superAdmin' : 'admin',
          action: 'subscription_updated',
          targetUserId: errorUid,
          success: false,
          error: errorMessage
        })
      }
    } catch (auditError) {
      console.error('[AdminSubscriptionAPI] Failed to log audit entry', { error: auditError })
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update subscription tier',
        error: errorMessage
      },
      { status: 500 }
    )
  }
}
