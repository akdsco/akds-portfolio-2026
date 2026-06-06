We're bootstrapping a personal portfolio site from scratch.

## Context
- Owner: Arkadiusz ("akds")
- Primary goal: land software engineering jobs — optimize for recruiters and hiring managers scanning quickly
- Design is intentionally deferred. This bootstrap is structural only. Treat the home page as a working placeholder, not a design.

## Stack (locked)
- Next.js 15, App Router
- TypeScript with **total strict mode** (`strict: true` + `noUncheckedIndexedAccess` + `noImplicitOverride`)
- Tailwind CSS v3 (NOT v4 — shadcn's mainstream path)
- shadcn/ui (canonical install)
- next-themes (light + dark, default to system preference)
- Lucide icons
- @vercel/analytics
- ESLint + Prettier (+ `prettier-plugin-tailwindcss`)
- npm
- No `src/` directory
- `@/*` import alias

## Out of scope (do not add)
- Bootstrap, SCSS, Sass, react-bootstrap, fslightbox, react-slick, particles libraries
- Any contact API or nodemailer — the contact path is a visible `mailto:` link
- MDX, Contentlayer, any CMS
- Tests — defer until there's something worth testing
- Visual design polish — separate phase later

## Tasks

1. **Initialize Next.js in the current directory.** If the repo already has `README.md` / `LICENSE`, move them aside, run create-next-app, then restore them on top:
   ```
   npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm
   ```

2. **Pin Tailwind to v3** if create-next-app installed v4:
   ```
   npm install -D tailwindcss@^3 postcss@^8 autoprefixer@^10
   ```
   Verify `tailwind.config.ts` is a standard v3 config. Re-init if needed.

3. **Initialize shadcn/ui**:
   ```
   npx shadcn@latest init
   ```
   Defaults: New York style, Zinc base color, CSS variables = yes, RSC = yes.

4. **Install starter shadcn primitives** I'll definitely need:
   ```
   npx shadcn@latest add button card
   ```

5. **Set up theme support**:
   - `npm install next-themes`
   - Create `components/theme-provider.tsx` (client component wrapping `next-themes`'s ThemeProvider)
   - In `app/layout.tsx`: wrap children in `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>`, add `suppressHydrationWarning` to `<html>`
   - Add a `components/mode-toggle.tsx` using shadcn's standard Sun/Moon Lucide pattern

6. **Add Vercel Analytics**:
   - `npm install @vercel/analytics`
   - Mount `<Analytics />` in `app/layout.tsx`

7. **Set up Prettier**:
   - `npm install -D prettier prettier-plugin-tailwindcss eslint-config-prettier`
   - `.prettierrc`: `{ "plugins": ["prettier-plugin-tailwindcss"], "semi": true, "singleQuote": false }`
   - Make sure ESLint extends `prettier` to suppress style conflicts

8. **Tighten TypeScript** in `tsconfig.json`:
   ```jsonc
   "strict": true,
   "noUncheckedIndexedAccess": true,
   "noImplicitOverride": true
   ```

9. **Build a minimal-but-real home page** at `app/page.tsx`:
   - Heading: "Hi, I'm Arkadiusz" (ask me before writing any further bio copy — I'll provide it)
   - A visible `mailto:` link as the primary contact CTA, using shadcn `Button`
   - Skeleton top nav with placeholder links: About, Resume, Projects (routes can 404 for now or render placeholders)
   - Mode toggle visible in the nav
   - This is structural, not designed — just clean defaults from shadcn

10. **Verify**:
    - `npm run lint` passes
    - `npm run build` succeeds
    - `npm run dev` serves the home page; theme toggle works; OS-level dark mode is respected on first visit

11. **Write `CLAUDE.md`** at the repo root documenting:
    - Project goal
    - Stack & conventions
    - Folder structure
    - Commands
    - Theming approach
    - Note: no contact API; email link only
    - Note: data layer (`data/`, typed TS objects) will be added in a later phase

## Conventions
- Routes under `app/`
- Shared components in `components/`; shadcn primitives in `components/ui/`
- Utilities in `lib/`
- Data in `data/` (added later — typed TS objects, no MDX)
- File naming: kebab-case for files, PascalCase for component exports
- Imports use `@/`

## Before you start
Ask me about anything genuinely ambiguous. Don't invent bio copy, job titles, or project content — I'll provide those. When done, tell me:
- What's running
- What URL to open
- Any decisions you had to make
- The proposed next step
