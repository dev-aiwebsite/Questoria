# Questoria MVP - Documentation

## 1. Project Overview
**Questoria** is an interactive, gamified exploration platform designed for "curious explorers." The application blends physical location-based discovery with digital storytelling, optimized for both on-site visits and remote play.

The debut quest is set in the **Royal Botanic Gardens, Cranbourne (Victoria, Australia)**. Users are guided by a Southern Brown Bandicoot to explore winding paths, collect wild foods, and learn about the local ecosystem.

---

## 2. Tech Stack

### Framework & Core
- **Framework:** Next.js 16.0.10 (React 19)
- **Architecture:** App Router with heavy utilization of `"use client"` for interactive game logic.
- **Language:** TypeScript
- **PWA:** `next-pwa` integration for offline-ready field use.

### Frontend & UI
- **Styling:** Tailwind CSS v4.
- **Components:** Radix UI primitives for accessible overlays.
- **Animations:** Framer Motion and Embla Carousel.
- **Custom Components:** `Clouds` parallax effect and `OptimizeImage`.

### Backend & Infrastructure
- **Database:** Supabase (PostgreSQL)
- **Database Driver:** `pg` (node-postgres)
- **Authentication:** NextAuth.js v5 (Beta)
- **State Management:** Zustand.
- **Deployment:** Vercel

---

## 3. Environment Variables

To maintain security, actual credentials are not stored in this document. Please contact the lead developer for the current `.env.local` configuration.

**Contact:** [dev@aiwebsiteservices.com](mailto:dev@aiwebsiteservices.com)

Required keys include:
- `NODE_ENV`
- `DATABASE_URL` (Supabase Transaction Pooler)
- `NEXTAUTH_SECRET`
- `AUTH_TRUST_HOST`

---

## 4. Key Gameplay Modules

### Exploration Engine
- **Location-Based:** Integrated with `/lite/map` for real-time navigation.
- **Ecological Education:** Interactive guide (Southern Brown Bandicoot) that teaches users about soil health.
- **Collection Mechanics:** A system to "collect" items, stored via the `pg` driver.

### Visual Style
- **Identity:** High-contrast elements (`border-3 border-black`, `rounded-2xl`).
- **Atmosphere:** Dynamic backgrounds using the `Clouds` component.

---

## 5. Infrastructure & Deployment



### Database Strategy
- **Provider:** Supabase hosted in `ap-southeast-2` (Sydney) for low latency in Victoria.
- **Connection Pooling:** Uses the Supabase Transaction Pooler to prevent connection exhaustion.

### Build Optimizations
- **React Compiler:** Uses `babel-plugin-react-compiler` to automatically manage memoization for smooth 60fps performance.

---

## 6. Development Workflow

### Installation
```
npm install
```

### Local Development
The development script clears port 3000 before starting:
```
npm run dev
```

---

## 7. Scripts Summary
- `dev`: Kills port 3000 and starts the Next.js development server.
- `build`: Compiles the application for production.
- `start`: Launches the production server.
- `lint`: Runs code quality checks.
