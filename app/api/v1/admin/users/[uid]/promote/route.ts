/**
 * API Route: /api/v1/admin/users/[uid]/promote
 * Purpose: Promote user to admin role with custom claims
 * Authorization: Super Admin only
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/admin-middleware'
import {
  setUserCustomClaims,
  revokeUserSessions,
  getUserWithClaims,
  db
} from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * POST /api/v1/admin/users/[uid]/promote
 * Promote user to admin or superAdmin role
 * Requires: Super Admin role
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    // Verify super admin authorization
    const adminVerification = await requireSuperAdmin(request)
    if (!adminVerification.authorized) {
      console.error('[AdminUserPromoteAPI] Unauthorized access attempt', {
        adminUserId: adminVerification.userId,
        targetUid: params.uid
      })
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Super Admin access required' },
        { status: 403 }
      )
    }

    const { uid } = params
    const body = await request.json()
    const { role, permissions } = body

    // Validate role
    if (!role || !['admin', 'superAdmin'].includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role. Must be "admin" or "superAdmin"' },
        { status: 400 }
      )
    }

    console.info('[AdminUserPromoteAPI] Promoting user', {
      adminUserId: adminVerification.userId,
      targetUid: uid,
      role,
      permissions
    })

    // Get current user data
    const authUser = await getUserWithClaims(uid)
    if (!authUser) {
      console.warn('[AdminUserPromoteAPI] User not found', { uid })
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent self-demotion for superAdmins
    if (uid === adminVerification.userId && role === 'admin' && adminVerification.claims?.superAdmin) {
      return NextResponse.json(
        { success: false, message: 'Super Admins cannot demote themselves' },
        { status: 400 }
      )
    }

    // Build custom claims
    const customClaims: Record<string, boolean> = {
      admin: true
    }

    if (role === 'superAdmin') {
      customClaims.superAdmin = true
    }

    // Add specific permissions if provided
    if (permissions) {
      if (permissions.canDeleteUsers) customClaims.canDeleteUsers = true
      if (permissions.canManageSubscriptions) customClaims.canManageSubscriptions = true
      if (permissions.canViewAuditLogs) customClaims.canViewAuditLogs = true
      if (permissions.canManageSettings) customClaims.canManageSettings = true
    }

    // Set custom claims
    await setUserCustomClaims(uid, customClaims)
    console.info('[AdminUserPromoteAPI] Custom claims set', { uid, customClaims })

    // Revoke existing sessions to force re-authentication with new claims
    await revokeUserSessions(uid)
    console.info('[AdminUserPromoteAPI] User sessions revoked', { uid })

    // Log to audit trail
    await db.collection('adminAuditLog').add({
      timestamp: FieldValue.serverTimestamp(),
      adminUserId: adminVerification.userId || 'unknown',
      adminEmail: adminVerification.email || 'unknown',
      adminRole: 'superAdmin',
      action: 'user_promoted',
      targetUserId: uid,
      targetUserEmail: authUser.email,
      changes: [
        {
          field: 'role',
          oldValue: authUser.customClaims?.admin ? (authUser.customClaims?.superAdmin ? 'superAdmin' : 'admin') : 'user',
          newValue: role
        },
        {
          field: 'customClaims',
          oldValue: authUser.customClaims || {},
          newValue: customClaims
        }
      ],
      metadata: {
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        sessionsRevoked: true
      },
      success: true
    })

    console.info('[AdminUserPromoteAPI] User promoted successfully', {
      adminUserId: adminVerification.userId,
      targetUid: uid,
      role,
      customClaims
    })

    return NextResponse.json({
      success: true,
      message: `User promoted to ${role} successfully. Sessions revoked - user must re-login.`,
      customClaims
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[AdminUserPromoteAPI] Error promoting user', {
      error: errorMessage,
      uid: params.uid
    })

    // Log failed attempt
    try {
      const adminVerification = await requireSuperAdmin(request)
      if (adminVerification.authorized) {
        await db.collection('adminAuditLog').add({
          timestamp: FieldValue.serverTimestamp(),
          adminUserId: adminVerification.userId || 'unknown',
          adminEmail: adminVerification.email || 'unknown',
          adminRole: 'superAdmin',
          action: 'user_promoted',
          targetUserId: params.uid,
          success: false,
          error: errorMessage
        })
      }
    } catch (auditError) {
      console.error('[AdminUserPromoteAPI] Failed to log audit entry', { error: auditError })
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to promote user',
        error: errorMessage
      },
      { status: 500 }
    )
  }
}
