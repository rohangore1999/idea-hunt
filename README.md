# IdeaHunt

Discover startup and product ideas aggregated from Reddit, Hacker News, Dev.to and more — updated every 6 hours.

🌐 **Live:** [idea-hunt.rohangore.com](https://idea-hunt.rohangore.com)

---

## What it does

IdeaHunt aggregates posts from across the internet where people share startup ideas, product wishes, and "someone should build this" moments. It classifies each idea into a category, lets you filter by source/category, and surfaces the most upvoted ideas first.

---

## High-Level Architecture

```
Browser
  │
  ├── Page loads → calls /api/ideas (Next.js API Route)
  │
  └── /api/ideas
        │
        ├── Pullpush API  ──→ r/SomebodyMakeThis, r/AppIdeas, r/Entrepreneur
        ├── HN RSS Feed   ──→ hnrss.org (newest posts matching idea keywords)
        └── Dev.to API    ──→ #buildinpublic, #indiehackers tags
              │
              ▼
        Filter by intent signals (idea/build/make/wish/need...)
              │
              ▼
        Classify into 14 categories (keyword-based, no AI)
              │
              ▼
        Paginate → return JSON to browser
              │
              ▼
        Masonry grid with infinite scroll
```

---

## Data Sources

| Source | What we pull | How |
|--------|-------------|-----|
| **r/SomebodyMakeThis** | "Someone build this" product ideas | Pullpush API (Reddit mirror) |
| **r/AppIdeas** | App-specific ideas | Pullpush API |
| **r/Entrepreneur** | Startup discussions with idea signals | Pullpush API |
| **Hacker News** | Posts matching "steal this idea", "startup idea", "wish there was" | HNRSS.org RSS feed |
| **Dev.to** | Articles tagged `#buildinpublic`, `#indiehackers` | Dev.to REST API |

> **Why Pullpush instead of Reddit's own API?**
> Reddit's `.json` API blocks requests from datacenter IPs (like Vercel/AWS). Pullpush.io is a public Reddit data mirror built for programmatic access from any server.

---

## Classification

Each idea is auto-classified into one of 14 categories using keyword matching — no AI or paid APIs involved:

`Consumer Apps` · `B2B/SaaS` · `Developer Tools` · `AI/ML` · `FinTech` · `Health & Wellness` · `Education` · `E-commerce` · `Social Impact` · `Gaming` · `Real Estate` · `Transport` · `Food & Beverage` · `Productivity`

Each idea gets 1 primary category + up to 2 secondary categories, with a confidence score (High / Medium / Low).

---

## Tech Stack

- **Next.js 15** (App Router, JavaScript)
- **Tailwind CSS v4**
- **shadcn/ui** (Base UI components)
- **Framer Motion** (animations)
- **react-responsive-masonry** (Pinterest-style layout)
- **rss-parser** (HN RSS parsing)
- **Vercel** (hosting, edge functions)

---

## Caching

API responses are cached for **6 hours** via Next.js `revalidate`. No database — all data is fetched live and cached at the edge.

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```
