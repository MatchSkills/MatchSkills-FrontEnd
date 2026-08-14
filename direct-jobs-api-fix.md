# Plan: Direct Jobs API Integration & F5 Session Fix

## Overview
Remove intermediate `/api/jobs-proxy` Next.js rewrites and point directly to `https://matchskills-jobposting-service.onrender.com`. Fix session hydration on reload (F5) so that genuine company IDs (e.g. `4`) are sent instead of fallback values (`comp_1`), and remove silent catch fallbacks in `jobs.service.ts` that masked database errors.

## Proposed Tasks
1. **Direct Backend API Configuration**:
   - Update `src/lib/env.ts` to default `JOB_POSTING_API_URL` and `API_URL` directly to Render backend endpoints.
   - Update `.env.local` and `.env.example` with direct URLs.
   - Remove/cleanup rewrite rules in `next.config.ts`.
2. **Session Hydration & Auth Fixes (F5)**:
   - Ensure `AuthContext` hydrates session immediately and synchronizes `setAccessToken`.
   - Update `src/lib/axios.ts` to attach auth token consistently from storage.
3. **Remove Silent Mock Fallbacks**:
   - Update `src/services/jobs.service.ts` to propagate real API responses and errors.
   - Guard `CreateJobPage` and `useJobs` against unauthenticated/undefined `companyId`.
4. **Verification**:
   - Test Direct API requests without proxy.
   - Verify persistence in Render database after F5.
   - Run typecheck and linting.
