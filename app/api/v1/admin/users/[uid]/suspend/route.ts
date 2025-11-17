/**
 * API Route: /api/v1/admin/users/[uid]/suspend
 * Purpose: Suspend or unsuspend user account
 * Authorization: Admin with canDeleteUsers permission
 */

import { NextRequest, NextResponse } from 'next/server'
import { requirePermission } from '@/lib/admin-middleware'
import { getUserWithClaims, db } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

/**
 * POST /api/v1/admin/users/[uid]/suspend
 * Suspend or unsuspend user account
 * Requires: Admin with canDeleteUsers permission
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    // Verify admin authorization with canDeleteUsers permission
    const adminVerification = await requirePermission(request, 'canDeleteUsers')
    if (!adminVerification.authorized) {
      console.error('[AdminUserSuspendAPI] Unauthorized access attempt', {
        adminUserId: adminVerification.userId,
        targetUid: params.uid
      })
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin with canDeleteUsers permission required' },
        { status: 403 }
      )
    }

    const { uid } = params
    const body = await request.json()
    const { disabled, reason } = body

    // Validate disabled flag
    if (typeof disabled !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Invalid request. "disabled" must be a boolean' },
        { status: 400 }
      )
    }

    // Require reason for suspension
    if (disabled && (!reason || reason.trim().length === 0)) {
      return NextResponse.json(
        { success: false, message: 'Suspension reason is required' },
        { status: 400 }
      )
    }

    console.info('[AdminUserSuspendAPI] Updating user status', {
      adminUserId: adminVerification.userId,
      targetUid: uid,
      disabled,
      reason
    })

    // Get current user data
    const authUser = await getUserWithClaims(uid)
    if (!authUser) {
      console.warn('[AdminUserSuspendAPI] User not found', { uid })
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent self-suspension
    if (uid === adminVerification.userId) {
      return NextResponse.json(
        { success: false, message: 'Admins cannot suspend themselves' },
        { status: 400 }
      )
    }

    // Prevent suspending other admins
    if (authUser.customClaims?.admin || authUser.customClaims?.superAdmin) {
      return NextResponse.json(
        { success: false, message: 'Cannot suspend admin users. Remove admin role first.' },
        { status: 400 }
      )
    }

    // Update user disabled status in Firebase Auth
    const auth = getAuth()
    await auth.updateUser(uid, { disabled })
    console.info('[AdminUserSuspendAPI] User disabled status updated', {
      uid,
      disabled,
      previousStatus: authUser.disabled
    })

    // Update suspension info in Firestore profile
    const profileRef = db.collection('profiles').doc(uid)
    const suspensionData: any = {
      disabled,
      updatedAt: FieldValue.serverTimestamp()
    }

    if (disabled) {
      suspensionData.suspensionReason = reason
      suspensionData.suspendedAt = FieldValue.serverTimestamp()
      suspensionData.suspendedBy = adminVerification.userId
    } else {
      // Clear suspension data when unsuspending
      suspensionData.suspensionReason = FieldValue.delete()
      suspensionData.suspendedAt = FieldValue.delete()
      suspensionData.suspendedBy = FieldValue.delete()
      suspensionData.unsuspendedAt = FieldValue.serverTimestamp()
      suspensionData.unsuspendedBy = adminVerification.userId
    }

    await profileRef.update(suspensionData)

    // Log to audit trail
    await db.collection('adminAuditLog').add({
      timestamp: FieldValue.serverTimestamp(),
      adminUserId: adminVerification.userId || 'unknown',
      adminEmail: adminVerification.email || 'unknown',
      adminRole: adminVerification.claims?.superAdmin ? 'superAdmin' : 'admin',
      action: disabled ? 'user_suspended' : 'user_unsuspended',
      targetUserId: uid,
      targetUserEmail: authUser.email,
      changes: [
        {
          field: 'disabled',
          oldValue: authUser.disabled || false,
          newValue: disabled
        }
      ],
      metadata: {
        reason: reason || 'No reason provided',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      },
      success: true
    })

    console.info('[AdminUserSuspendAPI] User suspension status updated successfully', {
      adminUserId: adminVerification.userId,
      targetUid: uid,
      disabled
    })

    return NextResponse.json({
      success: true,
      message: disabled
        ? 'User account suspended successfully'
        : 'User account unsuspended successfully',
      disabled
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[AdminUserSuspendAPI] Error updating suspension status', {
      error: errorMessage,
      uid: params.uid
    })

    // Log failed attempt
    try {
      const adminVerification = await requirePermission(request, 'canDeleteUsers')
      if (adminVerification.authorized) {
        await db.collection('adminAuditLog').add({
          timestamp: FieldValue.serverTimestamp(),
          adminUserId: adminVerification.userId || 'unknown',
          adminEmail: adminVerification.email || 'unknown',
          adminRole: adminVerification.claims?.superAdmin ? 'superAdmin' : 'admin',
          action: 'user_suspension_failed',
          targetUserId: params.uid,
          success: false,
          error: errorMessage
        })
      }
    } catch (auditError) {
      console.error('[AdminUserSuspendAPI] Failed to log audit entry', { error: auditError })
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update suspension status',
        error: errorMessage
      },
      { status: 500 }
    )
  }
}
