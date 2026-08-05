---
agent-notes: { ctx: "architecture tracking for wardrobe organizer", deps: [docs/adrs/0003-use-vite-for-react-spa.md, docs/adrs/0004-ai-inference-via-supabase-edge-functions.md], state: active, last: "archie@2026-07-25" }
---

# Architecture: Wardrobe Organizer

**Date:** 2026-07-25
**Lead:** Archie
**Status:** Complete
**Prior Phase:** [Discovery](./2026-07-25-wardrobe-organizer-discovery.md)

## Key Decisions
- Chose Vite + React for the frontend over Next.js because this is a highly interactive, authenticated SPA that doesn't strictly need SSR. (ADR 0003)
- Chose Supabase Edge Functions for AI inference proxy to protect API keys instead of client-side calls. (ADR 0004)
- Accepted Wei's point about edge function latency but favored the unified Supabase ecosystem over managing a custom Node.js backend.
- Initial Threat Model prioritizes strict RLS policies on Supabase to ensure users can only access their own items and images.

## Artifacts Produced
- `docs/security/threat-model.md`
- `docs/adrs/0003-use-vite-for-react-spa.md`
- `docs/adrs/0004-ai-inference-via-supabase-edge-functions.md`

## Open Questions
- Specific schemas for the database tables.

## Next Phase
- Phase 4: Acceptance Criteria & Phase 5: Planning
