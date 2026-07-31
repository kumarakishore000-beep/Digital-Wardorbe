---
agent-notes: { ctx: "ADR for AI inference via Supabase Edge Functions", deps: [AGENTS.md], state: accepted, last: "archie@2026-07-25" }
---

# ADR-0004: AI Inference via Supabase Edge Functions

## Status

Accepted

## Context

The application requires AI outfit recommendations. The AI models (e.g., OpenAI or Gemini) require API keys to function. If we embed these API keys directly into the React frontend, they will be exposed to end-users, leading to potential abuse and excessive costs.

## Decision

We will use Supabase Edge Functions as a secure proxy for AI inference. The React frontend will call the Supabase Edge Function with the user's request (e.g., "suggest an outfit for rain"), and the Edge Function will securely hold the AI API key, make the request to the AI provider, and return the result to the client.

## Consequences

### Positive
- AI API keys remain completely secure.
- We can enforce rate limiting and quotas on the Edge Function to prevent abuse.
- We can validate the user's session (JWT) on the Edge Function before making the costly AI call.

### Negative
- Adds a small amount of latency due to the proxy step.
- Increases system complexity slightly by introducing edge functions.

### Neutral
- Edge functions are written in TypeScript/Deno, which aligns reasonably well with the frontend tech stack.
