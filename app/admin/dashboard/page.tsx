"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Shield, Users, CreditCard, Activity, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase/client"
import { signOut } from "firebase/auth"

interface AdminData {
  authorized: boolean
  role?: 'admin' | 'superAdmin'
  permissions?: {
    admin: boolean
    superAdmin: boolean
    canDeleteUsers: boolean
    canManageSubscriptions: boolean
  }
}

export default function AdminDashboardPage() {
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const user = auth.currentUser
        if (!user) {
          console.log('[Admin Dashboard] No user authenticated')
          router.push('/admin/login')
          return
        }

        const idToken = await user.getIdToken()
        
        const response = await fetch('/api/v1/admin/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        })

        if (!response.ok) {
          console.log('[Admin Dashboard] Admin verification failed')
          router.push('/admin/login')
          return
        }

        const data = await response.json()
        setAdminData(data)
        setIsLoading(false)
      } catch (error) {
        console.error('[Admin Dashboard] Verification error:', error)
        router.push('/admin/login')
      }
    }

    verifyAdminAccess()
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/admin/login')
    } catch (error) {
      console.error('[Admin Dashboard] Logout error:', error)
    }
  }

  if (isLoading || !adminData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Admin Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-red-500" />
              <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Role: <span className="font-semibold text-foreground">
                {adminData.role === 'superAdmin' ? 'Super Admin' : 'Admin'}
              </span>
            </p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Permissions Badge */}
        <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <h2 className="text-sm font-semibold text-foreground mb-2">Your Permissions:</h2>
          <div className="flex flex-wrap gap-2">
            {adminData.permissions?.admin && (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                Admin Access
              </span>
            )}
            {adminData.permissions?.superAdmin && (
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                Super Admin
              </span>
            )}
            {adminData.permissions?.canDeleteUsers && (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">
                Delete Users
              </span>
            )}
            {adminData.permissions?.canManageSubscriptions && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                Manage Subscriptions
              </span>
            )}
          </div>
        </div>

        {/* Phase 5 Analytics & Audit Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground">Real-time platform metrics</p>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/admin/analytics')}
              className="w-full"
              variant="default"
            >
              View Analytics →
            </Button>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-red-500/10 border border-amber-500/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-8 h-8 text-amber-500" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Audit Log</h3>
                <p className="text-sm text-muted-foreground">GDPR-compliant admin action history</p>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/admin/audit-log')}
              className="w-full"
              variant="default"
            >
              View Audit Log →
            </Button>
          </div>
        </div>

        {/* Coming Soon Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </h2>
            <p className="text-muted-foreground mb-4">
              Manage user accounts, roles, and permissions.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                View all users
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Search and filter users
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Edit user profiles
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Promote to admin
              </div>
            </div>
            <Button 
              onClick={() => router.push('/admin/users')}
              className="w-full"
              variant="default"
            >
              Manage Users →
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Subscription Management
            </h2>
            <p className="text-muted-foreground mb-4">
              Manage subscription tiers and AI test limits.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                View all subscriptions
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Upgrade/downgrade users
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Modify AI test limits
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                View usage analytics
              </div>
            </div>
            <Button 
              onClick={() => router.push('/admin/subscriptions')}
              className="w-full mt-4"
              variant="default"
            >
              Manage Subscriptions →
            </Button>
          </div>
        </div>

        {/* Phase 1 Complete Badge */}
        <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-500 text-lg">✓</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Phase 1 Foundation Complete
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Admin authentication system is fully operational. You can now securely access the admin panel.
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>✓ Firebase custom claims RBAC implemented</li>
                <li>✓ Admin middleware with permission checks</li>
                <li>✓ Admin audit logging configured</li>
                <li>✓ Secure admin authentication flow</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
