# StyleMatch AI Implementation Plan

This document outlines the step-by-step implementation plan and architectural layout for building **StyleMatch AI**, an AI-powered personal stylist MVP.

> [!WARNING]
> **Existing Vite Project Detected**
> There is an existing Vite + React project in the root directory (`vite.config.ts`, `src/`, etc.). To initialize a Next.js project cleanly in this directory, I will need to remove the existing Vite-related files (like `package.json`, `vite.config.ts`, `index.html`) before running `create-next-app`, OR we can scaffold the Next.js app in a new subdirectory (e.g., `./stylematch-ai`). 
> **Question:** Should I replace the existing project in the current directory, or create a new folder for the Next.js app?

## Proposed Changes

### STEP 1: Planning (Current Step)
- Create this implementation plan for approval.

### STEP 2: Scaffolding & Setup
- Remove conflicting Vite configuration files (if approved to overwrite).
- Run Next.js initialization: `npx -y create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- Install additional UI dependencies: `npm install lucide-react framer-motion clsx tailwind-merge`
- Configure `tailwind.config.ts` with custom brand colors, animations, and glassmorphism utilities.

### STEP 3: Mock Data & API Backend
- **[NEW]** `src/app/api/style/route.ts`
  - Implement a POST endpoint simulating the vision analysis.
  - Return structured JSON adhering strictly to:
    - `analyzedItem` (category, neckline, silhouette, pattern, primaryColor)
    - `overallAssessment` (compatibilityScore, verdict, eventCompatibility, stylistNotes)
    - `colorPalette` (primary, secondary, accent hex codes)
    - `accessoryRecommendations` (category, styleName, reasoning, search query / closet match)

### STEP 4: UI Implementation (Frontend)
- **[NEW]** `src/components/Header.tsx`
  - User greeting and live weather widget.
- **[NEW]** `src/components/Uploader.tsx`
  - Drag-and-drop zone for photos.
  - Formality and setting selectors.
  - Toggle for "Use My Closet" vs "Suggest New Retail Items".
- **[NEW]** `src/components/ResultsDashboard.tsx`
  - Display Compatibility Score, reasoning, interactive color palette, and accessory recommendation cards.
- **[MODIFY]** `src/app/page.tsx`
  - Assemble the main dashboard, integrate Framer Motion for page transitions and micro-animations to ensure a premium, modern aesthetic.

### STEP 5: Automated Browser Verification
- Start the Next.js development server locally.
- Use the automated browser subagent to:
  - Open `http://localhost:3000`
  - Upload a test image and submit the form.
  - Verify layout responsiveness (desktop and mobile viewports).
  - Confirm there are zero console errors during the flow.

## Verification Plan

### Automated Tests
- We will rely on Next.js build compilation and ESLint to catch syntax errors.

### Manual Verification
- The browser subagent will simulate a user flow and capture a recording/screenshot of the finalized UI, ensuring the glassmorphism design and rich aesthetics meet the premium quality standard.
