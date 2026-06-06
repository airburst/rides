# PWA App Link Banner Implementation Plan

**Feature:** Intercept shared ride links and redirect PWA users back to their installed app, preserving session state and reducing login friction.

**Status:** Ready for implementation
**Priority:** Medium (UX improvement)
**Timeline:** 1-2 sprints

---

## Problem Statement

When users click a shared ride link (e.g., `/r/33742d`) from email, WhatsApp, or other external apps:

1. Link opens in a new browser tab instead of the installed PWA
2. New browser session has no auth cookies → user must login again
3. Auth in browser tab doesn't sync with PWA session
4. User has two separate app instances and poor UX

**Solution:** Detect installed PWA and redirect to app instance, keeping user in their existing session.

---

## Technical Requirements

### 1. **Web App Manifest**

Ensure `public/manifest.json` is properly configured:

```json
{
  "name": "BCC Rides",
  "short_name": "Rides",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Link in `index.html`:

```html
<link rel="manifest" href="/manifest.json" />
```

### 2. **Platform-Specific Configuration**

#### Android (Optional - for deep linking)

Add to `manifest.json`:

```json
{
  "prefer_related_applications": true,
  "related_applications": [
    {
      "platform": "play",
      "url": "https://play.google.com/store/apps/details?id=net.fairhursts.rides",
      "id": "net.fairhursts.rides"
    }
  ]
}
```

#### iOS (Optional - for universal links)

No manifest entry needed; configure via Apple App Site Association file (when native app exists).

---

## Implementation Steps

### Phase 1: Detect Installed PWA

**File:** `src/hooks/useInstalledApps.ts`

```typescript
export async function detectInstalledPWA(): Promise<boolean> {
  if (!navigator.getInstalledRelatedApps) {
    // Fallback for browsers that don't support the API
    return false;
  }

  try {
    const apps = await navigator.getInstalledRelatedApps();
    return apps.length > 0;
  } catch (error) {
    console.error("Error checking installed apps:", error);
    return false;
  }
}

export function useInstalledPWA() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    detectInstalledPWA().then((installed) => {
      setIsInstalled(installed);
      setIsLoading(false);
    });
  }, []);

  return { isInstalled, isLoading };
}
```

### Phase 2: Banner Component

**File:** `src/components/PWARedirectBanner.tsx`

```typescript
import { useEffect, useState } from "react";
import { useInstalledPWA } from "../hooks/useInstalledApps";

interface PWARedirectBannerProps {
  targetPath: string; // e.g., "/r/33742d"
  dismissKey?: string; // localStorage key to track dismissals
}

export function PWARedirectBanner({
  targetPath,
  dismissKey = "pwa-banner-dismissed",
}: PWARedirectBannerProps) {
  const { isInstalled, isLoading } = useInstalledPWA();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(dismissKey);
    setIsDismissed(dismissed === "true");
  }, [dismissKey]);

  if (isLoading || !isInstalled || isDismissed) {
    return null;
  }

  const handleOpenInApp = () => {
    // Use the manifest's start_url to open PWA
    // This relies on the PWA already being installed
    window.location.href = targetPath;
  };

  const handleDismiss = () => {
    localStorage.setItem(dismissKey, "true");
    setIsDismissed(true);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white px-4 py-3 shadow-md z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <span className="text-sm">Open in app for the best experience</span>
        <div className="flex gap-2">
          <button
            onClick={handleOpenInApp}
            className="px-4 py-1 bg-white text-blue-500 rounded font-semibold text-sm hover:bg-gray-100"
          >
            Open
          </button>
          <button
            onClick={handleDismiss}
            className="px-2 py-1 text-white hover:bg-blue-600 rounded text-sm"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Phase 3: Integration with Ride Page

**File:** `src/routes/ride/[id].tsx` (or equivalent)

```typescript
import { PWARedirectBanner } from "../components/PWARedirectBanner";

export default function RidePage() {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);

  // ... load ride data

  return (
    <>
      {/* Show banner only if PWA is installed */}
      <PWARedirectBanner
        targetPath={`/r/${rideId}`}
        dismissKey={`pwa-banner-ride-${rideId}`}
      />

      {/* Ride details */}
      <div className="pt-16">
        {" "}
        {/* Add padding to account for banner */}
        {/* Ride content */}
      </div>
    </>
  );
}
```

Or for short links (`/r/33742d`):

```typescript
export default function RideShortLink() {
  const { shortCode } = useParams();

  return (
    <>
      <PWARedirectBanner
        targetPath={`/r/${shortCode}`}
        dismissKey={`pwa-banner-${shortCode}`}
      />
      <RideDetail shortCode={shortCode} />
    </>
  );
}
```

### Phase 4: Service Worker Enhancement (Optional)

To make deep linking even more robust, update the Service Worker to handle external navigations:

**File:** `public/service-worker.js`

```javascript
self.addEventListener("fetch", (event) => {
  // Check if the request is a document navigation (not a fetch/XHR)
  if (
    event.request.mode === "navigate" &&
    event.request.destination === "document"
  ) {
    // Could add logic here to intercept and redirect
    // For now, just let normal navigation happen
    // (banner handles the UX redirect)
  }
});
```

---

## User Flow

1. User receives shared ride link via email/WhatsApp: `https://bcc-rides.vercel.app/r/33742d`
2. Clicks link → opens in browser (not PWA)
3. Page loads in browser tab
4. `detectInstalledPWA()` runs:
   - If PWA is installed → show "Open in app" banner
   - If not installed → show nothing (browser session is fine)
5. User clicks "Open" button:
   - Browser redirects to `/r/33742d`
   - PWA intercepts the route (via Service Worker or manifest scope)
   - PWA launches with user's existing session intact
   - User sees ride details, clicks "join" → already logged in
6. User can dismiss banner (localStorage remembers dismissal)

---

## Testing

### Manual Testing

1. **Install PWA**:
   - Visit app on desktop/mobile
   - "Install app" prompt → install to home screen

2. **Test banner visibility**:
   - Visit app in browser (not PWA) → no banner
   - Install PWA
   - Visit app in browser → banner appears

3. **Test click-through**:
   - Click "Open" → PWA launches with same route
   - Ride details visible
   - User session is preserved (no login needed)

4. **Test dismissal**:
   - Click "✕" → banner hidden
   - Reload page → banner gone (stored in localStorage)
   - Clear localStorage → banner reappears

### Automated Testing

```typescript
// __tests__/PWARedirectBanner.test.tsx
import { render, screen } from "@testing-library/react";
import { PWARedirectBanner } from "../components/PWARedirectBanner";

describe("PWARedirectBanner", () => {
  it("should not render if PWA not installed", async () => {
    // Mock getInstalledRelatedApps to return empty
    const { container } = render(<PWARedirectBanner targetPath="/r/123" />);
    expect(container.firstChild).toBeNull();
  });

  it("should render if PWA is installed", async () => {
    // Mock getInstalledRelatedApps to return app
    render(<PWARedirectBanner targetPath="/r/123" />);
    expect(screen.getByText(/Open in app/)).toBeInTheDocument();
  });

  it("should hide after dismissal", async () => {
    const { rerender } = render(
      <PWARedirectBanner targetPath="/r/123" dismissKey="test-key" />,
    );
    screen.getByLabelText("Dismiss").click();
    // localStorage now has dismissKey=true
    rerender(<PWARedirectBanner targetPath="/r/123" dismissKey="test-key" />);
    expect(screen.queryByText(/Open in app/)).not.toBeInTheDocument();
  });
});
```

---

## Browser Support

| Browser          | Support | Note                                               |
| ---------------- | ------- | -------------------------------------------------- |
| Chrome (desktop) | ✅      | `getInstalledRelatedApps()` supported              |
| Chrome (Android) | ✅      | Full support                                       |
| Safari (iOS 15+) | ⚠️      | Limited; use Universal Links (requires native app) |
| Firefox          | ❌      | No `getInstalledRelatedApps()` support             |
| Edge             | ✅      | Full support                                       |

**Fallback:** For unsupported browsers, the API returns `false` and no banner is shown (graceful degradation).

---

## Deployment Checklist

- [ ] `manifest.json` deployed with correct `start_url` and `scope`
- [ ] Service Worker updated (optional)
- [ ] PWA banner component added to ride pages
- [ ] Tests passing (manual + automated)
- [ ] localStorage key naming consistent
- [ ] Banner styling matches app theme
- [ ] "Open in app" button has clear CTA
- [ ] Dismiss functionality tested
- [ ] Monitored metrics: banner impressions, click-through rate

---

## Metrics to Track

- **Banner impression rate**: % of PWA users who see banner on ride pages
- **Click-through rate**: % of users who click "Open in app"
- **Dismissal rate**: % of users who dismiss banner
- **Session continuity**: Compare re-login frequency before/after

---

## Future Enhancements

1. **Android App Links** (when native app released):
   - Use intent URLs to deeper intercept external links
   - Reduce reliance on JavaScript detection

2. **iOS Universal Links** (when native app released):
   - Similar to Android App Links, but for iOS

3. **Custom URL Scheme** (hybrid app phase):
   - `bcc-rides://r/33742d` for explicit app launching

4. **Broadcast Channel API** (advanced):
   - If user has both browser tab + PWA open, sync state between them
   - When user joins from browser tab, PWA gets notified
