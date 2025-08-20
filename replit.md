# Web3 Job Agent Platform - DecentWork

## Project Overview
Platform web3 job agent yang terkonfigurasi untuk Fetch AI dengan desain premium Neo Aura menggunakan Next.js 14 App Router. Fokus pada frontend yang elegan dan advanced dengan glass morphism design.

## Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Framer Motion
- **Icons**: Lucide React
- **Font**: Inter
- **Future Integration**: Fetch AI, ICP Blockchain

## Project Architecture

### Frontend Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with sidebar + header
│   ├── page.tsx           # Dashboard
│   ├── jobs/page.tsx      # Job Board
│   ├── chat/page.tsx      # AI Chat
│   ├── analytics/page.tsx # Analytics
│   └── profile/page.tsx   # Profile
├── components/
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── Header.tsx         # Top header
│   ├── StatCard.tsx       # Metrics display card
│   ├── JobCard.tsx        # Job listing card
│   ├── ActivityFeed.tsx   # Recent activity list
│   └── ProfileForm.tsx    # User profile form
└── lib/
    └── api_client.ts      # Mock API client
```

## Design System

### Color Palette (Neo Aura Theme)
- **Background**: Radial gradient (#0E1117 → #1A103D)
- **Glass Panels**: bg-white/5 + backdrop-blur-lg + border-white/10
- **Primary Accent**: Linear gradient (#38BDF8 → #6366F1)
- **Secondary Accent**: Linear gradient (#10B981 → #F59E0B)
- **Text**: Primary #F3F4F6, Secondary #9CA3AF

### Typography
- **Font**: Inter (system-ui fallback)
- **Hierarchy**: Bold headings, medium subtitles, light body
- **Spacing**: Generous whitespace for premium feel

### Components
- **Glass Effect**: Consistent backdrop-blur with subtle borders
- **Animations**: Framer Motion for smooth transitions
- **Cards**: Hover effects with scale + glow
- **Responsive**: Mobile-first with adaptive sidebar

## User Preferences
- **Language**: Bahasa Indonesia
- **Design Style**: Premium WordPress theme aesthetic
- **UI Focus**: Advanced frontend with attention to detail
- **Theme**: Dark glass morphism with Neo Aura colors

## Development Guidelines
- Focus on visual craftsmanship over generic templates
- Implement smooth animations and micro-interactions
- Ensure responsive design for all screen sizes
- Use authentic data when possible, avoid mock placeholders
- Maintain consistent glass morphism throughout

## Recent Changes
- 2025-08-20: Initial project setup with Next.js 14 structure planned
- 2025-08-20: Design system defined with Neo Aura theme