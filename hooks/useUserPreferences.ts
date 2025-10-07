// hooks/useUserPreferences.ts

import { useState, useEffect, useSyncExternalStore } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { updateUserProfile } from '@/lib/firebase/firestore';

// Types for typing preferences
export interface TypingTheme {
  id: string
  name: string
  gradient: string
  textColor: string // This will be calculated dynamically but kept for compatibility
  isDark: boolean // New: determines if theme works better in dark mode
}

export interface TypingFont {
  id: string
  name: string
  className: string
  isMonospace: boolean // New: categorize fonts
}

export interface UserPreferences {
  theme: string
  font: string
  keyboardSounds: boolean
  visualFeedback: boolean
  autoSaveAiTests: boolean
}

// Available themes and fonts
export const TYPING_THEMES: TypingTheme[] = [
  // Standard - Plain background matching website (default)
  { 
    id: "standard", 
    name: "Standard", 
    gradient: "from-background to-background", 
    textColor: "text-foreground",
    isDark: true // Works in both modes via CSS variables
  },
  
  // Subtle gradients - Professional & clean
  { 
    id: "midnight-blue", 
    name: "Midnight Blue", 
    gradient: "from-slate-900/60 via-blue-900/40 to-slate-900/60", 
    textColor: "text-blue-100",
    isDark: true
  },
  { 
    id: "forest-mist", 
    name: "Forest Mist", 
    gradient: "from-emerald-900/50 via-teal-800/30 to-emerald-900/50", 
    textColor: "text-emerald-100",
    isDark: true
  },
  
  // Vibrant multi-color gradients - Modern & energetic
  { 
    id: "neon-dreams", 
    name: "Neon Dreams", 
    gradient: "from-purple-600/40 via-pink-500/40 to-cyan-500/40", 
    textColor: "text-white",
    isDark: true
  },
  { 
    id: "sunset-blaze", 
    name: "Sunset Blaze", 
    gradient: "from-orange-600/50 via-red-500/40 to-pink-600/50", 
    textColor: "text-orange-50",
    isDark: true
  },
  { 
    id: "ocean-aurora", 
    name: "Ocean Aurora", 
    gradient: "from-cyan-600/40 via-blue-500/40 to-purple-600/40", 
    textColor: "text-cyan-50",
    isDark: true
  },
  
  // Light themes - Works great in light mode
  { 
    id: "light-sky", 
    name: "Light Sky", 
    gradient: "from-blue-100/80 via-cyan-50/80 to-blue-100/80", 
    textColor: "text-gray-900",
    isDark: false
  },
  { 
    id: "soft-lavender", 
    name: "Soft Lavender", 
    gradient: "from-purple-100/70 via-pink-50/70 to-purple-100/70", 
    textColor: "text-gray-900",
    isDark: false
  },
  
  // Complex shaded themes - Premium feel
  { 
    id: "cosmic-void", 
    name: "Cosmic Void", 
    gradient: "from-slate-950/80 via-purple-950/60 via-blue-950/60 to-slate-950/80", 
    textColor: "text-purple-100",
    isDark: true
  },
  { 
    id: "matrix-code", 
    name: "Matrix Code", 
    gradient: "from-black/90 via-green-950/70 to-black/90", 
    textColor: "text-green-400",
    isDark: true
  },
]

export const TYPING_FONTS: TypingFont[] = [
  // Monospaced fonts - For serious coding/typing practice
  { 
    id: "fira-code", 
    name: "Fira Code", 
    className: "font-[family-name:var(--font-fira-code)]",
    isMonospace: true
  },
  { 
    id: "jetbrains-mono", 
    name: "JetBrains Mono", 
    className: "font-[family-name:var(--font-jetbrains-mono)]",
    isMonospace: true
  },
  { 
    id: "source-code-pro", 
    name: "Source Code Pro", 
    className: "font-[family-name:var(--font-source-code-pro)]",
    isMonospace: true
  },
  { 
    id: "roboto-mono", 
    name: "Roboto Mono", 
    className: "font-[family-name:var(--font-roboto-mono)]",
    isMonospace: true
  },
  { 
    id: "ubuntu-mono", 
    name: "Ubuntu Mono", 
    className: "font-[family-name:var(--font-ubuntu-mono)]",
    isMonospace: true
  },
  
  // Decorative fonts - For fun/stylistic typing
  { 
    id: "playfair-display", 
    name: "Playfair Display", 
    className: "font-[family-name:var(--font-playfair-display)]",
    isMonospace: false
  },
  { 
    id: "lobster", 
    name: "Lobster", 
    className: "font-[family-name:var(--font-lobster)]",
    isMonospace: false
  },
  { 
    id: "pacifico", 
    name: "Pacifico", 
    className: "font-[family-name:var(--font-pacifico)]",
    isMonospace: false
  },
  { 
    id: "merriweather", 
    name: "Merriweather", 
    className: "font-[family-name:var(--font-merriweather)]",
    isMonospace: false
  },
  { 
    id: "righteous", 
    name: "Righteous", 
    className: "font-[family-name:var(--font-righteous)]",
    isMonospace: false
  },
]

// External store for user preferences with real-time sync
class UserPreferencesStore {
  private preferences: UserPreferences = {
    theme: 'standard', // Default to standard theme
    font: 'fira-code', // Default to Fira Code (most popular monospace)
    keyboardSounds: true,
    visualFeedback: true,
    autoSaveAiTests: false
  }
  private listeners = new Set<() => void>()

  constructor() {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('zenTypeTheme') || localStorage.getItem('zentype-typing-theme')
      const savedFont = localStorage.getItem('zenTypeFont') || localStorage.getItem('zentype-typing-font')
      const savedKeyboardSounds = localStorage.getItem('zentype-keyboard-sounds')
      const savedVisualFeedback = localStorage.getItem('zentype-visual-feedback')
      const savedAutoSaveAiTests = localStorage.getItem('zentype-auto-save-ai-tests')
      
      this.preferences = {
        theme: savedTheme || 'standard', // Default to standard
        font: savedFont || 'fira-code', // Default to Fira Code
        keyboardSounds: savedKeyboardSounds ? JSON.parse(savedKeyboardSounds) : true,
        visualFeedback: savedVisualFeedback ? JSON.parse(savedVisualFeedback) : true,
        autoSaveAiTests: savedAutoSaveAiTests ? JSON.parse(savedAutoSaveAiTests) : false
      }

      // Listen for storage events from other tabs
      window.addEventListener('storage', this.handleStorageChange)
    }
  }

  private handleStorageChange = (event: StorageEvent) => {
    let updated = false
    
    if (event.key === 'zenTypeTheme' || event.key === 'zentype-typing-theme') {
      this.preferences.theme = event.newValue || 'standard' // Default to standard
      updated = true
    } else if (event.key === 'zenTypeFont' || event.key === 'zentype-typing-font') {
      this.preferences.font = event.newValue || 'fira-code' // Default to Fira Code
      updated = true
    } else if (event.key === 'zentype-keyboard-sounds') {
      this.preferences.keyboardSounds = event.newValue ? JSON.parse(event.newValue) : true
      updated = true
    } else if (event.key === 'zentype-visual-feedback') {
      this.preferences.visualFeedback = event.newValue ? JSON.parse(event.newValue) : true
      updated = true
    } else if (event.key === 'zentype-auto-save-ai-tests') {
      this.preferences.autoSaveAiTests = event.newValue ? JSON.parse(event.newValue) : false
      updated = true
    }
    
    if (updated) {
      this.notifyListeners()
    }
  }

  getSnapshot = (): UserPreferences => {
    return this.preferences
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  setTheme = (theme: string) => {
    this.preferences = { ...this.preferences, theme }
    localStorage.setItem('zenTypeTheme', theme)
    localStorage.setItem('zentype-typing-theme', theme) // Legacy support
    
    // Dispatch storage event for cross-tab sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'zenTypeTheme', newValue: theme })
      )
    }
    
    this.notifyListeners()
  }

  setFont = (font: string) => {
    this.preferences = { ...this.preferences, font }
    localStorage.setItem('zenTypeFont', font)
    localStorage.setItem('zentype-typing-font', font) // Legacy support
    
    // Dispatch storage event for cross-tab sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'zenTypeFont', newValue: font })
      )
    }
    
    this.notifyListeners()
  }

  setKeyboardSounds = (enabled: boolean) => {
    this.preferences = { ...this.preferences, keyboardSounds: enabled }
    localStorage.setItem('zentype-keyboard-sounds', JSON.stringify(enabled))
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'zentype-keyboard-sounds', newValue: JSON.stringify(enabled) })
      )
    }
    
    this.notifyListeners()
  }

  setVisualFeedback = (enabled: boolean) => {
    this.preferences = { ...this.preferences, visualFeedback: enabled }
    localStorage.setItem('zentype-visual-feedback', JSON.stringify(enabled))
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'zentype-visual-feedback', newValue: JSON.stringify(enabled) })
      )
    }
    
    this.notifyListeners()
  }

  setAutoSaveAiTests = (enabled: boolean) => {
    this.preferences = { ...this.preferences, autoSaveAiTests: enabled }
    localStorage.setItem('zentype-auto-save-ai-tests', JSON.stringify(enabled))
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'zentype-auto-save-ai-tests', newValue: JSON.stringify(enabled) })
      )
    }
    
    this.notifyListeners()
  }

  updateFromProfile = (profile: any) => {
    let updated = false
    
    if (profile.preferredThemeId && profile.preferredThemeId !== this.preferences.theme) {
      this.preferences.theme = profile.preferredThemeId
      localStorage.setItem('zenTypeTheme', profile.preferredThemeId)
      localStorage.setItem('zentype-typing-theme', profile.preferredThemeId)
      updated = true
    }
    
    if (profile.preferredFontId && profile.preferredFontId !== this.preferences.font) {
      this.preferences.font = profile.preferredFontId
      localStorage.setItem('zenTypeFont', profile.preferredFontId)
      localStorage.setItem('zentype-typing-font', profile.preferredFontId)
      updated = true
    }

    if (profile.settings) {
      if (profile.settings.keyboardSounds !== undefined && profile.settings.keyboardSounds !== this.preferences.keyboardSounds) {
        this.preferences.keyboardSounds = profile.settings.keyboardSounds
        localStorage.setItem('zentype-keyboard-sounds', JSON.stringify(profile.settings.keyboardSounds))
        updated = true
      }
      
      if (profile.settings.visualFeedback !== undefined && profile.settings.visualFeedback !== this.preferences.visualFeedback) {
        this.preferences.visualFeedback = profile.settings.visualFeedback
        localStorage.setItem('zentype-visual-feedback', JSON.stringify(profile.settings.visualFeedback))
        updated = true
      }
      
      if (profile.settings.autoSaveAiTests !== undefined && profile.settings.autoSaveAiTests !== this.preferences.autoSaveAiTests) {
        this.preferences.autoSaveAiTests = profile.settings.autoSaveAiTests
        localStorage.setItem('zentype-auto-save-ai-tests', JSON.stringify(profile.settings.autoSaveAiTests))
        updated = true
      }
    }
    
    if (updated) {
      this.notifyListeners()
    }
  }

  private notifyListeners = () => {
    this.listeners.forEach(listener => listener())
  }
}

// Create singleton store instance
const userPreferencesStore = new UserPreferencesStore()

// Cached server snapshot to avoid infinite loop
const SERVER_SNAPSHOT = { theme: 'standard', font: 'fira-code', keyboardSounds: true, visualFeedback: true, autoSaveAiTests: false };

/**
 * Enhanced hook to manage all user preferences with real-time synchronization
 * Automatically loads preferences from user profile and applies them
 * Provides setters that sync with both localStorage and user profile
 */
export const useUserPreferences = () => {
  const { profile, user, isLoading } = useAuth();
  
  // Use useSyncExternalStore for real-time synchronization across components and tabs
  const preferences = useSyncExternalStore(
    userPreferencesStore.subscribe,
    userPreferencesStore.getSnapshot,
    () => SERVER_SNAPSHOT // Use cached server snapshot
  )

  // Update store when profile changes
  useEffect(() => {
    if (profile) {
      userPreferencesStore.updateFromProfile(profile)
    }
  }, [profile]);

  // Get current theme and font objects
  const currentTheme = TYPING_THEMES.find(t => t.id === preferences.theme) || TYPING_THEMES[0]
  const currentFont = TYPING_FONTS.find(f => f.id === preferences.font) || TYPING_FONTS[0]
  
  // Calculate dynamic text color based on theme and current system/user theme
  const [dynamicTextColor, setDynamicTextColor] = useState(currentTheme.textColor)
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Check if we're in dark mode
    const isDarkMode = document.documentElement.classList.contains('dark')
    
    // For standard theme, always use foreground color
    if (currentTheme.id === 'standard') {
      setDynamicTextColor('text-foreground')
      return
    }
    
    // For light themes in light mode or dark themes in dark mode, use theme's textColor
    // For mismatches, adjust text color for better visibility
    if (currentTheme.isDark && !isDarkMode) {
      // Dark theme in light mode - make text darker for visibility
      setDynamicTextColor('text-gray-800')
    } else if (!currentTheme.isDark && isDarkMode) {
      // Light theme in dark mode - make text lighter for visibility
      setDynamicTextColor('text-white')
    } else {
      // Perfect match - use theme's defined color
      setDynamicTextColor(currentTheme.textColor)
    }
  }, [currentTheme, preferences.theme])
  
  // Listen for theme changes (light/dark mode toggle)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkMode = document.documentElement.classList.contains('dark')
          
          if (currentTheme.id === 'standard') {
            setDynamicTextColor('text-foreground')
          } else if (currentTheme.isDark && !isDarkMode) {
            setDynamicTextColor('text-gray-800')
          } else if (!currentTheme.isDark && isDarkMode) {
            setDynamicTextColor('text-white')
          } else {
            setDynamicTextColor(currentTheme.textColor)
          }
        }
      })
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [currentTheme])

  // Theme setter with profile sync
  const setTheme = async (theme: string) => {
    userPreferencesStore.setTheme(theme)
    
    // Save to user profile if authenticated
    if (user && profile) {
      try {
        await updateUserProfile(user.uid, { preferredThemeId: theme })
        console.log('Theme preference saved to profile:', theme)
      } catch (error) {
        console.error('Error saving theme preference:', error)
      }
    }
  }

  // Font setter with profile sync
  const setFont = async (font: string) => {
    userPreferencesStore.setFont(font)
    
    // Save to user profile if authenticated
    if (user && profile) {
      try {
        await updateUserProfile(user.uid, { preferredFontId: font })
        console.log('Font preference saved to profile:', font)
      } catch (error) {
        console.error('Error saving font preference:', error)
      }
    }
  }

  // Settings setters with profile sync
  const setKeyboardSounds = async (enabled: boolean) => {
    userPreferencesStore.setKeyboardSounds(enabled)
    
    if (user && profile) {
      try {
        await updateUserProfile(user.uid, { 
          settings: { 
            ...profile.settings, 
            keyboardSounds: enabled 
          } 
        })
        console.log('Keyboard sounds preference saved:', enabled)
      } catch (error) {
        console.error('Error saving keyboard sounds preference:', error)
      }
    }
  }

  const setVisualFeedback = async (enabled: boolean) => {
    userPreferencesStore.setVisualFeedback(enabled)
    
    if (user && profile) {
      try {
        await updateUserProfile(user.uid, { 
          settings: { 
            ...profile.settings, 
            visualFeedback: enabled 
          } 
        })
        console.log('Visual feedback preference saved:', enabled)
      } catch (error) {
        console.error('Error saving visual feedback preference:', error)
      }
    }
  }

  const setAutoSaveAiTests = async (enabled: boolean) => {
    userPreferencesStore.setAutoSaveAiTests(enabled)
    
    if (user && profile) {
      try {
        await updateUserProfile(user.uid, { 
          settings: { 
            ...profile.settings, 
            autoSaveAiTests: enabled 
          } 
        })
        console.log('Auto save AI tests preference saved:', enabled)
      } catch (error) {
        console.error('Error saving auto save AI tests preference:', error)
      }
    }
  }

  return {
    // Preferences state
    preferences,
    currentTheme,
    currentFont,
    dynamicTextColor, // New: Smart text color based on theme and mode
    
    // Legacy compatibility
    themeId: preferences.theme,
    fontId: preferences.font,
    
    // Setters
    setTheme,
    setFont,
    setKeyboardSounds,
    setVisualFeedback,
    setAutoSaveAiTests,
    
    // Loading state
    isLoading,
    
    // Available options
    availableThemes: TYPING_THEMES,
    availableFonts: TYPING_FONTS
  };
};
