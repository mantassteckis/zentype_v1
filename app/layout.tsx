import type React from "react"
import { 
  Inter, 
  Fira_Code, 
  JetBrains_Mono, 
  Source_Code_Pro, 
  Roboto_Mono, 
  Ubuntu_Mono,
  Playfair_Display,
  Lobster,
  Pacifico,
  Merriweather,
  Righteous
} from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/AuthProvider"
import { DebugProvider } from "@/context/DebugProvider"
import { EnhancedDebugPanel } from "@/components/debug/EnhancedDebugPanel"

const inter = Inter({ subsets: ["latin"] })

// Monospaced fonts for serious typing practice
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" })
const sourceCodePro = Source_Code_Pro({ subsets: ["latin"], variable: "--font-source-code-pro" })
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" })
const ubuntuMono = Ubuntu_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-ubuntu-mono" })

// Decorative fonts for fun/stylistic typing
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display" })
const lobster = Lobster({ weight: "400", subsets: ["latin"], variable: "--font-lobster" })
const pacifico = Pacifico({ weight: "400", subsets: ["latin"], variable: "--font-pacifico" })
const merriweather = Merriweather({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-merriweather" })
const righteous = Righteous({ weight: "400", subsets: ["latin"], variable: "--font-righteous" })

export const metadata = {
  title: "ZenType - Find Your Flow. Master Your Typing.",
  description: "A modern, AI-powered typing platform designed for focus, improvement, and seamless practice.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${firaCode.variable} ${jetbrainsMono.variable} ${sourceCodePro.variable} ${robotoMono.variable} ${ubuntuMono.variable} ${playfairDisplay.variable} ${lobster.variable} ${pacifico.variable} ${merriweather.variable} ${righteous.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <DebugProvider>
            <AuthProvider>
              {children}
              <EnhancedDebugPanel />
            </AuthProvider>
          </DebugProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
