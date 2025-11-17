"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/header"
import { 
  ArrowLeft, 
  User, 
  Mail,
  Calendar, 
  Crown, 
  Shield, 
  Activity, 
  TrendingUp,
  Edit,
  UserPlus,
  Ban,
  Trash2,
  Clock,
  Target,
  Zap,
  FileText,
  AlertTriangle,
  CreditCard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase/client"

interface UserDetailData {
  // Auth data
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  disabled: boolean
  createdAt: string
  lastSignInTime: string | null
  customClaims: {
    admin?: boolean
    superAdmin?: boolean
    canDeleteUsers?: boolean
    canManageSubscriptions?: boolean
    canViewAuditLogs?: boolean
    canManageSettings?: boolean
  }
  
  // Profile data (Firestore)
  profile: {
    username: string
    bio: string
    globalRank: number
    testsCompleted: number
    bestWPM: number
    averageAccuracy: number
  } | null
  
  // Subscription data (Firestore)
  subscription: {
    tier: 'free' | 'premium'
    status: 'active' | 'cancelled' | 'expired'
    aiGenerationCount: number
    lastAIGenerationReset: string
    createdAt: string
    updatedAt: string
  } | null
  
  // Recent tests (last 10)
  recentTests: Array<{
    id: string
    mode: string
    wpm: number
    accuracy: number
    completedAt: string
  }>
}

export default function UserDetailPage() {
  const [userData, setUserData] = useState<UserDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const uid = params.uid as string

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser
        if (!user) {
          console.warn('[AdminUserDetail] No authenticated user', { uid })
          router.push('/admin/login')
          return
        }

        const idToken = await user.getIdToken()
        console.info('[AdminUserDetail] Fetching user details', { uid })

        const response = await fetch(`/api/v1/admin/users/${uid}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        })

        if (response.status === 401 || response.status === 403) {
          console.error('[AdminUserDetail] Unauthorized access', { status: response.status })
          router.push('/admin/login')
          return
        }

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch user details')
        }

        const data = await response.json()
        console.info('[AdminUserDetail] User details loaded', { 
          uid, 
          hasProfile: !!data.profile,
          hasSubscription: !!data.subscription 
        })
        setUserData(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error('[AdminUserDetail] Failed to fetch user details', { 
          error: errorMessage,
          uid 
        })
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserDetails()
  }, [uid, router])

  const handleEditProfile = async () => {
    console.info('[AdminUserDetail] Edit profile clicked', { uid })
    
    // Prompt for new values
    const newEmail = prompt('Enter new email (leave blank to keep current):', userData?.email || '')
    const newDisplayName = prompt('Enter new display name (leave blank to keep current):', userData?.displayName || '')
    const newUsername = prompt('Enter new username (leave blank to keep current):', userData?.profile?.username || '')
    const newBio = prompt('Enter new bio (leave blank to keep current):', userData?.profile?.bio || '')
    
    // If all are cancelled/empty, abort
    if (!newEmail && !newDisplayName && !newUsername && !newBio) {
      return
    }
    
    try {
      const user = auth.currentUser
      if (!user) {
        alert('Not authenticated')
        return
      }
      
      const idToken = await user.getIdToken()
      const body: any = {}
      if (newEmail && newEmail !== userData?.email) body.email = newEmail
      if (newDisplayName && newDisplayName !== userData?.displayName) body.displayName = newDisplayName
      if (newUsername && newUsername !== userData?.profile?.username) body.username = newUsername
      if (newBio && newBio !== userData?.profile?.bio) body.bio = newBio
      
      if (Object.keys(body).length === 0) {
        alert('No changes made')
        return
      }
      
      console.info('[AdminUserDetail] Updating profile', { uid, body })
      
      const response = await fetch(`/api/v1/admin/users/${uid}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('Profile updated successfully!')
        // Refresh user data
        window.location.reload()
      } else {
        alert(`Failed to update profile: ${result.message}`)
      }
    } catch (error) {
      console.error('[AdminUserDetail] Error updating profile', { error })
      alert('Error updating profile')
    }
  }

  const handlePromoteToAdmin = async () => {
    console.info('[AdminUserDetail] Promote to admin clicked', { uid })
    
    const role = prompt('Enter role (admin or superAdmin):', 'admin')
    if (!role || !['admin', 'superAdmin'].includes(role)) {
      alert('Invalid role. Must be "admin" or "superAdmin"')
      return
    }
    
    const confirmed = confirm(`Are you sure you want to promote this user to ${role}? They will need to re-login.`)
    if (!confirmed) return
    
    try {
      const user = auth.currentUser
      if (!user) {
        alert('Not authenticated')
        return
      }
      
      const idToken = await user.getIdToken()
      
      console.info('[AdminUserDetail] Promoting user', { uid, role })
      
      const response = await fetch(`/api/v1/admin/users/${uid}/promote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          role,
          permissions: {
            canDeleteUsers: role === 'superAdmin',
            canManageSubscriptions: true,
            canViewAuditLogs: role === 'superAdmin',
            canManageSettings: role === 'superAdmin'
          }
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert(result.message)
        window.location.reload()
      } else {
        alert(`Failed to promote user: ${result.message}`)
      }
    } catch (error) {
      console.error('[AdminUserDetail] Error promoting user', { error })
      alert('Error promoting user')
    }
  }

  const handleEditPermissions = async () => {
    console.info('[AdminUserDetail] Edit permissions clicked', { uid })
    
    // Get current permissions
    const currentRole = userData?.customClaims.superAdmin ? 'superAdmin' : (userData?.customClaims.admin ? 'admin' : 'user')
    const currentPerms = userData?.customClaims || {}
    
    // Ask for new role
    const role = prompt(`Enter role (admin or superAdmin). Current: ${currentRole}`, currentRole)
    if (!role || !['admin', 'superAdmin'].includes(role)) {
      alert('Invalid role. Must be "admin" or "superAdmin"')
      return
    }
    
    // Ask for each permission
    const deleteUsers = confirm(`Permission: Delete Users?\nCurrent: ${currentPerms.canDeleteUsers ? 'YES' : 'NO'}\n\nClick OK for YES, Cancel for NO`)
    const manageSubscriptions = confirm(`Permission: Manage Subscriptions?\nCurrent: ${currentPerms.canManageSubscriptions ? 'YES' : 'NO'}\n\nClick OK for YES, Cancel for NO`)
    const viewAuditLogs = confirm(`Permission: View Audit Logs?\nCurrent: ${currentPerms.canViewAuditLogs ? 'YES' : 'NO'}\n\nClick OK for YES, Cancel for NO`)
    const manageSettings = confirm(`Permission: Manage Settings?\nCurrent: ${currentPerms.canManageSettings ? 'YES' : 'NO'}\n\nClick OK for YES, Cancel for NO`)
    
    const confirmed = confirm(`Update ${role} permissions?\n\n✓ Delete Users: ${deleteUsers}\n✓ Manage Subscriptions: ${manageSubscriptions}\n✓ View Audit Logs: ${viewAuditLogs}\n✓ Manage Settings: ${manageSettings}`)
    if (!confirmed) return
    
    try {
      const user = auth.currentUser
      if (!user) {
        alert('Not authenticated')
        return
      }
      
      const idToken = await user.getIdToken()
      
      console.info('[AdminUserDetail] Updating permissions', { uid, role, permissions: { deleteUsers, manageSubscriptions, viewAuditLogs, manageSettings } })
      
      const response = await fetch(`/api/v1/admin/users/${uid}/promote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          role,
          permissions: {
            canDeleteUsers: deleteUsers,
            canManageSubscriptions: manageSubscriptions,
            canViewAuditLogs: viewAuditLogs,
            canManageSettings: manageSettings
          }
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert(result.message)
        window.location.reload()
      } else {
        alert(`Failed to update permissions: ${result.message}`)
      }
    } catch (error) {
      console.error('[AdminUserDetail] Error updating permissions', { error })
      alert('Error updating permissions')
    }
  }

  const handleSuspendAccount = async () => {
    console.info('[AdminUserDetail] Suspend account clicked', { uid })
    
    const isSuspended = userData?.disabled || false
    const action = isSuspended ? 'unsuspend' : 'suspend'
    
    let reason = ''
    if (!isSuspended) {
      reason = prompt('Enter suspension reason:', '') || ''
      if (!reason.trim()) {
        alert('Suspension reason is required')
        return
      }
    }
    
    const confirmed = confirm(`Are you sure you want to ${action} this account?`)
    if (!confirmed) return
    
    try {
      const user = auth.currentUser
      if (!user) {
        alert('Not authenticated')
        return
      }
      
      const idToken = await user.getIdToken()
      
      console.info('[AdminUserDetail] Suspending user', { uid, disabled: !isSuspended, reason })
      
      const response = await fetch(`/api/v1/admin/users/${uid}/suspend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          disabled: !isSuspended,
          reason
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert(`Account ${action}ed successfully!`)
        window.location.reload()
      } else {
        alert(`Failed to ${action} account: ${result.message}`)
      }
    } catch (error) {
      console.error('[AdminUserDetail] Error suspending account', { error })
      alert('Error suspending account')
    }
  }

  const handleDeleteAccount = async () => {
    console.info('[AdminUserDetail] Delete account clicked', { uid })
    
    const confirmed1 = confirm('⚠️ WARNING: This will permanently delete the user account and ALL associated data. This action CANNOT be undone. Are you sure?')
    if (!confirmed1) return
    
    const confirmed2 = confirm('Final confirmation: Type "DELETE" in the next prompt to confirm permanent deletion')
    if (!confirmed2) return
    
    const confirmation = prompt('Type "DELETE" to confirm:')
    if (confirmation !== 'DELETE') {
      alert('Deletion cancelled. Confirmation text did not match.')
      return
    }
    
    try {
      const user = auth.currentUser
      if (!user) {
        alert('Not authenticated')
        return
      }
      
      const idToken = await user.getIdToken()
      
      console.info('[AdminUserDetail] Deleting user account', { uid })
      
      const response = await fetch(`/api/v1/admin/users/${uid}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('User account deleted permanently!')
        router.push('/admin/users')
      } else {
        alert(`Failed to delete account: ${result.message}`)
      }
    } catch (error) {
      console.error('[AdminUserDetail] Error deleting account', { error })
      alert('Error deleting account')
    }
  }

  const handleChangeSubscriptionTier = async () => {
    console.info('[AdminUserDetail] Change subscription tier clicked', { uid })
    
    const currentTier = userData?.subscription?.tier || 'free'
    const newTier = prompt(`Enter new subscription tier (free or premium).\nCurrent: ${currentTier}`, currentTier)
    
    if (!newTier || !['free', 'premium'].includes(newTier)) {
      alert('Invalid tier. Must be "free" or "premium"')
      return
    }
    
    if (newTier === currentTier) {
      alert('No change - tier is already ' + currentTier)
      return
    }
    
    const confirmed = confirm(`Change subscription from ${currentTier} to ${newTier}?\n\nThis will ${newTier === 'premium' ? 'give unlimited AI test generation' : 'limit AI tests to 5 per day'}.`)
    if (!confirmed) return
    
    try {
      const user = auth.currentUser
      if (!user) {
        alert('Not authenticated')
        return
      }
      
      const idToken = await user.getIdToken()
      
      console.info('[AdminUserDetail] Updating subscription tier', { uid, newTier })
      
      const response = await fetch(`/api/v1/admin/users/${uid}/subscription`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tier: newTier })
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert(`Subscription tier updated to ${newTier}!`)
        window.location.reload()
      } else {
        alert(`Failed to update subscription tier: ${result.message}`)
      }
    } catch (error) {
      console.error('[AdminUserDetail] Error updating subscription tier', { error })
      alert('Error updating subscription tier')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading user details...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Button
            onClick={() => router.push('/admin/users')}
            variant="ghost"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h2 className="text-lg font-semibold text-destructive">Error Loading User</h2>
            </div>
            <p className="text-destructive/80">{error || 'User not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  const isAdmin = userData.customClaims.admin || userData.customClaims.superAdmin
  const isSuperAdmin = userData.customClaims.superAdmin
  const isPremium = userData.subscription?.tier === 'premium'
  const aiLimit = isPremium ? 'Unlimited' : '5 per day'
  const aiUsed = userData.subscription?.aiGenerationCount || 0

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          onClick={() => router.push('/admin/users')}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>

        {/* User Header Card */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {userData.photoURL ? (
                <img
                  src={userData.photoURL}
                  alt={userData.displayName || 'User avatar'}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              {isPremium && (
                <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1.5">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {userData.displayName || 'No Display Name'}
                </h1>
                {isSuperAdmin && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-500 text-xs font-semibold rounded">
                    <Shield className="w-3 h-3" />
                    SUPER ADMIN
                  </span>
                )}
                {isAdmin && !isSuperAdmin && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 text-orange-500 text-xs font-semibold rounded">
                    <Shield className="w-3 h-3" />
                    ADMIN
                  </span>
                )}
              </div>

              {userData.profile?.username && (
                <p className="text-muted-foreground mb-1">@{userData.profile.username}</p>
              )}

              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{userData.email}</span>
                {userData.emailVerified ? (
                  <span className="text-xs text-green-500">✓ Verified</span>
                ) : (
                  <span className="text-xs text-amber-500">⚠ Unverified</span>
                )}
              </div>

              {userData.profile?.bio && (
                <p className="text-sm text-foreground mb-3">{userData.profile.bio}</p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(userData.createdAt).toLocaleDateString()}</span>
                </div>
                {userData.lastSignInTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Last login {new Date(userData.lastSignInTime).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {userData.disabled && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-destructive/10 border border-destructive rounded text-destructive text-sm">
                  <Ban className="w-4 h-4" />
                  <span className="font-semibold">Account Suspended</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button onClick={handleEditProfile} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              {!isAdmin ? (
                <Button onClick={handlePromoteToAdmin} variant="outline" size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Promote to Admin
                </Button>
              ) : (
                <Button onClick={handleEditPermissions} variant="outline" size="sm" className="border-orange-500 text-orange-500">
                  <Shield className="w-4 h-4 mr-2" />
                  Edit Permissions
                </Button>
              )}
              <Button 
                onClick={handleChangeSubscriptionTier}
                variant="outline" 
                size="sm"
                className="border-purple-500 text-purple-500"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Change Subscription
              </Button>
              <Button 
                onClick={handleSuspendAccount} 
                variant="outline" 
                size="sm"
                className={userData.disabled ? "border-green-500 text-green-500" : "border-amber-500 text-amber-500"}
              >
                <Ban className="w-4 h-4 mr-2" />
                {userData.disabled ? 'Unsuspend' : 'Suspend'}
              </Button>
              <Button onClick={handleDeleteAccount} variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Stats Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Performance Stats
            </h2>
            {userData.profile ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Target className="w-4 h-4" />
                    Global Rank
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    #{userData.profile.globalRank.toLocaleString()}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <FileText className="w-4 h-4" />
                    Tests Completed
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {userData.profile.testsCompleted.toLocaleString()}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <TrendingUp className="w-4 h-4" />
                    Best WPM
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {userData.profile.bestWPM}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Zap className="w-4 h-4" />
                    Avg Accuracy
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {userData.profile.averageAccuracy.toFixed(1)}%
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No profile data available</p>
            )}
          </div>

          {/* Subscription Card */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              {isPremium ? <Crown className="w-5 h-5 text-amber-500" /> : <User className="w-5 h-5" />}
              Subscription
            </h2>
            {userData.subscription ? (
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Tier</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                      isPremium 
                        ? 'bg-amber-500/10 text-amber-500' 
                        : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {userData.subscription.tier.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      userData.subscription.status === 'active'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {userData.subscription.status}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm mb-1">AI Test Generation</p>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-medium">
                      {aiUsed} / {aiLimit}
                    </span>
                    {!isPremium && (
                      <span className="text-xs text-muted-foreground">
                        Resets daily
                      </span>
                    )}
                  </div>
                  {!isPremium && (
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${(aiUsed / 5) * 100}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Created</p>
                    <p className="text-sm text-foreground">
                      {new Date(userData.subscription.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Last Updated</p>
                    <p className="text-sm text-foreground">
                      {new Date(userData.subscription.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No subscription data available</p>
            )}
          </div>
        </div>

        {/* Recent Tests */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Tests (Last 10)
          </h2>
          {userData.recentTests.length > 0 ? (
            <div className="space-y-2">
              {userData.recentTests.map((test) => (
                <div 
                  key={test.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground">{test.mode}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(test.completedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">WPM</p>
                      <p className="text-lg font-bold text-foreground">{test.wpm}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                      <p className="text-lg font-bold text-foreground">{test.accuracy.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent tests found</p>
          )}
        </div>
      </div>
    </div>
  )
}
