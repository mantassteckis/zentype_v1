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
  AlertTriangle
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

  const handleEditProfile = () => {
    console.info('[AdminUserDetail] Edit profile clicked', { uid })
    // TODO: Phase 2d - Open edit modal
    alert('Edit profile feature coming in Phase 2d')
  }

  const handlePromoteToAdmin = () => {
    console.info('[AdminUserDetail] Promote to admin clicked', { uid })
    // TODO: Phase 2d - Promote user
    alert('Promote to admin feature coming in Phase 2d')
  }

  const handleSuspendAccount = () => {
    console.info('[AdminUserDetail] Suspend account clicked', { uid })
    // TODO: Phase 2d - Suspend/unsuspend account
    alert('Suspend account feature coming in Phase 2d')
  }

  const handleDeleteAccount = () => {
    console.info('[AdminUserDetail] Delete account clicked', { uid })
    // TODO: Phase 2d - Delete account with confirmation
    alert('Delete account feature coming in Phase 2d - requires confirmation modal')
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
              {!isAdmin && (
                <Button onClick={handlePromoteToAdmin} variant="outline" size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Promote to Admin
                </Button>
              )}
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
