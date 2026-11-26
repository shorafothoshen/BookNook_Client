<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BookNook Client — agent instructions

## Commands
- `npm run dev` — dev server (Next.js 16, App Router, Turbopack)
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint (eslint-config-next)
- No test script / test framework installed.

## Required environment variables (no `.env` exists; set locally)
`MONGODB_CONNECTION_BASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_GOOGLE_CLIENT_ID`,
`BETTER_AUTH_GOOGLE_CLIENT_SECRET`, `IMGBB_KEY_SECRECT_KEY` (note typo: `SECRECT`),
`NEXT_PUBLIC_API_URL`

## Auth (BetterAuth + JWT, MongoDB adapter)
- Server: `src/lib/auth.ts`; handler: `src/app/api/auth/[...all]/route.ts`
- Client: `src/lib/auth-client.ts` → `signIn`, `signUp`, `signOut`, `useSession`, `token()`
- Client pages call `${process.env.NEXT_PUBLIC_API_URL}/api/...` with `Authorization: Bearer <jwt>`
- No `middleware.ts` — enforce protected routes client-side per page
- Google is the only social provider
- Google OAuth redirect URI must be registered in Google Cloud Console:
  `http://localhost:3000/api/auth/callback/google` (else `redirect_uri_mismatch` 400)

## Conventions (verify before deviating)
- Path alias `@/*` → `./src/*`; shadcn/ui at `@/components/ui`, lib at `@/lib`
- Errors/success via `react-toastify` toast — never `alert()` (`ToastContainer` in root layout)
- Toast pattern: per-page `toastOptions` constant (`top-center`, `autoClose: 5000`, `Bounce`, `theme: "light"`)
- Primary buttons: `bg-orange-500 text-white hover:bg-orange-600` + `cursor-pointer`
- After mutations, call `router.refresh()` to refetch data
- Image uploads go to imgbb; allowed remote image hosts in `next.config.ts`: `picsum.photos`, `fastly.picsum.photos`, `i.ibb.co`
- Tailwind CSS v4 loaded via `@tailwindcss/turbopack` turbopack rule

## Routing
- Root layout: `src/app/layout.tsx` (Navbar, ToastContainer, Footer, Geist fonts)
- Public: `/`, `/books`, `/books/[id]`, `/login`, `/sign-up`
- Private (client-enforced): `/add-book`, `/my-books`, `/my-borrows`, `/profile`

## Recent changes (already applied)
- Hero section uses Swiper.js (`src/components/layout/HeroBannar.tsx`)
- Private route redirects added for `/books/[id]` and Borrow dialog