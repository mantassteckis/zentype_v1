"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, SettingsIcon, AlertTriangle, Trash2, Palette, Type } from "lucide-react"
import { useAuth } from "@/context/AuthProvider"
import { updateUserProfile } from "@/lib/firebase/firestore"
import { useUserPreferences } from "@/hooks/useUserPreferences"

export default function SettingsPage() {
  const { user, profile, isLoading } = useAuth()
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [keyboardSounds, setKeyboardSounds] = useState(true)
  const [visualFeedback, setVisualFeedback] = useState(true)
  const [autoSaveAiTests, setAutoSaveAiTests] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Use centralized preferences hook
  const {
    availableThemes,
    availableFonts,
    currentTheme,
    currentFont,
    dynamicTextColor,
    setTheme,
    setFont,
  } = useUserPreferences()

  // Load profile data (non-theme/font preferences)
  useEffect(() => {
    if (profile) {
      console.log("Settings - Loading profile data:", profile);
      console.log("Settings - Username from profile:", profile.username);
      setUsername(profile.username || "")
      setBio(profile.bio || "")
      setKeyboardSounds(profile.settings?.keyboardSounds ?? true)
      setVisualFeedback(profile.settings?.visualFeedback ?? true)
      setAutoSaveAiTests(profile.settings?.autoSaveAiTests ?? false)
    }
  }, [profile])

  const handleDeleteAccount = () => {
    console.log("[v0] Delete account button clicked")
    setShowDeleteModal(true)
  }

  const handleConfirmDeletion = () => {
    if (deleteConfirmation === "DELETE") {
      console.log("[v0] Account deletion confirmed")
      setShowDeleteModal(false)
      setDeleteConfirmation("")
      // Placeholder functionality - would redirect to goodbye page
    }
  }

  const handleCancelDeletion = () => {
    console.log("[v0] Account deletion cancelled")
    setShowDeleteModal(false)
    setDeleteConfirmation("")
  }

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  // Show message if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center">
            <p className="text-muted-foreground">Please log in to access settings.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Settings</h1>
            <p className="text-lg text-muted-foreground">Customize your ZenType experience</p>
          </div>

          {/* Profile Settings Section */}
          <GlassCard className="space-y-6">
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-[#00BFFF]" />
              <h2 className="text-2xl font-semibold text-foreground">Profile Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="glass-card border-border bg-background/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-foreground font-medium">
                  Short Bio
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your typing journey..."
                  rows={4}
                  className="glass-card border-border bg-background/50 text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>
            </div>
          </GlassCard>

          {/* Typing Area Themes Section */}
          <GlassCard className="space-y-6">
            <div className="flex items-center space-x-3">
              <Palette className="h-6 w-6 text-[#00BFFF]" />
              <h2 className="text-2xl font-semibold text-foreground">Typing Area Themes</h2>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground">Choose a visual theme for your typing practice area</p>
              <div className={`p-6 rounded-lg bg-gradient-to-br ${currentTheme.gradient} border border-border`}>
                <p className="text-sm text-muted-foreground mb-2">Live Preview:</p>
                <p className={`text-lg ${currentFont.className} ${dynamicTextColor} leading-relaxed`}>
                  The quick brown fox jumps over the lazy dog. This is how your typing area will look.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      currentTheme.id === theme.id
                        ? "border-[#00BFFF] shadow-lg shadow-[#00BFFF]/20"
                        : "border-border hover:border-[#00BFFF]/50"
                    }`}
                  >
                    <div
                      className={`h-16 rounded-md bg-gradient-to-br ${theme.gradient} mb-3 flex items-center justify-center`}
                    >
                      <span className={`text-sm font-mono ${theme.textColor}`}>Sample Text</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{theme.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Typing Font Selection Section */}
          <GlassCard className="space-y-6">
            <div className="flex items-center space-x-3">
              <Type className="h-6 w-6 text-[#00BFFF]" />
              <h2 className="text-2xl font-semibold text-foreground">Typing Font</h2>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground">Select your preferred font (monospaced or decorative)</p>
              <Select value={currentFont.id} onValueChange={setFont}>
                <SelectTrigger className="w-48 h-9 glass-card border-border bg-background/50">
                  <SelectValue placeholder="Choose a font" />
                </SelectTrigger>
                <SelectContent className="glass-card border-border max-h-[300px]">
                  <div className="px-2 py-2 text-xs font-semibold text-muted-foreground">⌨️ Monospaced Fonts</div>
                  {availableFonts.filter(f => f.isMonospace).map((font) => (
                    <SelectItem key={font.id} value={font.id} className={`${font.className} py-2`}>
                      {font.name}
                    </SelectItem>
                  ))}
                  <div className="px-2 py-2 text-xs font-semibold text-muted-foreground mt-2">🎨 Decorative Fonts</div>
                  {availableFonts.filter(f => !f.isMonospace).map((font) => (
                    <SelectItem key={font.id} value={font.id} className={`${font.className} py-2`}>
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className={`p-6 glass-card border-border rounded-lg bg-gradient-to-br ${currentTheme.gradient}`}>
                <p className="text-sm text-muted-foreground mb-2">Font Preview:</p>
                <p className={`text-lg ${currentFont.className} ${dynamicTextColor} leading-relaxed`}>
                  The quick brown fox jumps over the lazy dog. 1234567890
                  <br />
                  <span className="text-green-500">Correct characters</span>{" "}
                  <span className="text-red-500">Incorrect characters</span>
                </p>
              </div>
            </div>
          </GlassCard>

          {/* General Settings Section */}
          <GlassCard className="space-y-6">
            <div className="flex items-center space-x-3">
              <SettingsIcon className="h-6 w-6 text-[#00BFFF]" />
              <h2 className="text-2xl font-semibold text-foreground">General Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="keyboard-sounds" className="text-foreground font-medium">
                    Keyboard Sounds
                  </Label>
                  <p className="text-sm text-muted-foreground">Play sound effects when typing</p>
                </div>
                <Switch 
                  id="keyboard-sounds" 
                  checked={keyboardSounds} 
                  onCheckedChange={async (checked) => {
                    setKeyboardSounds(checked)
                    // Save to user profile if user is logged in
                    if (user && profile) {
                      try {
                        await updateUserProfile(user.uid, { 
                          settings: { 
                            ...profile.settings, 
                            keyboardSounds: checked 
                          } 
                        })
                        console.log("Keyboard sounds preference saved:", checked)
                      } catch (error) {
                        console.error("Error saving keyboard sounds preference:", error)
                      }
                    }
                  }} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="visual-feedback" className="text-foreground font-medium">
                    Visual Feedback
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show visual indicators for correct/incorrect keystrokes
                  </p>
                </div>
                <Switch 
                  id="visual-feedback" 
                  checked={visualFeedback} 
                  onCheckedChange={async (checked) => {
                    setVisualFeedback(checked)
                    // Save to user profile if user is logged in
                    if (user && profile) {
                      try {
                        await updateUserProfile(user.uid, { 
                          settings: { 
                            ...profile.settings, 
                            visualFeedback: checked 
                          } 
                        })
                        console.log("Visual feedback preference saved:", checked)
                      } catch (error) {
                        console.error("Error saving visual feedback preference:", error)
                      }
                    }
                  }} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-save-ai-tests" className="text-foreground font-medium">
                    Auto-save AI-Generated Tests
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save tests you generate to the public library
                  </p>
                </div>
                <Switch 
                  id="auto-save-ai-tests" 
                  checked={autoSaveAiTests} 
                  onCheckedChange={async (checked) => {
                    setAutoSaveAiTests(checked)
                    // Save to user profile if user is logged in
                    if (user && profile) {
                      try {
                        await updateUserProfile(user.uid, { 
                          settings: { 
                            ...profile.settings, 
                            autoSaveAiTests: checked 
                          } 
                        })
                        console.log("Auto-save AI tests preference saved:", checked)
                      } catch (error) {
                        console.error("Error saving auto-save AI tests preference:", error)
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </GlassCard>

          {/* Danger Zone Section */}
          <GlassCard className="space-y-6 border-destructive/20">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <h2 className="text-2xl font-semibold text-destructive">Danger Zone</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">Delete All Data</h3>
                <p className="text-muted-foreground">
                  This action cannot be undone. This will permanently delete your account and remove all your data from
                  our servers.
                </p>
              </div>

              <Button
                onClick={handleDeleteAccount}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete My Account
              </Button>
            </div>
          </GlassCard>

          {/* Save Changes Button Section */}
          <div className="flex justify-center">
            <Button
              onClick={async () => {
                if (!user || !profile) {
                  console.log("User not logged in, cannot save profile changes")
                  return
                }

                setIsSaving(true)
                try {
                  await updateUserProfile(user.uid, {
                    username,
                    bio,
                    preferredThemeId: currentTheme.id,
                    preferredFontId: currentFont.id,
                    settings: {
                      keyboardSounds,
                      visualFeedback,
                      autoSaveAiTests,
                    },
                  })
                  console.log("Profile updated successfully")
                } catch (error) {
                  console.error("Error updating profile:", error)
                } finally {
                  setIsSaving(false)
                }
              }}
              disabled={isSaving || !user}
              className="bg-[#00BFFF] hover:bg-[#0099CC] text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <GlassCard className="max-w-md w-full space-y-6 border-destructive/20">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <h3 className="text-xl font-semibold text-foreground">Confirm Account Deletion</h3>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">
                  This action cannot be undone. All your typing data, progress, and account information will be
                  permanently deleted.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="delete-confirmation" className="text-foreground font-medium">
                    Type "DELETE" to confirm:
                  </Label>
                  <Input
                    id="delete-confirmation"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="DELETE"
                    className="glass-card border-border bg-background/50 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleCancelDeletion}
                  variant="outline"
                  className="flex-1 border-border text-foreground hover:bg-accent bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDeletion}
                  disabled={deleteConfirmation !== "DELETE"}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Deletion
                </Button>
              </div>
            </GlassCard>
          </div>
        )}
      </main>
    </div>
  )
}
