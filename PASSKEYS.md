# Biometric Login (Face ID / Fingerprint) for iPhone & Android

## Context

The app is a **web SPA** (not a native app), so "biometric login" means **WebAuthn / Passkeys** — the web standard that allows browsers to trigger Face ID on iOS Safari and fingerprint/face unlock on Android Chrome. This is distinct from native biometric APIs in iOS/Android apps.

Auth0 natively supports passkeys, and since this app uses Auth0 Universal Login (`loginWithRedirect()`), most of the biometric UI is handled by Auth0's login page — **no app code changes are required**.

---

## How It Works on the Web

- iOS Safari → triggers **Face ID** or **Touch ID** via WebAuthn
- Android Chrome → triggers **fingerprint or face unlock** via WebAuthn
- The browser generates a hardware-bound credential (a passkey) stored in the device's secure enclave / keychain
- Auth0 acts as the relying party, verifying the WebAuthn assertion

---

## Auth0 Changes Required

### 1. Enable Passkeys in the Auth0 Dashboard

- Go to **Authentication → Passkeys** in your Auth0 tenant
- Enable the **Passkey** authenticator
- Choose your User Verification preference: `required` (always biometric), `preferred` (biometric if available, fallback to PIN), or `discouraged`
- Recommended: `preferred` — allows fallback if the device lacks biometrics

### 2. Configure Universal Login (New Experience required)

- Auth0 Passkeys only work with the **New Universal Login** experience (not Classic)
- Verify at: **Branding → Universal Login → Experience** → set to "New"
- The login page will automatically show a passkey/biometric option alongside the existing email/password flow

### 3. Application Settings (may already be correct)

- Ensure `offline_access` scope is still requested (already done in `Providers.tsx`)
- Verify your **Allowed Origins** include the app's domain (for WebAuthn's origin binding)
- No changes to Client Type needed — it's already a SPA

### 4. Optional: Make Passkeys the Primary Factor

- Under **Authentication → Authentication Profile**, you can configure passkeys as the first factor
- Or use **Multi-Factor Authentication** to require passkeys as a second factor after password

---

## Refresh Token & Session Lifetime — Unchanged

**Passkeys do not change how often users are prompted to log in.**

The current app uses:

- `useRefreshTokens={true}` — silent token renewal via refresh tokens (no user interaction, no biometrics)
- `offline_access` scope — enables long-lived refresh tokens
- `cacheLocation="localstorage"` — tokens survive page refreshes

**What triggers a passkey prompt:** Only a full re-authentication event — i.e., the Auth0 session expires. This is governed by Auth0 tenant-level settings (**Tenant Settings → Advanced → Log in session management**: Inactivity Timeout + Require Login After). These settings are independent of the authentication method. If users currently stay logged in for 30 days, they'll still stay logged in for 30 days with passkeys.

**What never triggers a passkey prompt:** `getAccessTokenSilently()` — the silent refresh token renewal that runs constantly in the background. This is unaffected by passkeys.

Passkeys simply replace the password box at the Auth0 login page. The cadence of that page appearing is identical to today.

---

## App Code Changes

**None required.** Since all auth happens on Auth0's Universal Login page:

- `loginWithRedirect()` call — same as today
- Token handling, `useSession`, `useApiClient` — unchanged
- `Providers.tsx` Auth0 config — unchanged
- `cacheLocation="localstorage"` — correct for SPA, unchanged

---

## Important Limitations

| Constraint              | Detail                                                                                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Web app only**        | This is WebAuthn/Passkeys, not native biometrics. Works in Safari/Chrome on mobile. Doesn't work in all in-app WebViews (e.g., Instagram/Facebook browser). |
| **Device registration** | Each phone must register a passkey first (on first login with biometrics) — it's not automatic for existing users                                           |
| **Fallback**            | Users without biometrics can still use email/password — passkeys coexist with existing auth                                                                 |
| **PWA behaviour**       | The app already handles the Android PWA/standalone case in `Providers.tsx` (`useRefreshTokensFallback`) — this is unaffected                                |

---

## Verification

1. Enable Passkeys in Auth0 dashboard (steps above)
2. Open the app on an iPhone in Safari → click Sign In → Auth0 login page should show a "Sign in with a passkey" or fingerprint/Face ID option
3. First-time users will be prompted to register a passkey
4. Subsequent logins will trigger Face ID / Touch ID directly
5. Verify the returned token still works with `GET /users/me` (it will — token format is unchanged)
