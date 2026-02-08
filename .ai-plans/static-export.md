# Static Export Plan

## Goal

Convert the Next.js app to a fully static export (`output: 'export'`) to enable deployment to any static hosting provider (Cloudflare Pages, Netlify, Vercel as static, S3, GitHub Pages).

## Current State

- ✅ All pages are client components (Auth0 SPA)
- ✅ All data fetching uses external API
- ✅ No server actions in use
- ✅ Server infrastructure removed (drizzle, NextAuth, database)
- ⚠️ Using Next.js Image optimization (requires `sharp`)
- ⚠️ Using server-side image component

## Prerequisites Completed

- External API migration: ✅ Complete
- Server code removal: ✅ Complete
- Auth0 SPA setup: ✅ Complete

## Implementation Steps

### 1. Configure Static Export

**File: `next.config.js`**

```javascript
const config = withBundleAnalyzer({
  output: "export", // Enable static export
  reactStrictMode: true,
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      // ... keep existing patterns
    ],
  },
  // Remove experimental.serverActions - not needed for static export
});
```

### 2. Remove Sharp Dependency

**After enabling static export:**

```bash
yarn remove sharp
```

**Why:** `sharp` is only needed for server-side image optimization. Static export uses `unoptimized: true`, so `sharp` is no longer required.

### 3. Validation

```bash
# Build should create /out directory with static files
yarn build

# Check output
ls -la out/

# Test locally (requires a static file server)
npx serve out
# or
python3 -m http.server -d out 8080
```

**What to verify:**

- ✅ Build succeeds and creates `/out` directory
- ✅ No errors about server components or server actions
- ✅ All routes are present in `/out` (HTML files)
- ✅ Static assets (CSS, JS, images) are bundled
- ✅ Auth0 login works when served statically
- ✅ API calls to external API work
- ✅ All CRUD operations function correctly

### 4. Update .gitignore

Add to `.gitignore`:

```
# Static export output
/out/
```

### 5. Deployment Options

Choose one:

**Option A: Cloudflare Pages**

- Connect GitHub repo
- Build command: `yarn build`
- Output directory: `out`
- Environment variables: Add `NEXT_PUBLIC_*` vars

**Option B: Netlify**

- Build command: `yarn build`
- Publish directory: `out`
- Add environment variables in Netlify UI

**Option C: Vercel (Static)**

- Auto-detected as static export
- Environment variables automatically sync
- No configuration needed

**Option D: GitHub Pages**

- Use GitHub Actions workflow
- Deploy `out/` to gh-pages branch
- Configure custom domain if needed

## Expected Benefits

- 📦 **No server functions** - pure static HTML/CSS/JS
- ⚡ **Faster builds** - no SSR/ISR rendering
- 💰 **Cheaper hosting** - any CDN/static host works
- 🚀 **Better performance** - served from CDN edge locations
- 🔧 **Simpler deployment** - just upload files

## Known Limitations

- ❌ No server-side rendering (already migrated to client)
- ❌ No image optimization (acceptable trade-off)
- ❌ No API routes (already using external API)
- ❌ No middleware (not needed)

## Rollback Plan

If issues arise:

1. Remove `output: 'export'` from `next.config.js`
2. Remove `images.unoptimized: true`
3. Run `yarn add sharp` to restore image optimization
4. Run `yarn build` to return to hybrid mode

## Notes

- Static export is compatible with all current features since everything is client-side
- Auth0 SPA works perfectly with static hosting
- External API already handles all server-side logic
- This is the final step to complete separation from server infrastructure
