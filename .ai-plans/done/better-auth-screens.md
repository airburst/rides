# Frontend Auth Screens: Better-Auth with Dual-Running

## Context

The API supports better-auth email/password signup with Resend verification emails. The frontend needs custom auth screens so new club members can sign up, verify, and log in — while existing BCC members continue using Auth0 until cutover. A build-time env var `VITE_AUTH_PROVIDER` controls which auth flow the "Log in" menu item triggers.

---

## New Env Var
ß
Add to `src/env.ts`:

```typescript
VITE_AUTH_PROVIDER: z.enum(["auth0", "better-auth"]).default("auth0"),
```

Add to `.env.example` and `.env.local`:

```
VITE_AUTH_PROVIDER=better-auth
```

---

## New Hooks (`src/hooks/auth/`)

### `useSignup.ts`

```typescript
type SignupInput = { name: string; email: string; password: string };
type SignupResponse = { success: boolean; requiresVerification: boolean };
export function useSignup(
  slug: string,
): UseMutationResult<SignupResponse, ApiError, SignupInput>;
```

- `apiClient<SignupResponse>(`/signup/club/${slug}`, { method: "POST", body: JSON.stringify(input) })`

### `useBetterAuthLogin.ts`

```typescript
type LoginInput = { email: string; password: string };
type LoginResponse = {
  token: string;
  user: { id: string; name: string; email: string; emailVerified: boolean };
};
export function useBetterAuthLogin(): UseMutationResult<
  LoginResponse,
  ApiError,
  LoginInput
>;
```

- `fetch(API_URL + "/api/auth/sign-in/email", { method: "POST", credentials: "include", headers: {"Content-Type": "application/json"}, body })`
- On success: invalidates `["currentUser"]` and `["betterAuthSession"]` queries

### `useBetterAuthSession.ts`

```typescript
type SessionResponse = { session: { id: string; expiresAt: string } | null; user: { ... } | null };
export function useBetterAuthSession(enabled: boolean): UseQueryResult<SessionResponse | null>;
```

- `fetch(API_URL + "/api/auth/get-session", { credentials: "include" })`
- `enabled` param: only fires when Auth0 is not authenticated

### `useBetterAuthLogout.ts`

```typescript
export function useBetterAuthLogout(): UseMutationResult<void, ApiError, void>;
```

- `fetch(API_URL + "/api/auth/sign-out", { method: "POST", credentials: "include" })`
- On success: invalidates all queries, navigates to `/`

### `useRequestPasswordReset.ts`

```typescript
type ResetInput = { email: string };
export function useRequestPasswordReset(): UseMutationResult<
  { status: boolean },
  ApiError,
  ResetInput
>;
```

### `useResetPassword.ts`

```typescript
type ResetPasswordInput = { token: string; newPassword: string };
export function useResetPassword(): UseMutationResult<
  void,
  ApiError,
  ResetPasswordInput
>;
```

---

## New Routes

### `src/routes/auth/signup.$slug.tsx` — Club Signup

- Form: name, email, password, confirm password
- Zod schema: name min 1, email valid, password min 8, confirm === password
- Submits: `POST /signup/club/:slug` via `useSignup(slug)`
- On 201: navigate to `/auth/verify-pending?email=...`
- Errors:
  - 409 "Already a member": toast + "Log in instead" link
  - 409 "Account exists": toast + "Log in instead" link
  - 400: inline field errors
  - 500: toast "Something went wrong, please try again"
- Footer: "Already have an account? Log in" → `/auth/login`

### `src/routes/auth/verify-pending.tsx` — Check Your Email

- Informational only (no API calls)
- Reads `?email=` search param
- Content: mail icon, "Check your email" heading, instructions, spam hint
- Link: "Back to login" → `/auth/login`

### `src/routes/auth/verified.tsx` — Email Verified

- Landing page after API's verify-email 302 redirect
- Content: success icon, "Email verified!", "Log in" button → `/auth/login`

### `src/routes/auth/login.tsx` — Login

- Form: email, password
- Submits via `useBetterAuthLogin()`
- On success: navigate to `/`
- Errors:
  - 401 `INVALID_EMAIL_OR_PASSWORD`: inline alert "Incorrect email or password"
  - 403 `EMAIL_NOT_VERIFIED`: inline alert "Please verify your email first" + resend link
  - Network: toast
- Footer:
  - "Don't have an account? Sign up" → `/auth/signup/:slug`
  - "Forgot password?" → `/auth/forgot-password`
  - "Existing member? Log in with Auth0" button (calls `loginWithRedirect()`)

### `src/routes/auth/forgot-password.tsx` — Request Reset

- Form: email
- Submits via `useRequestPasswordReset()` with `{ email, redirectTo: origin + "/auth/reset-password" }`
- Always shows: "If this email exists, check your inbox for a reset link"

### `src/routes/auth/reset-password.tsx` — New Password

- Reads `?token=` and `?error=` search params
- If `?error=INVALID_TOKEN`: "This link has expired" + link to forgot-password
- Form: new password, confirm password
- Submits via `useResetPassword()`
- On success: toast "Password updated" + navigate to `/auth/login`
- On error: toast "Reset failed, request a new link"

---

## Changes to Existing Files

### `src/hooks/useSession.ts` — Dual Auth

Resolution order:

1. Auth0 `isAuthenticated` → existing flow (token → `/users/me` with Bearer)
2. Auth0 not authenticated → `useBetterAuthSession` query (cookie-based)
3. If better-auth session active → fetch `/users/me` with `credentials: "include"`
4. Neither → unauthenticated

Changes:

- Import `useBetterAuthSession`; enable only when `!isAuth0Authenticated && !isAuth0Loading`
- Add second React Query call for `/users/me` with `credentials: "include"` when better-auth session active
- `login`: if `VITE_AUTH_PROVIDER === "better-auth"` → `navigate({ to: "/auth/login" })`; else → `loginWithRedirect()`
- `logout`: dispatch to correct provider based on active session type
- Return shape unchanged: `{ session, isLoading, isAuthenticated, login, logout }`

### `src/lib/api.ts` — No structural changes

Better-auth hooks use `fetch` directly with `credentials: "include"`. The existing `apiClient` stays for Auth0-token API calls. Authenticated requests after better-auth login go through the `/users/me` query in useSession (which uses fetch directly).

### `src/components/UserMenu/MenuContent.tsx`

Add "Sign up" below "Log in" for unauthenticated users:

```tsx
{
  !isAuthenticated && (
    <>
      <MenuEntry label="Log in" onClick={handleSignin}>
        <LogIn className="h-6 w-6" />
      </MenuEntry>
      <MenuEntry label="Sign up" href="/auth/signup/bcc" onClick={closeMenu}>
        <UserPlus className="h-6 w-6" />
      </MenuEntry>
    </>
  );
}
```

The `handleSignin` already comes from `useSession().login` which now respects `VITE_AUTH_PROVIDER`.

---

## Flows

### Signup → Verification → Login

```
/auth/signup/bcc → POST /signup/club/bcc → /auth/verify-pending?email=...
  → user clicks email link → API verifies → 302 to /auth/verified
  → user clicks "Log in" → /auth/login → enters credentials
  → POST /api/auth/sign-in/email → cookie set → navigate to /
  → useSession picks up cookie session
```

### Password Reset

```
/auth/forgot-password → POST /api/auth/request-password-reset
  → user clicks email link → API validates → 302 to /auth/reset-password?token=...
  → user enters new password → POST /api/auth/reset-password → success
  → navigate to /auth/login
```

---

## Verification

1. Set `VITE_AUTH_PROVIDER=better-auth` in `.env.local`
2. Start API and frontend dev servers
3. Test signup at `/auth/signup/bcc` → verify redirect to `/auth/verify-pending`
4. Click email link → confirm landing on `/auth/verified`
5. Login at `/auth/login` → confirm session active, home page loads
6. Logout → confirm session cleared
7. Switch `VITE_AUTH_PROVIDER=auth0` → confirm "Log in" triggers Auth0 as before
8. Test errors: duplicate email (409), wrong password (401), unverified (403)
9. Test forgot-password and reset-password flows
10. `bun run check-types` passes
