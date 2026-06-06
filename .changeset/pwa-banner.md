---
"rides": minor
---

Add PWA app link banner to detect installed PWA and redirect users back to their app instance when opening shared ride links in browser, preserving session state and reducing login friction.

**Features:**
- `useInstalledPWA` hook detects installed PWA via `navigator.getInstalledRelatedApps()`
- `PWARedirectBanner` component with "Open in app" CTA and dismiss functionality
- Banner shows on ride detail pages for users with installed PWA
- Dismissal persists to localStorage per ride ID
- Graceful fallback for unsupported browsers

**Components & Hooks:**
- `src/hooks/useInstalledPWA.ts` - PWA detection logic
- `src/components/PWARedirectBanner.tsx` - Alert-based banner UI
- `src/components/ui/alert.tsx` - Added `AlertAction` component
- `src/routes/ride/$id.tsx` - Integrated banner on ride details
