# ZenType ⌨️# ZenType



**Type What You Love. Type What You Want.***Automatically synced with your [v0.app](https://v0.app) deployments*



A modern, minimalist typing test application that helps you improve your typing speed and accuracy while staying in your flow state. Built with Next.js, Firebase, and Google Gemini AI.[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/steckismantas0-gmailcoms-projects/v0-zen-type)

[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/s2qmeRrWrD6)

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://solotype-23c1f.web.app)

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org)## Overview

[![Powered by Firebase](https://img.shields.io/badge/Powered%20by-Firebase-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com)

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).

---Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).



## 🌐 Live Demo## Deployment



**Production:** [https://solotype-23c1f.web.app](https://solotype-23c1f.web.app)  Your project is live at:

**Alternative:** [https://zentype-v0--solotype-23c1f.europe-west4.hosted.app](https://zentype-v0--solotype-23c1f.europe-west4.hosted.app)

**[https://vercel.com/steckismantas0-gmailcoms-projects/v0-zen-type](https://vercel.com/steckismantas0-gmailcoms-projects/v0-zen-type)**

---

## Build your app

## ✨ Features

Continue building your app on:

### 🎯 Core Typing Experience

- **Word-Based Typing Tests** - Clean, distraction-free interface with real-time feedback**[https://v0.app/chat/projects/s2qmeRrWrD6](https://v0.app/chat/projects/s2qmeRrWrD6)**

- **MonkeyType-Style Metrics** - Industry-standard WPM calculation (Gross WPM formula)

- **Real-Time Accuracy** - Character-level accuracy tracking with instant visual feedback## How It Works

- **Multiple Difficulty Levels** - Easy, Medium, and Hard tests to match your skill level

- **Flexible Time Limits** - Choose from 30, 60, 120, or 300 second tests1. Create and modify your project using [v0.app](https://v0.app)

2. Deploy your chats from the v0 interface

### 🤖 AI-Powered Content3. Changes are automatically pushed to this repository

- **Gemini AI Integration** - Generate personalized typing tests on any topic4. Vercel deploys the latest version from this repository

- **Interest-Based Tests** - AI learns from your preferences to create engaging content
- **Smart Topic Selection** - From programming to literature, type what interests you

### 📊 Progress Tracking
- **Detailed Statistics** - Track your WPM, accuracy, and error rate over time
- **Test History** - Review all your past tests with complete metrics
- **Personal Dashboard** - Visualize your typing improvement journey
- **Leaderboard** (Coming Soon) - Compare your skills with other typists globally

### 🎨 Modern UX/UI
- **Dark/Light Theme** - Comfortable typing in any lighting condition
- **Butter-Smooth Animations** - Zero-lag visual updates even at 100+ WPM
- **Responsive Design** - Perfect experience on desktop, tablet, and mobile
- **Accessibility First** - Built with keyboard navigation and screen reader support

---

## 🚀 Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first styling
- **[Radix UI](https://www.radix-ui.com)** - Accessible component primitives
- **[shadcn/ui](https://ui.shadcn.com)** - Beautiful, reusable components

### Backend
- **[Firebase Auth](https://firebase.google.com/products/auth)** - Secure authentication with Google OAuth
- **[Firestore](https://firebase.google.com/products/firestore)** - Real-time NoSQL database
- **[Firebase Cloud Functions](https://firebase.google.com/products/functions)** - Serverless backend logic
- **[Google Gemini AI](https://ai.google.dev)** - AI-powered test generation

### DevOps & Infrastructure
- **[Vercel](https://vercel.com)** - Edge deployment and hosting
- **[Firebase App Hosting](https://firebase.google.com/products/app-hosting)** - Alternative hosting
- **[Google Cloud Logging](https://cloud.google.com/logging)** - Centralized log aggregation
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD automation

---

## 🏗️ Architecture

ZenType follows a modern, scalable architecture:

- **Next.js App Router** for SSR and client-side routing
- **API Routes** for backend endpoints with middleware
- **Firebase Cloud Functions** for intensive operations (AI generation, result processing)
- **Firestore** with optimized indexes for fast queries
- **Correlation ID tracking** for request tracing across distributed services
- **Rate limiting** on all Firebase Cloud Functions (20-100 req/hour per user)
- **CORS whitelisting** for production security

See `docs/MAIN.md` for complete internal documentation.

---

## 🎮 How to Use

### 1. **Choose Your Test**
- Select pre-made tests by difficulty (Easy/Medium/Hard)
- Or generate AI-powered tests on any topic you want

### 2. **Start Typing**
- Focus on accuracy first, speed will follow
- Use the visual feedback to correct errors in real-time
- Space bar advances to the next word (no empty spaces!)

### 3. **Review Your Results**
- See your WPM (words per minute) - calculated using MonkeyType's standard formula
- Check your accuracy percentage - character-level precision
- Review errors and time spent

### 4. **Track Your Progress**
- All results are automatically saved to your profile
- View your history and statistics in the dashboard
- Watch your improvement over time!

---

## 📈 WPM Calculation

ZenType uses the **Gross WPM formula** - the same standard used by MonkeyType:

```
WPM = (total_characters_typed / 5) / time_in_minutes
```

**Why Gross WPM?**
- Industry standard for typing tests
- Consistent with MonkeyType and other popular platforms
- Fair comparison across different test types
- Accuracy is tracked separately for clear metrics

---

## 🛠️ Development

### Prerequisites
- Node.js 18+ and pnpm
- Firebase project with Firestore and Cloud Functions enabled
- Google Cloud API key for Gemini AI

### Local Setup

```bash
# Clone the repository
git clone https://github.com/mantassteckis/zentype_v1.git
cd zentype_v1

# Install dependencies
pnpm install

# Set up environment variables
cp env.local.example env.local
# Edit env.local with your Firebase config

# Run development server
pnpm dev
```

Visit `http://localhost:3000` to see the app.

### Firebase Functions

```bash
cd functions
pnpm install
pnpm build

# Deploy functions
firebase deploy --only functions
```

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 📝 API Documentation

For developers integrating with ZenType or contributing to the project:

- **API Endpoints:** See `docs/API_ENDPOINTS.md`
- **Firestore Schema:** See `docs/FIRESTORE_SCHEMA.md`
- **Architecture Guide:** See `docs/API_DESIGN_DOCUMENTATION.md`

All endpoints support:
- Correlation ID tracking for debugging
- Rate limiting for security
- CORS whitelisting for production environments
- Structured error responses

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Bugs** - Open an issue with detailed reproduction steps
2. **Suggest Features** - Share your ideas in GitHub Discussions
3. **Submit PRs** - Fork, create a feature branch, and submit a pull request
4. **Improve Docs** - Help us make documentation clearer

### Development Guidelines
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Test on multiple browsers before submitting PRs
- Keep accessibility in mind (keyboard navigation, ARIA labels)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **MonkeyType** - Inspiration for WPM calculation and UX patterns
- **Vercel** - Excellent deployment platform and edge functions
- **Firebase** - Robust backend infrastructure
- **Google Gemini AI** - Powerful AI for content generation
- **shadcn/ui** - Beautiful component library

---

## 📧 Contact

**Project Maintainer:** Mantas Steckis  
**Repository:** [github.com/mantassteckis/zentype_v1](https://github.com/mantassteckis/zentype_v1)

For questions or support, please open an issue on GitHub.

---

<div align="center">

**Type what you love. Type what you want.**

Made with ❤️ by the ZenType team

[🌐 Try ZenType Now](https://solotype-23c1f.web.app) | [📚 Documentation](docs/MAIN.md) | [🐛 Report Issues](https://github.com/mantassteckis/zentype_v1/issues)

</div>
