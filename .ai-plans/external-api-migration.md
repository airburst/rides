# External API Migration Plan

## Decisions
- **Replace Jotai** with TanStack Query for all state (including optimistic updates)
- **Per-feature cutover** - migrate one feature at a time, both systems run in parallel
- **Auth0 SPA** - create new SPA application in same Auth0 tenant, users keep accounts

## Stack
- **Backend**: Hono + Drizzle + Supabase Postgres
- **Frontend**: Next.js (static/CSR) + TanStack Query
- **Hosting**: Oracle Cloud (free tier - 2 AMD VMs forever free)
- **Auth**: Auth0 SPA SDK + JWT verification

## Architecture

```
Current:
[Browser] → [Vercel Serverless Functions] → [Supabase DB]
             └─ Server Components
             └─ Server Actions
             └─ NextAuth sessions (DB lookup)
             └─ Jotai (optimistic state)

New:
[Browser] → [Vercel Static CDN] → [Oracle Cloud Hono API] → [Supabase DB]
             └─ Client Components       └─ JWT auth middleware
             └─ TanStack Query          └─ Drizzle ORM
             └─ Auth0 SPA SDK           └─ Same schema
             └─ (no Jotai)
```

---

## Phase 0: Auth0 SPA Application Setup

### 0.1 Create SPA Application in Auth0

1. Go to Auth0 Dashboard → Applications → Create Application
2. Select "Single Page Application"
3. Name it "BCC Rides SPA" (or similar)
4. Configure settings:

**Allowed Callback URLs:**
```
http://localhost:3000,
https://your-app.vercel.app
```

**Allowed Logout URLs:**
```
http://localhost:3000,
https://your-app.vercel.app
```

**Allowed Web Origins:**
```
http://localhost:3000,
https://your-app.vercel.app
```

### 0.2 Create API in Auth0 (if not exists)

1. Go to Auth0 Dashboard → Applications → APIs
2. Create API or use existing
3. Note the **Identifier** (audience) - e.g., `https://api.bcc-rides.com`

### 0.3 Environment Variables

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_AUTH0_DOMAIN=dev-k448qmxf.eu.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=4CNBh9ukIntfvzUQG8y1XD3qeohn174r
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.bcc-rides.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

**API (Oracle Cloud VM .env):**
```bash
AUTH0_DOMAIN=dev-k448qmxf.eu.auth0.com
AUTH0_AUDIENCE=https://api.bcc-rides.com
DATABASE_URL=postgres://...
PORT=3001
NODE_ENV=production
```

### 0.4 User Mapping

Users authenticate with same Auth0 accounts. The `sub` claim in JWT maps to existing users:

```typescript
// API: Look up user by Auth0 ID
const auth0Id = c.get('user').sub  // e.g., "auth0|65ec175a806157e2b7e6c59e"

// Look up in accounts table by providerAccountId
const account = await db.query.accounts.findFirst({
  where: eq(accounts.providerAccountId, auth0Id),
  with: { users: true },  // relation name from your schema
})
const user = account?.userss  // linked user record
```

---

## Phase 1: API Foundation (Hono on Oracle Cloud)

### 1.1 Create API project

```bash
mkdir rides-api && cd rides-api
npm init -y
npm install hono @hono/node-server drizzle-orm postgres jose dotenv
npm install -D typescript @types/node tsx
```

### 1.2 Project structure

```
rides-api/
├── src/
│   ├── index.ts          # Hono app entry
│   ├── db/
│   │   ├── index.ts      # Drizzle connection
│   │   └── schema/       # Copy from Next.js app
│   ├── routes/
│   │   ├── rides.ts      # /rides endpoints
│   │   ├── users.ts      # /users endpoints
│   │   └── repeating.ts  # /repeating-rides endpoints
│   ├── middleware/
│   │   └── auth.ts       # JWT verification
│   └── lib/
│       └── auth0.ts      # Auth0 JWKS validation
├── Dockerfile
├── fly.toml
└── package.json
```

### 1.3 Hono app setup

```typescript
// src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import { ridesRouter } from './routes/rides'
import { usersRouter } from './routes/users'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: [
    'https://your-app.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
}))

// Routes
app.route('/rides', ridesRouter)
app.route('/users', usersRouter)

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001
serve({ fetch: app.fetch, port })
console.log(`Server running on port ${port}`)
```

### 1.4 Auth middleware (Auth0 JWT with JWKS)

```typescript
// src/lib/auth0.ts
import * as jose from 'jose'

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN!
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE!

// Cache JWKS
let jwks: jose.JWTVerifyGetKey | null = null

async function getJwks() {
  if (!jwks) {
    jwks = jose.createRemoteJWKSet(
      new URL(`https://${AUTH0_DOMAIN}/.well-known/jwks.json`)
    )
  }
  return jwks
}

export async function verifyAuth0Token(token: string) {
  const jwks = await getJwks()

  const { payload } = await jose.jwtVerify(token, jwks, {
    issuer: `https://${AUTH0_DOMAIN}/`,
    audience: AUTH0_AUDIENCE,
  })

  return payload
}
```

```typescript
// src/middleware/auth.ts
import { createMiddleware } from 'hono/factory'
import { verifyAuth0Token } from '../lib/auth0'
import { db } from '../db'
import { accounts } from '../db/schema'
import { eq } from 'drizzle-orm'

type AuthUser = {
  id: string
  auth0Id: string
  role: string
}

// Required auth - returns 401 if not authenticated
export const authMiddleware = createMiddleware<{
  Variables: { user: AuthUser }
}>(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.slice(7)
  try {
    const payload = await verifyAuth0Token(token)

    // Look up user by Auth0 ID
    const account = await db.query.accounts.findFirst({
      where: eq(accounts.providerAccountId, payload.sub as string),
      with: { users: true },
    })

    if (!account?.users) {
      return c.json({ error: 'User not found' }, 401)
    }

    c.set('user', {
      id: account.users.id,
      auth0Id: payload.sub as string,
      role: account.users.role,
    })

    await next()
  } catch (err) {
    console.error('Auth error:', err)
    return c.json({ error: 'Invalid token' }, 401)
  }
})

// Optional auth - sets user if present, continues if not
export const optionalAuth = createMiddleware<{
  Variables: { user?: AuthUser }
}>(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.slice(7)
      const payload = await verifyAuth0Token(token)

      const account = await db.query.accounts.findFirst({
        where: eq(accounts.providerAccountId, payload.sub as string),
        with: { users: true },
      })

      if (account?.users) {
        c.set('user', {
          id: account.users.id,
          auth0Id: payload.sub as string,
          role: account.users.role,
        })
      }
    } catch {
      // Ignore invalid tokens for optional auth
    }
  }
  await next()
})

// Role check helper
export const requireRole = (...roles: string[]) => {
  return createMiddleware<{ Variables: { user: AuthUser } }>(async (c, next) => {
    const user = c.get('user')
    if (!roles.includes(user.role)) {
      return c.json({ error: 'Forbidden' }, 403)
    }
    await next()
  })
}
```

### 1.5 Database connection

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString)
export const db = drizzle(client, { schema, casing: 'snake_case' })
```

### 1.6 Deploy to Oracle Cloud

#### 1.6.1 Create Oracle Cloud VM (one-time setup)

1. Sign up at [cloud.oracle.com](https://cloud.oracle.com) (free tier)
2. Create Compute Instance:
   - Shape: VM.Standard.E2.1.Micro (Always Free)
   - Image: Oracle Linux 8 or Ubuntu 22.04
   - Add SSH key for access
3. Note the public IP address

#### 1.6.2 Configure VM

```bash
# SSH into your instance
ssh opc@<your-vm-ip>  # Oracle Linux
# or
ssh ubuntu@<your-vm-ip>  # Ubuntu

# Install Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -  # Oracle Linux
sudo yum install -y nodejs
# or
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -  # Ubuntu
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Open firewall port
sudo firewall-cmd --permanent --add-port=3001/tcp  # Oracle Linux
sudo firewall-cmd --reload
# or
sudo ufw allow 3001  # Ubuntu

# Also open port in Oracle Cloud Console:
# Networking → Virtual Cloud Networks → your VCN → Security Lists → Default
# Add Ingress Rule: Source 0.0.0.0/0, TCP, Port 3001
```

#### 1.6.3 Deploy API

```bash
# On your local machine - push to GitHub first, then on VM:
git clone https://github.com/your-username/rides-api.git
cd rides-api
npm ci
npm run build

# Create .env file
cat > .env << 'EOF'
DATABASE_URL=postgres://...
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.bcc-rides.com
PORT=3001
EOF

# Start with PM2
pm2 start dist/index.js --name rides-api
pm2 save
pm2 startup  # Follow instructions to enable on boot
```

#### 1.6.4 Set up HTTPS with Caddy (recommended)

```bash
# Install Caddy
sudo yum install -y yum-plugin-copr  # Oracle Linux
sudo yum copr enable @caddy/caddy
sudo yum install -y caddy
# or
sudo apt install -y caddy  # Ubuntu

# Configure Caddy (replace with your domain)
sudo tee /etc/caddy/Caddyfile << 'EOF'
api.your-domain.com {
    reverse_proxy localhost:3001
}
EOF

# Start Caddy
sudo systemctl enable caddy
sudo systemctl start caddy

# Open HTTPS port in Oracle Cloud Console Security List
# Add Ingress Rule: Source 0.0.0.0/0, TCP, Port 443
```

#### 1.6.5 Alternative: Use Oracle Cloud public IP directly

If you don't have a domain, use the public IP with HTTP:
```
NEXT_PUBLIC_API_URL=http://<your-vm-ip>:3001
```

Note: For production, HTTPS is recommended. You can:
- Use a free domain from freenom.com or similar
- Use Cloudflare for free SSL (proxy mode)
- Use Let's Encrypt with Caddy (automatic)

#### 1.6.6 Update deployment script

Create `deploy.sh` on VM:
```bash
#!/bin/bash
cd ~/rides-api
git pull
npm ci
npm run build
pm2 restart rides-api
```

Then deploy with:
```bash
ssh opc@<your-vm-ip> 'bash ~/rides-api/deploy.sh'
```

---

## Phase 2: Migrate Read Endpoints (Per-Feature)

### Feature order (migrate one at a time):
1. **Rides list** (homepage) - highest traffic
2. **Ride details** - second highest
3. **Calendar** - moderate traffic
4. **User profile** - lower traffic
5. **Repeating rides** - admin only

### 2.1 Rides endpoints

```typescript
// src/routes/rides.ts
import { Hono } from 'hono'
import { db } from '../db'
import { rides, userOnRides } from '../db/schema'
import { and, eq, gte, lte, asc, desc } from 'drizzle-orm'
import { optionalAuth, authMiddleware, requireRole } from '../middleware/auth'

export const ridesRouter = new Hono()

// GET /rides?start=2024-01-01&end=2024-12-31
ridesRouter.get('/', optionalAuth, async (c) => {
  const start = c.req.query('start') ?? new Date().toISOString().split('T')[0]
  const end = c.req.query('end') ?? '2099-12-31'

  const result = await db.query.rides.findMany({
    columns: {
      id: true,
      name: true,
      rideGroup: true,
      rideDate: true,
      destination: true,
      distance: true,
      rideLimit: true,
      cancelled: true,
    },
    with: {
      users: { columns: { userId: true } },
    },
    where: and(
      lte(rides.rideDate, `${end}T23:59:59`),
      gte(rides.rideDate, start),
      eq(rides.deleted, false),
    ),
    orderBy: [asc(rides.rideDate), asc(rides.name), desc(rides.distance)],
  })

  return c.json({ rides: result })
})

// GET /rides/:id
ridesRouter.get('/:id', optionalAuth, async (c) => {
  const id = c.req.param('id')

  const result = await db.query.rides.findFirst({
    with: {
      users: {
        columns: { notes: true },
        with: { users: true },
        orderBy: (user, { asc }) => [asc(user.createdAt)],
      },
    },
    where: and(eq(rides.id, id), eq(rides.deleted, false)),
  })

  if (!result) {
    return c.json({ error: 'Ride not found' }, 404)
  }

  return c.json({ ride: result })
})

// POST /rides/:id/join
ridesRouter.post('/:id/join', authMiddleware, async (c) => {
  const rideId = c.req.param('id')
  const user = c.get('user')
  const body = await c.req.json<{ userId?: string }>()

  // Users can join themselves, leaders can add others
  const targetUserId = body.userId ?? user.id
  const isSelf = targetUserId === user.id
  const isLeaderOrAdmin = ['LEADER', 'ADMIN'].includes(user.role)

  if (!isSelf && !isLeaderOrAdmin) {
    return c.json({ error: 'Forbidden' }, 403)
  }

  try {
    await db.insert(userOnRides).values({ rideId, userId: targetUserId })
    return c.json({ success: true })
  } catch (error) {
    console.error('Join error:', error)
    return c.json({ error: 'Failed to join ride' }, 500)
  }
})

// POST /rides/:id/leave
ridesRouter.post('/:id/leave', authMiddleware, async (c) => {
  const rideId = c.req.param('id')
  const user = c.get('user')
  const body = await c.req.json<{ userId?: string }>()

  const targetUserId = body.userId ?? user.id
  const isSelf = targetUserId === user.id
  const isLeaderOrAdmin = ['LEADER', 'ADMIN'].includes(user.role)

  if (!isSelf && !isLeaderOrAdmin) {
    return c.json({ error: 'Forbidden' }, 403)
  }

  try {
    await db.delete(userOnRides).where(
      and(
        eq(userOnRides.rideId, rideId),
        eq(userOnRides.userId, targetUserId)
      )
    )
    return c.json({ success: true })
  } catch (error) {
    console.error('Leave error:', error)
    return c.json({ error: 'Failed to leave ride' }, 500)
  }
})
```

---

## Phase 3: Frontend Migration (TanStack Query replaces Jotai)

### 3.1 Install dependencies

```bash
npm install @tanstack/react-query @auth0/auth0-react
npm uninstall jotai  # After migration complete
```

### 3.2 Setup providers

```typescript
// src/providers/index.tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Auth0Provider } from '@auth0/auth0-react'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,      // Data fresh for 30s
        gcTime: 5 * 60 * 1000,     // Cache for 5 min
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      }}
      cacheLocation="localstorage"  // Persist auth across tabs
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Auth0Provider>
  )
}
```

### 3.3 API client

```typescript
// src/lib/api.ts
'use client'
import { useAuth0 } from '@auth0/auth0-react'
import { useCallback } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export function useApiClient() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  const fetchApi = useCallback(async <T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (isAuthenticated) {
      try {
        const token = await getAccessTokenSilently()
        headers['Authorization'] = `Bearer ${token}`
      } catch (e) {
        console.error('Failed to get token:', e)
      }
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `API error: ${res.status}`)
    }

    return res.json()
  }, [getAccessTokenSilently, isAuthenticated])

  return { fetchApi }
}
```

### 3.4 Query hooks with optimistic updates (replaces Jotai)

```typescript
// src/hooks/useRides.ts
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiClient } from '@/lib/api'
import { useAuth0 } from '@auth0/auth0-react'
import type { RideList, Ride } from '@/types'

// Query keys
export const rideKeys = {
  all: ['rides'] as const,
  lists: () => [...rideKeys.all, 'list'] as const,
  list: (start?: string, end?: string) => [...rideKeys.lists(), { start, end }] as const,
  details: () => [...rideKeys.all, 'detail'] as const,
  detail: (id: string) => [...rideKeys.details(), id] as const,
}

// GET /rides
export function useRides(start?: string, end?: string) {
  const { fetchApi } = useApiClient()
  const params = new URLSearchParams()
  if (start) params.set('start', start)
  if (end) params.set('end', end)
  const query = params.toString() ? `?${params}` : ''

  return useQuery({
    queryKey: rideKeys.list(start, end),
    queryFn: () => fetchApi<{ rides: RideList[] }>(`/rides${query}`),
  })
}

// GET /rides/:id
export function useRide(id: string) {
  const { fetchApi } = useApiClient()

  return useQuery({
    queryKey: rideKeys.detail(id),
    queryFn: () => fetchApi<{ ride: Ride }>(`/rides/${id}`),
    enabled: !!id,
  })
}

// POST /rides/:id/join - with optimistic update
export function useJoinRide() {
  const { fetchApi } = useApiClient()
  const { user } = useAuth0()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ rideId, userId }: { rideId: string; userId: string }) =>
      fetchApi(`/rides/${rideId}/join`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      }),

    // Optimistic update - runs before mutation
    onMutate: async ({ rideId, userId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: rideKeys.all })

      // Snapshot current state
      const previousLists = queryClient.getQueriesData({ queryKey: rideKeys.lists() })
      const previousDetail = queryClient.getQueryData(rideKeys.detail(rideId))

      // Optimistically update all ride lists
      queryClient.setQueriesData(
        { queryKey: rideKeys.lists() },
        (old: { rides: RideList[] } | undefined) => {
          if (!old) return old
          return {
            ...old,
            rides: old.rides.map((ride) =>
              ride.id === rideId
                ? { ...ride, users: [...(ride.users || []), { userId }] }
                : ride
            ),
          }
        }
      )

      // Optimistically update ride detail if cached
      queryClient.setQueryData(
        rideKeys.detail(rideId),
        (old: { ride: Ride } | undefined) => {
          if (!old) return old
          return {
            ...old,
            ride: {
              ...old.ride,
              users: [...(old.ride.users || []), { userId, user }],
            },
          }
        }
      )

      return { previousLists, previousDetail, rideId }
    },

    // Rollback on error
    onError: (err, { rideId }, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(rideKeys.detail(rideId), context.previousDetail)
      }
    },

    // Refetch after mutation settles
    onSettled: (_, __, { rideId }) => {
      queryClient.invalidateQueries({ queryKey: rideKeys.lists() })
      queryClient.invalidateQueries({ queryKey: rideKeys.detail(rideId) })
    },
  })
}

// POST /rides/:id/leave - with optimistic update
export function useLeaveRide() {
  const { fetchApi } = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ rideId, userId }: { rideId: string; userId: string }) =>
      fetchApi(`/rides/${rideId}/leave`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      }),

    onMutate: async ({ rideId, userId }) => {
      await queryClient.cancelQueries({ queryKey: rideKeys.all })

      const previousLists = queryClient.getQueriesData({ queryKey: rideKeys.lists() })
      const previousDetail = queryClient.getQueryData(rideKeys.detail(rideId))

      // Optimistically remove user from ride lists
      queryClient.setQueriesData(
        { queryKey: rideKeys.lists() },
        (old: { rides: RideList[] } | undefined) => {
          if (!old) return old
          return {
            ...old,
            rides: old.rides.map((ride) =>
              ride.id === rideId
                ? { ...ride, users: ride.users?.filter((u) => u.userId !== userId) }
                : ride
            ),
          }
        }
      )

      // Optimistically remove from detail
      queryClient.setQueryData(
        rideKeys.detail(rideId),
        (old: { ride: Ride } | undefined) => {
          if (!old) return old
          return {
            ...old,
            ride: {
              ...old.ride,
              users: old.ride.users?.filter((u) => u.userId !== userId),
            },
          }
        }
      )

      return { previousLists, previousDetail, rideId }
    },

    onError: (err, { rideId }, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(rideKeys.detail(rideId), context.previousDetail)
      }
    },

    onSettled: (_, __, { rideId }) => {
      queryClient.invalidateQueries({ queryKey: rideKeys.lists() })
      queryClient.invalidateQueries({ queryKey: rideKeys.detail(rideId) })
    },
  })
}
```

### 3.5 Convert JoinButton (replaces Jotai atoms)

**Before (Jotai):**
```typescript
// src/components/Button/JoinButton.tsx
'use client'
import { joinRide } from "@/server/actions/join-ride";
import { leaveRide } from "@/server/actions/leave-ride";
import { addOptimisticRideUpdateAtom, removeOptimisticRideUpdateAtom } from "@/store";
import { useAtom } from "jotai";

export const JoinButton = ({ going, rideId, userId }: Props) => {
  const [, addOptimisticUpdate] = useAtom(addOptimisticRideUpdateAtom);
  const [, removeOptimisticUpdate] = useAtom(removeOptimisticRideUpdateAtom);

  const handleJoin = async () => {
    addOptimisticUpdate({ rideId, userId, action: "join" });
    const result = await joinRide({ rideId, userId });
    if (!result.success) removeOptimisticUpdate({ rideId, userId });
  };
  // ...
}
```

**After (TanStack Query):**
```typescript
// src/components/Button/JoinButton.tsx
'use client'
import { useJoinRide, useLeaveRide } from "@/hooks/useRides";
import { Plus, X } from "lucide-react";
import { Button } from "./Button";

type Props = {
  rideId: string;
  userId: string;
  going?: boolean;
};

export const JoinButton = ({ going, rideId, userId }: Props) => {
  const joinMutation = useJoinRide();
  const leaveMutation = useLeaveRide();

  const handleJoin = () => {
    joinMutation.mutate({ rideId, userId });
  };

  const handleLeave = () => {
    leaveMutation.mutate({ rideId, userId });
  };

  const isLoading = joinMutation.isPending || leaveMutation.isPending;

  return going ? (
    <Button success onClick={handleLeave} disabled={isLoading}>
      <X className="h-6 w-6" />
      {isLoading ? 'LEAVING...' : 'LEAVE'}
    </Button>
  ) : (
    <Button error onClick={handleJoin} disabled={isLoading}>
      <Plus className="h-6 w-6" />
      {isLoading ? 'JOINING...' : 'JOIN'}
    </Button>
  );
};
```

### 3.6 Convert RideCard (remove Jotai subscription)

**Before:**
```typescript
const [getOptimisticMembership] = useAtom(getOptimisticMembershipAtom);
const [getOptimisticRiderCount] = useAtom(getOptimisticRiderCountAtom);
const [_optimisticUpdates] = useAtom(optimisticRideUpdatesAtom);

const isGoing = user
  ? getOptimisticMembership(id, user.id, originalIsGoing ?? false)
  : false;
```

**After:**
```typescript
// No Jotai imports needed - TanStack Query handles state
// The ride data comes from useRides() which has optimistic updates built in

const isGoing = user
  ? users?.some((u) => u.userId === user.id)
  : false;
```

### 3.7 Convert RidesList component

**Before (Server Component):**
```typescript
import { getRides } from "@/server/actions/get-rides";
import { getServerAuthSession } from "@/server/auth";

const RidesList = async ({ date }: RidesListProps) => {
  const session = await getServerAuthSession();
  const { start, end } = getQueryDateRange({ start: date, end: date });
  const { rides, error } = await getRides(start, end);

  if (error) return <div>Error loading rides</div>;
  return <FilteredRides rides={rides} user={session?.user} />;
};
```

**After (Client Component):**
```typescript
'use client'
import { useRides } from "@/hooks/useRides";
import { useAuth0 } from "@auth0/auth0-react";
import { getQueryDateRange } from "@utils/dates";
import { RidesListSkeleton } from "./RidesListSkeleton";
import { FilteredRides } from "./FilteredRides";

export type RidesListProps = {
  date?: string;
};

const RidesList = ({ date }: RidesListProps) => {
  const { user, isLoading: authLoading } = useAuth0();
  const { start, end } = getQueryDateRange({ start: date, end: date });
  const { data, isLoading, error } = useRides(start, end);

  if (isLoading || authLoading) return <RidesListSkeleton />;
  if (error) return <div className="p-8 text-2xl">Error loading rides</div>;

  return <FilteredRides rides={data?.rides ?? []} user={user} />;
};

export default RidesList;
```

---

## Phase 4: Migrate Write Endpoints

### Endpoints:
| Endpoint | API Route | Hook |
|----------|-----------|------|
| Create ride | `POST /rides` | `useCreateRide()` |
| Update ride | `PUT /rides/:id` | `useUpdateRide()` |
| Delete ride | `DELETE /rides/:id` | `useDeleteRide()` |
| Cancel ride | `POST /rides/:id/cancel` | `useCancelRide()` |

### Auth requirements:
| Endpoint | Role |
|----------|------|
| join/leave | Self or LEADER+ |
| create | LEADER+ |
| update | LEADER+ |
| delete | ADMIN |
| cancel | LEADER+ |

---

## Phase 5: Cleanup

### 5.1 Remove Jotai
```bash
npm uninstall jotai
```

Delete files:
- `src/store/index.ts`
- `src/store/rideOptimisticUpdates.ts`

### 5.2 Remove server actions
Delete `src/server/actions/` directory

### 5.3 Remove NextAuth
```bash
npm uninstall next-auth @auth/drizzle-adapter
```

Delete:
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/server/auth.ts`

### 5.4 Update pages to client components
Convert remaining server components that fetch data to client components using hooks.

---

## Per-Feature Cutover Strategy

### Feature 1: Rides List (Homepage)

**Steps:**
1. Deploy API with `GET /rides` endpoint
2. Create `useRides` hook
3. Convert `RidesList` to client component
4. Test thoroughly
5. Deploy frontend

**Coexistence:** Old server action still works, new hook uses external API. Users see no difference.

### Feature 2: Join/Leave Ride

**Steps:**
1. Deploy API with `POST /rides/:id/join` and `/leave`
2. Create `useJoinRide` and `useLeaveRide` hooks with optimistic updates
3. Convert `JoinButton` to use new hooks
4. Remove Jotai usage from `JoinButton` and `RideCard`
5. Test optimistic updates
6. Deploy

### Feature 3: Ride Details

**Steps:**
1. Deploy API with `GET /rides/:id`
2. Create `useRide` hook
3. Convert ride details page to client component
4. Test
5. Deploy

### Continue for remaining features...

---

## Migration Checklist

### Phase 0: Auth0 Setup
- [x] Create SPA application in Auth0 dashboard
- [x] Create/configure API in Auth0
- [x] Note client ID and audience
- [x] Configure callback URLs

### Phase 1: API Foundation
- [ ] Create `rides-api` repo
- [ ] Setup Hono + Drizzle
- [ ] Copy DB schema from Next.js
- [ ] Implement Auth0 JWT middleware with JWKS
- [ ] Add user lookup by Auth0 ID
- [ ] Setup Oracle Cloud VM (Node.js, PM2, firewall)
- [ ] Deploy API to Oracle Cloud
- [ ] Setup HTTPS (Caddy + domain or Cloudflare)
- [ ] Verify DB connection
- [ ] Test auth flow

### Phase 2: Read Endpoints
- [ ] `GET /rides`
- [ ] `GET /rides/:id`
- [ ] `GET /users/me`
- [ ] `GET /repeating-rides` (admin)

### Phase 3: Frontend (per feature)
- [ ] Install TanStack Query + Auth0 SPA SDK
- [ ] Create Providers wrapper
- [ ] Create API client with auth
- [ ] **Feature 1:** Migrate RidesList
- [ ] **Feature 2:** Migrate Join/Leave + remove Jotai
- [ ] **Feature 3:** Migrate RideDetails
- [ ] **Feature 4:** Migrate Calendar
- [ ] **Feature 5:** Migrate Profile
- [ ] **Feature 6:** Migrate Repeating Rides

### Phase 4: Write Endpoints
- [ ] `POST /rides/:id/join`
- [ ] `POST /rides/:id/leave`
- [ ] `POST /rides`
- [ ] `PUT /rides/:id`
- [ ] `DELETE /rides/:id`
- [ ] `POST /rides/:id/cancel`

### Phase 5: Cleanup
- [ ] Remove Jotai
- [ ] Remove server actions
- [ ] Remove NextAuth
- [ ] Remove unused API routes
- [ ] Update env vars
- [ ] Final testing
- [ ] Monitor Vercel usage (should drop to ~0 functions)

---

## Estimated Effort

| Phase | Effort |
|-------|--------|
| 0. Auth0 Setup | 30 min |
| 1. API Foundation | 2-4 hours |
| 2. Read Endpoints | 2-3 hours |
| 3. Frontend Migration | 4-6 hours |
| 4. Write Endpoints | 2-3 hours |
| 5. Cleanup | 1-2 hours |
| **Total** | **12-19 hours** |
