---
agent-notes: { ctx: "initial threat model for wardrobe organizer", deps: [], state: active, last: "pierrot@2026-07-25" }
---

# Threat Model: Wardrobe Organizer

## 1. System Overview
The Wardrobe Organizer is a React Single Page Application (SPA) using Supabase for authentication, PostgreSQL database, and object storage (for clothing images). It incorporates AI outfit recommendations via an external LLM API.

## 2. Trust Boundaries
- **Client Browser:** Untrusted. User interactions and client-side state.
- **Supabase Edge:** Semi-trusted. Handles API routing and secure token validation.
- **Supabase Database/Storage:** Trusted. Holds user data and images, secured via Row Level Security (RLS).
- **External AI Provider (OpenAI/Gemini):** Trusted third-party. Processes clothing descriptions for outfit generation.

## 3. STRIDE Analysis (Initial)

### Spoofing
- **Threat:** Malicious actors attempt to access another user's wardrobe.
- **Mitigation:** Supabase Authentication (JWT) is required for all API calls.

### Tampering
- **Threat:** A user modifies another user's clothing items or outfits.
- **Mitigation:** Strict PostgreSQL Row Level Security (RLS) policies ensuring `auth.uid() = user_id` for all CRUD operations.

### Repudiation
- **Threat:** A user uploads inappropriate images and denies it.
- **Mitigation:** Database logs the `auth.uid()` of the uploader.

### Information Disclosure
- **Threat:** User images (potentially private) are accessible publicly.
- **Mitigation:** Supabase Storage bucket must be set to private, with access governed by RLS, preventing unauthorized reads.

### Denial of Service
- **Threat:** An attacker uploads massive images or spams the AI recommendation endpoint to incur costs.
- **Mitigation:** Implement rate limiting on the Supabase Edge Functions. Restrict file upload sizes (e.g., max 5MB) and types on Supabase Storage.

### Elevation of Privilege
- **Threat:** A regular user gains administrative access to view all wardrobes.
- **Mitigation:** Ensure no overarching "admin" roles are accessible via the client, relying purely on RLS.
