# AI Agent Guidelines

## Project Overview

This is a Next.js application for a cycling club ride planner. It uses:

- Next.js with App Router
- TypeScript
- React with dynamic imports
- Environment variables for configuration

## Code Style

- Use TypeScript with strict type checking
- Prefer functional components with hooks
- Use dynamic imports for code splitting where appropriate
- Follow Next.js App Router conventions (page.tsx, layout.tsx, etc.)
- Components are organized under `src/components/`
- Use path aliases (`@/`) for imports

## File Structure

```
src/
  app/          # Next.js App Router pages
  components/   # React components
  env.ts        # Environment configuration
```

## Testing

- Run `npm test` or `yarn test` before committing changes
- Ensure TypeScript compiles without errors: `npm run build`

## Environment Variables

- Public env vars prefixed with `NEXT_PUBLIC_`
- Access via `@/env` module

## Commit Guidelines

- Write clear, descriptive commit messages
- Keep commits focused and atomic
