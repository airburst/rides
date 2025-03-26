# TODO List

## Update Drizzle and schemas, to use underscore naming for columns.

https://orm.drizzle.team/docs/connect-overview

- [ ] drizzle.config.ts (casing: "snake_case")
- [ ] const db = drizzle( connection: "", casing: "snake_case")
- [ ] Remove snake case from schema files
- [ ] seed.ts: db.$client to access client
- [ ] After each change, gen a migration until no changes

- What would MySQL look like?

## Linting

- Update eslint to v9

## Tailwind and UX

- Replace DaisyUI with ShadCN
  - Button
  - Modal
  - Chat-bubble
  - Switch
  - Form inputs ?
  - Badges ?
- Update Tailwind to V4

## NextJS

Try:

```json
experimental: {
  dynamicIO: true,
}
```

And "use-cache"
