"use client"

import { Header } from "@/components/header"
import { GlassCard } from "@/components/ui/glass-card"
import { Shield, FileText, Globe, Database, Lock, Users } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Shield className="h-16 w-16 text-[#00BFFF] mx-auto" />
            <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              How we collect, use, and protect your personal data
            </p>
            <p className="text-sm text-muted-foreground">
              🇪🇺 <span className="font-semibold">GDPR Compliant</span> | Last Updated: November 13, 2025
            </p>
          </div>

          {/* Quick Links */}
          <GlassCard className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/settings/privacy" className="p-4 rounded-lg border border-border hover:border-[#00BFFF] transition-colors">
                <FileText className="h-6 w-6 text-[#00BFFF] mb-2" />
                <p className="font-medium text-foreground">Privacy Settings</p>
                <p className="text-xs text-muted-foreground">Manage your data</p>
              </Link>
              <Link href="/settings" className="p-4 rounded-lg border border-border hover:border-[#00BFFF] transition-colors">
                <Shield className="h-6 w-6 text-[#00BFFF] mb-2" />
                <p className="font-medium text-foreground">Account Settings</p>
                <p className="text-xs text-muted-foreground">Edit or delete account</p>
              </Link>
              <a href="mailto:privacy@zentype.app" className="p-4 rounded-lg border border-border hover:border-[#00BFFF] transition-colors">
                <Users className="h-6 w-6 text-[#00BFFF] mb-2" />
                <p className="font-medium text-foreground">Contact Us</p>
                <p className="text-xs text-muted-foreground">privacy@zentype.app</p>
              </a>
            </div>
          </GlassCard>

          {/* Introduction */}
          <GlassCard className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to ZenType. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we handle your personal data when you use our typing practice platform,
              and tells you about your privacy rights under the EU General Data Protection Regulation (GDPR).
            </p>
          </GlassCard>

          {/* Who We Are */}
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-[#00BFFF]" />
              <h2 className="text-2xl font-semibold text-foreground">Who We Are</h2>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Data Controller:</span> ZenType
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Contact:</span> privacy@zentype.app
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Location:</span> European Union (Lithuania)
              </p>
            </div>
          </GlassCard>

          {/* What Data We Collect */}
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-[#00BFFF]" />
              <h2 className="text-2xl font-semibold text-foreground">What Data We Collect</h2>
            </div>

            <div className="space-y-6">
              {/* Strictly Necessary */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">Strictly Necessary Data</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Required for the service to function. Legal basis: Contract (GDPR Art. 6(1)(b))
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Email address (for account management)</li>
                  <li>Password (securely hashed, never stored in plaintext)</li>
                  <li>Display name (user profile)</li>
                  <li>User ID (Firebase Authentication UID)</li>
                </ul>
              </div>

              {/* Performance Data */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">Performance Data (With Consent)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Collected when you complete typing tests. Legal basis: Consent (GDPR Art. 6(1)(a))
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Words Per Minute (WPM) scores</li>
                  <li>Accuracy percentage</li>
                  <li>Test duration and configuration</li>
                  <li>Test completion timestamps</li>
                </ul>
              </div>

              {/* Technical Data */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">Technical Data</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  For security and service improvement. Legal basis: Legitimate Interest (GDPR Art. 6(1)(f))
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>IP address (anonymized)</li>
                  <li>Browser type and version</li>
                  <li>Device and operating system information</li>
                </ul>
              </div>
            </div>
          </GlassCard>

          {/* Where We Store Data */}
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-[#00BFFF]" />
              <h2 className="text-2xl font-semibold text-foreground">Where We Store Your Data</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#00BFFF]/10 border border-[#00BFFF]/20">
                <p className="font-medium text-foreground mb-2">🇪🇺 100% European Union Storage</p>
                <p className="text-sm text-muted-foreground">
                  All your personal data is stored exclusively in the European Union to ensure GDPR compliance.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Primary Storage:</span> europe-west1 (Belgium)
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Provider:</span> Google Cloud Platform / Firebase
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">DPA:</span> Data Processing Agreement in place with Google
                </p>
              </div>
            </div>
          </GlassCard>

          {/* How We Use Data */}
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6 text-[#00BFFF]" />
              <h2 className="text-2xl font-semibold text-foreground">How We Use Your Data</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><span className="font-semibold text-foreground">Account Management:</span> Create and manage your account</li>
              <li><span className="font-semibold text-foreground">Service Delivery:</span> Provide typing tests and track your progress</li>
              <li><span className="font-semibold text-foreground">Performance Tracking:</span> Display your statistics and history</li>
              <li><span className="font-semibold text-foreground">Leaderboards:</span> Show rankings (with your consent)</li>
              <li><span className="font-semibold text-foreground">Security:</span> Prevent fraud and unauthorized access</li>
              <li><span className="font-semibold text-foreground">Service Improvement:</span> Analyze usage patterns to enhance features</li>
            </ul>
          </GlassCard>

          {/* Your Rights */}
          <GlassCard className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Your Rights Under GDPR</h2>
            <p className="text-muted-foreground">
              You have the following rights regarding your personal data:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border">
                <p className="font-medium text-foreground mb-1">✅ Right to Access</p>
                <p className="text-sm text-muted-foreground">Download all your data in JSON format</p>
                <Link href="/settings/privacy" className="text-xs text-[#00BFFF] hover:underline">
                  Export Data →
                </Link>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <p className="font-medium text-foreground mb-1">✅ Right to Rectification</p>
                <p className="text-sm text-muted-foreground">Update or correct your profile information</p>
                <Link href="/settings" className="text-xs text-[#00BFFF] hover:underline">
                  Edit Profile →
                </Link>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <p className="font-medium text-foreground mb-1">✅ Right to Erasure</p>
                <p className="text-sm text-muted-foreground">Delete your account and all data</p>
                <Link href="/settings" className="text-xs text-[#00BFFF] hover:underline">
                  Delete Account →
                </Link>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <p className="font-medium text-foreground mb-1">✅ Right to Data Portability</p>
                <p className="text-sm text-muted-foreground">Export your data in machine-readable format</p>
                <Link href="/settings/privacy" className="text-xs text-[#00BFFF] hover:underline">
                  Export Data →
                </Link>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <p className="font-medium text-foreground mb-1">✅ Right to Object</p>
                <p className="text-sm text-muted-foreground">Object to certain processing activities</p>
                <Link href="/settings/privacy" className="text-xs text-[#00BFFF] hover:underline">
                  Manage Consents →
                </Link>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <p className="font-medium text-foreground mb-1">✅ Right to Withdraw Consent</p>
                <p className="text-sm text-muted-foreground">Change cookie preferences anytime</p>
                <Link href="/settings/privacy" className="text-xs text-[#00BFFF] hover:underline">
                  Cookie Settings →
                </Link>
              </div>
            </div>
          </GlassCard>

          {/* Data Retention */}
          <GlassCard className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Data Retention</h2>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Active Account Data:</span> Retained while your account is active
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Deleted Account Data:</span> Permanently deleted within 24 hours
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Logs:</span> Retained for 90 days for security purposes
              </p>
            </div>
          </GlassCard>

          {/* Cookies */}
          <GlassCard className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Cookies</h2>
            <p className="text-muted-foreground">
              We use cookies to enhance your experience. You can manage your cookie preferences at any time.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Strictly Necessary:</span> Always active (authentication, security)
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Analytics:</span> Optional (performance tracking)
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Functional:</span> Optional (preferences, theme)
              </p>
            </div>
            <Link href="/settings/privacy">
              <button className="text-sm text-[#00BFFF] hover:underline">
                Manage Cookie Preferences →
              </button>
            </Link>
          </GlassCard>

          {/* Contact */}
          <GlassCard className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this privacy policy or how we handle your data, please contact us:
            </p>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Email:</span>{" "}
                <a href="mailto:privacy@zentype.app" className="text-[#00BFFF] hover:underline">
                  privacy@zentype.app
                </a>
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Response Time:</span> Within 30 days (GDPR requirement)
              </p>
            </div>
          </GlassCard>

          {/* Supervisory Authority */}
          <GlassCard className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Your Right to Complain</h2>
            <p className="text-muted-foreground">
              You have the right to lodge a complaint with your local data protection supervisory authority
              if you believe we have not handled your personal data properly.
            </p>
            <p className="text-sm text-muted-foreground">
              For users in Lithuania: State Data Protection Inspectorate (
              <a href="https://vdai.lrv.lt" target="_blank" rel="noopener noreferrer" className="text-[#00BFFF] hover:underline">
                vdai.lrv.lt
              </a>
              )
            </p>
          </GlassCard>

          {/* Updates */}
          <GlassCard className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Policy Updates</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will notify you of any significant changes
              by posting the new policy on this page and updating the "Last Updated" date.
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Last Updated:</span> November 13, 2025
            </p>
          </GlassCard>
        </div>
      </main>
    </div>
  )
}
