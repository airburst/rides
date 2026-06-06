# Passkeys (WebAuthn) Implementation Plan

**Feature:** Enable biometric login (face/touch ID) and security keys as password-less authentication for rides app users.

**Status:** Design phase, ready for implementation
**Priority:** Medium (UX enhancement, reduces login friction)
**Timeline:** 1-2 sprints
**Dependencies:** better-auth v1.0+ (supports WebAuthn)

---

## Problem Statement

Current login experience:

- Users must remember and type passwords
- Password reuse increases security risk
- Mobile users often forget passwords or use weak ones
- On shared ride links (from email/WhatsApp), re-authentication is friction point

**Solution:** Passkeys allow users to authenticate with face/touch ID (biometric) or security keys (hardware), eliminating passwords.

---

## What Are Passkeys?

Passkeys are FIDO2/WebAuthn credentials:

- **What they are**: Cryptographic key pairs stored securely on device
- **Biometric passkey**: Registered with device biometric (Face ID, Touch ID, Windows Hello)
- **Security key**: Physical hardware device (YubiKey, etc.)
- **How they work**:
  1. Server sends challenge
  2. Device verifies user via biometric or security key
  3. Device signs challenge with private key
  4. Server verifies signature with public key
  5. User authenticated (no password sent)

**Benefits:**

- Phishing-proof (credentials tied to domain)
- No passwords to remember or compromise
- Fast (tap/face, no typing)
- Works across browser sessions (no cookie loss issues)

**Limitations:**

- Requires HTTPS
- Browser support varies (modern browsers only)
- Requires device with biometric sensor or security key
- Backup/recovery requires planning

---

## Architecture

### Components

1. **Client**: React component for passkey registration/authentication
2. **Server (API)**: Endpoints to issue challenges and verify responses
3. **Database**: Store user passkeys + metadata
4. **better-auth**: Plugin/integration for passkey strategy
5. **Recovery**: Backup codes or secondary auth method

### Database Schema

```sql
-- New table for passkeys
CREATE TABLE passkeys (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  credential_id BYTEA NOT NULL UNIQUE,
  public_key BYTEA NOT NULL,
  sign_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMP,
  name TEXT, -- e.g., "iPhone Face ID", "YubiKey 5"
  transports TEXT[], -- ["internal", "usb", etc.]
  backed_up BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Backup codes (optional, for recovery)
CREATE TABLE passkey_backup_codes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  code_hash TEXT NOT NULL UNIQUE,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Libraries

- **Server**: `@simplewebauthn/server` (WebAuthn server library)
- **Client**: `@simplewebauthn/browser` (WebAuthn browser API wrapper)
- **better-auth**: Native WebAuthn strategy (check docs for v1.0+)
- **Database**: Drizzle schema update

---

## Implementation Plan

### Phase 1: Setup & Server Endpoints

**1.1 Install dependencies**

```bash
npm install @simplewebauthn/server @simplewebauthn/browser
```

**1.2 Add database schema**

- Add `passkeys` and `passkey_backup_codes` tables
- Create migration file
- Update Drizzle schema

**1.3 Create API endpoints (rides-api)**

Endpoints needed:

```
POST   /api/auth/webauthn/register/start    -> returns challenge
POST   /api/auth/webauthn/register/complete -> validates & stores credential
POST   /api/auth/webauthn/authenticate/start    -> returns challenge
POST   /api/auth/webauthn/authenticate/complete -> verifies credential
GET    /api/auth/webauthn/passkeys         -> list user's passkeys
DELETE /api/auth/webauthn/passkeys/:id     -> remove passkey
POST   /api/auth/webauthn/backup-codes     -> generate recovery codes
```

**1.4 Configure better-auth**
Update `src/lib/auth.ts`:

```typescript
export const auth = betterAuth({
  // ... existing config ...

  // Add WebAuthn plugin
  plugins: [
    webauthnPlugin({
      rpID: env("WEBAUTHN_RP_ID"), // e.g., "bcc-rides.vercel.app"
      rpName: "BCC Rides",
      origin: env("BETTER_AUTH_URL"), // e.g., "https://bcc-rides.vercel.app"
    }),
  ],
});
```

### Phase 2: Registration Flow

**User journey:**

1. User navigates to settings/security page
2. Clicks "Add passkey"
3. Device prompts for biometric (Face ID, Touch ID, Windows Hello)
4. Biometric verified, credential stored on device
5. Public key sent to server, stored in DB
6. Passkey listed in settings ("iPhone Face ID", last used date, etc.)

**Implementation components:**

**File:** `src/components/PasskeyRegistration.tsx`

- Form to name the passkey
- Button to start registration
- Show device biometric prompt
- Handle success/error states
- Show confirmation after registration

**File:** `src/lib/webauthn-client.ts`

- Wrapper around `@simplewebauthn/browser`
- Handle device platform differences (iOS/Android/Windows/Mac)
- Graceful fallbacks for unsupported browsers
- Error messaging

**File:** `src/routes/auth/webauthn.ts` (API on rides-api)

- `POST /webauthn/register/start`: Generate challenge, return to client
- `POST /webauthn/register/complete`: Validate attestation, store credential
- `POST /webauthn/backup-codes`: Generate one-time recovery codes

### Phase 3: Authentication Flow

**User journey:**

1. User on login page
2. Clicks "Sign in with passkey" button
3. Device prompts for biometric/security key
4. Biometric verified, device signs challenge
5. Server verifies signature
6. User authenticated, redirected home

**Implementation components:**

**File:** `src/components/PasskeyLogin.tsx`

- Button to initiate passkey login
- Show device prompt
- Handle success (redirect to home)
- Handle errors (fallback to password)

**File:** `src/routes/auth/login.tsx`

- Add "Sign in with passkey" tab/button
- Alternative to email/password form
- Better-auth integration

### Phase 4: Settings & Recovery

**Passkey management page:**

- List all registered passkeys (name, device type, last used)
- Ability to rename passkey
- Ability to delete passkey
- Generate backup codes for account recovery

**Backup codes:**

- Generate 10x one-time codes during initial passkey setup
- User stores codes securely (in password manager, printed, etc.)
- If all passkeys lost, user can authenticate with backup code + email verification
- Each code is one-time use

**File:** `src/components/PasskeySettings.tsx`

- List passkeys
- Rename/delete actions
- Generate backup codes
- Instructions for recovery

### Phase 5: Fallback & Recovery

**Scenarios:**

1. User loses device (all passkeys gone)
   - User emails support, verifies identity
   - Or uses backup code + email verification
   - Support generates temporary session token

2. User adds new device
   - Can still authenticate with existing passkey from old device
   - Or use backup code

3. Browser doesn't support WebAuthn
   - Gracefully fallback to password login
   - Banner explaining "use a modern browser for passkeys"

4. User forgets device biometric PIN
   - Can register additional passkey on same device
   - Or use backup code

---

## User Flows

### Registration Flow (Initial Setup)

```
Settings → Add Passkey
  ↓
Name passkey ("iPhone Face ID")
  ↓
Click "Register"
  ↓
Server generates challenge
  ↓
Browser shows device prompt (Face ID/Touch ID)
  ↓
User verifies biometric
  ↓
Device signs challenge
  ↓
Browser sends attestation to server
  ↓
Server validates attestation
  ↓
Public key stored in DB
  ↓
✅ Success, passkey listed in settings
  ↓
Prompt: "Save backup codes?" → Generate 10 one-time codes
```

### Authentication Flow (Login)

```
Login page
  ↓
Click "Sign in with passkey"
  ↓
Enter email or select from saved passkeys
  ↓
Server generates challenge
  ↓
Browser shows device prompt
  ↓
User verifies biometric
  ↓
Device signs challenge
  ↓
Browser sends assertion to server
  ↓
Server verifies signature
  ↓
✅ Authenticated, redirect to home
```

### Backup Code Recovery Flow

```
Can't access passkeys
  ↓
Click "Use backup code" on login
  ↓
Enter email + one backup code
  ↓
Server sends verification email
  ↓
User clicks email link
  ↓
Session created with limited permissions (change passkeys only)
  ↓
User can add new passkey or delete old ones
```

---

## Browser & Device Support

| Platform    | WebAuthn Support | Biometric Option   | Note                                        |
| ----------- | ---------------- | ------------------ | ------------------------------------------- |
| iOS 14+     | ✅ Full          | Face ID, Touch ID  | Built-in, syncs to iCloud keychain          |
| Android 7+  | ✅ Full          | Fingerprint, Face  | Built-in (Gboard, Chrome)                   |
| Windows 10+ | ✅ Full          | Windows Hello, PIN | Built-in or USB key                         |
| macOS 13+   | ✅ Full          | Touch ID, Face ID  | Built-in, syncs to iCloud keychain          |
| Chrome 67+  | ✅ Full          | Device biometric   | Full support                                |
| Safari 13+  | ✅ Full          | Device biometric   | Full support                                |
| Firefox 60+ | ✅ Full          | Device biometric   | Full support (behind flag on some versions) |
| Edge 18+    | ✅ Full          | Windows Hello      | Full support                                |

**Fallback:** All modern browsers support at least password-less authentication. Graceful fallback for older browsers.

---

## Security Considerations

### Attack Vectors & Mitigations

| Threat                   | Mitigation                                                       |
| ------------------------ | ---------------------------------------------------------------- |
| **Phishing**             | Credentials tied to origin; attacker can't use stolen credential |
| **Replay attacks**       | Challenge/response prevents replays                              |
| **Man-in-the-middle**    | HTTPS + origin binding prevents interception                     |
| **Device theft**         | Biometric lock on device; passkey tied to that device only       |
| **Brute force**          | Device limits biometric attempts; no guessing possible           |
| **Backup code exposure** | Codes are one-time use; limited set of codes                     |

### Implementation Security

- **Challenge storage**: Transient, expired after 5 minutes
- **Sign count verification**: Detect cloned authenticators
- **Public key storage**: Never transmit private keys
- **Backup codes**: Hashed in database (never stored plaintext)
- **HTTPS only**: WebAuthn requires secure context
- **Rate limiting**: Prevent brute-force on backup codes

---

## Testing Strategy

### Manual Testing

1. **Setup**
   - Install app on iOS device with Face ID
   - Install app on Android device with fingerprint
   - Install app on desktop (Windows/Mac) with platform authenticator

2. **Registration**
   - Add passkey on each platform
   - Verify biometric prompt appears
   - Verify passkey listed in settings
   - Generate and download backup codes

3. **Authentication**
   - Test login with passkey (biometric prompt)
   - Clear cookies, test login again
   - Verify no re-login needed in PWA after passkey auth
   - Test on different device (should fail without passkey)

4. **Recovery**
   - Register passkey
   - Remove passkey from account manually (simulate device loss)
   - Use backup code to recover account
   - Register new passkey

5. **Fallback**
   - Test on browser without WebAuthn support
   - Verify password login still works
   - Show graceful error message

### Automated Testing

```typescript
// __tests__/webauthn.test.ts
describe("WebAuthn", () => {
  it("should generate challenge for registration", async () => {
    const res = await fetch("/api/auth/webauthn/register/start", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
    });
    expect(res.status).toBe(200);
    const { challenge, rp, user } = await res.json();
    expect(challenge).toBeDefined();
    expect(rp.name).toBe("BCC Rides");
  });

  it("should verify valid attestation", async () => {
    // Mock device attestation
    const attestation = mockAttestationResponse();
    const res = await fetch("/api/auth/webauthn/register/complete", {
      method: "POST",
      body: JSON.stringify(attestation),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
  });

  it("should reject invalid attestation", async () => {
    const res = await fetch("/api/auth/webauthn/register/complete", {
      method: "POST",
      body: JSON.stringify({
        /* invalid */
      }),
    });
    expect(res.status).toBe(400);
  });
});
```

---

## Rollout Strategy

### Phase A: Internal Testing (1 sprint)

- Team members register passkeys
- Test on all platforms (iOS, Android, Windows, Mac)
- Verify recovery flows
- Load test endpoint capacity

### Phase B: Beta (1-2 weeks)

- Open to opt-in users
- Gather feedback on UX
- Monitor error rates
- Adjust messaging/flows

### Phase C: Full Release

- Enable for all users
- Feature flag: `WEBAUTHN_ENABLED=true`
- Default: Show "Sign in with passkey" as secondary option (email/password as primary)
- Monitor adoption rate

### Phase D: Deprecation (Future)

- Once 50%+ users adopt passkeys, consider deprecating password login
- Or keep as fallback for accessibility/legacy support

---

## Configuration & Environment Variables

```env
# better-auth WebAuthn config
WEBAUTHN_RP_ID=bcc-rides.vercel.app
WEBAUTHN_RP_NAME=BCC Rides
BETTER_AUTH_URL=https://bcc-rides.vercel.app

# Feature flag
WEBAUTHN_ENABLED=true

# Backup code settings
WEBAUTHN_BACKUP_CODES_COUNT=10
WEBAUTHN_CHALLENGE_TIMEOUT_MS=60000
WEBAUTHN_BACKUP_CODE_TTL_HOURS=720  # 30 days
```

---

## Deployment Checklist

- [ ] Database migration created and tested
- [ ] Drizzle schema updated
- [ ] better-auth configured with WebAuthn plugin
- [ ] API endpoints implemented (register/authenticate)
- [ ] Passkey registration component built + tested
- [ ] Passkey login component built + tested
- [ ] Settings page with passkey management
- [ ] Backup code generation + recovery flow
- [ ] Error handling + graceful fallbacks
- [ ] Browser compatibility tested (all platforms)
- [ ] Security review completed
- [ ] Rate limiting added to auth endpoints
- [ ] Feature flag configured
- [ ] Monitoring/metrics setup (adoption, errors)
- [ ] Documentation updated (user + developer)
- [ ] Support team trained on recovery process

---

## Metrics to Track

- **Adoption**: % of users with at least one passkey
- **Successful authentications**: % of logins using passkey vs password
- **Registration abandonment**: % of users who start but don't complete registration
- **Recovery usage**: How many users use backup codes (indicator of device loss)
- **Platform breakdown**: Which devices have passkeys (iOS vs Android vs Desktop)
- **Error rates**: Failed attestations, failed assertions
- **Time to authenticate**: Passkey login speed vs password

---

## Future Enhancements

1. **Conditional UI (autofill)**
   - Show passkey in browser autofill on login page
   - Users tap autofill → biometric prompt → authenticated
   - Seamless UX, fewer clicks

2. **Cross-device authentication**
   - User on laptop, authenticate with phone passkey
   - Requires QR code or Bluetooth
   - Good for devices without built-in biometric

3. **Security key management**
   - Allow hardware security keys (YubiKey, etc.)
   - Secondary factor (passkey + security key)
   - Enterprise security posture

4. **Passwordless-only mode**
   - Option to disable password login entirely
   - Forces passkey or backup code recovery
   - Maximum security for users who prefer it

5. **Admin dashboard**
   - Monitor passkey adoption across user base
   - See which users haven't set up recovery
   - Send campaigns encouraging adoption

---

## References

- [WebAuthn Spec](https://www.w3.org/TR/webauthn-2/)
- [SimpleWebAuthn Docs](https://simplewebauthn.dev/)
- [better-auth WebAuthn Plugin](https://www.better-auth.com/docs/plugins/webauthn)
- [FIDO2 Overview](https://fidoalliance.org/fido2/)
- [MDN WebAuthn API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
