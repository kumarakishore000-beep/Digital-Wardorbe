---
agent-notes: { ctx: "ADR for choosing Vite as the React build tool", deps: [AGENTS.md], state: accepted, last: "archie@2026-07-25" }
---

# ADR-0003: Use Vite for React SPA

## Status

Accepted

## Context

The user requested a web application using React. We need to choose a build tool and framework. While Next.js is popular for React applications, this application is a highly interactive Single Page Application (SPA) (Wardrobe Organizer with drag-and-drop planning and complex UI states) that does not heavily benefit from Server-Side Rendering (SSR) for SEO, since most content is private to the user behind a login screen.

## Decision

We will use Vite with React to build the frontend as a Single Page Application (SPA), rather than a full-stack framework like Next.js or Remix. We will rely on Supabase for the backend.

## Consequences

### Positive
- Extremely fast development server and Hot Module Replacement (HMR).
- Simpler deployment model (static files to a CDN like Vercel or Netlify).
- Strict separation of frontend and backend (Supabase), making the architecture simpler to reason about.

### Negative
- No built-in SSR or Static Site Generation (SSG) out of the box (which we don't strictly need).
- Client-side data fetching can lead to waterfall requests if not managed properly with tools like React Query.

### Neutral
- Routing will need to be handled client-side (e.g., using React Router).
