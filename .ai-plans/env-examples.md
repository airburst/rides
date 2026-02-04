# Environment Variables

## Frontend (Next.js on Vercel)

Add to `.env.local` and Vercel environment variables:

```bash
# Auth0 SPA
NEXT_PUBLIC_AUTH0_DOMAIN=dev-k448qmxf.eu.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=4CNBh9ukIntfvzUQG8y1XD3qeohn174r
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.bcc-rides.com

# API URL (update after Oracle Cloud setup)
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

## API (Oracle Cloud VM)

Create `~/rides-api/.env`:

```bash
# Database (copy from existing Vercel env)
DATABASE_URL=postgres://user:password@host:5432/database

# Auth0
AUTH0_DOMAIN=dev-k448qmxf.eu.auth0.com
AUTH0_AUDIENCE=https://api.bcc-rides.com

# Server
PORT=3001
NODE_ENV=production
```

## Vercel Environment Variables to Keep

During migration, keep these for NextAuth:
- `AUTH0_CLIENT_ID` (existing server-side app)
- `AUTH0_CLIENT_SECRET`
- `AUTH0_ISSUER`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

After migration complete, remove these and add the new SPA ones.

## Auth0 Configuration Summary

| Setting | Value |
|---------|-------|
| Domain | `dev-k448qmxf.eu.auth0.com` |
| SPA Client ID | `4CNBh9ukIntfvzUQG8y1XD3qeohn174r` |
| API Identifier | `https://api.bcc-rides.com` |
| User ID Format | `auth0|xxxxxxxxxxxxxxxxxxxxxxxx` |
| JWKS URL | `https://dev-k448qmxf.eu.auth0.com/.well-known/jwks.json` |
| Issuer | `https://dev-k448qmxf.eu.auth0.com/` |
