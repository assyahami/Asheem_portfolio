# App knowledge — e90141cc-fd59-4ee3-a23a-1eb3196af077

_Auto-generated after each build from the app's persisted files. Do not hand-edit — it is regenerated automatically. Treat it as the authoritative orientation map; read individual files only when you need their contents._

## Pages (2)
- app/(protected)/admin/page.tsx
- app/page.tsx

## API routes (2)
- app/api/contact/route.ts
- app/api/portfolio/route.ts

## Components (63)
- components/AuthSessionProvider.tsx
- components/data/ActionButton.tsx
- components/data/CartProvider.tsx
- components/data/DataForm.tsx
- components/data/FilterTable.tsx
- components/portfolio/AboutSection.tsx
- components/portfolio/ContactSection.tsx
- components/portfolio/HeroSection.tsx
- components/portfolio/MapSection.tsx
- components/portfolio/TimelineSection.tsx
- components/portfolio/WorksSection.tsx
- components/ui/accordion.tsx
- components/ui/alert-dialog.tsx
- components/ui/alert.tsx
- components/ui/area-chart.tsx
- components/ui/aspect-ratio.tsx
- components/ui/avatar.tsx
- components/ui/badge.tsx
- components/ui/bar-chart.tsx
- components/ui/breadcrumb.tsx
- components/ui/button.tsx
- components/ui/calendar.tsx
- components/ui/card.tsx
- components/ui/carousel.tsx
- components/ui/chart.tsx
- components/ui/checkbox.tsx
- components/ui/collapsible.tsx
- components/ui/command.tsx
- components/ui/context-menu.tsx
- components/ui/data-table.tsx
- components/ui/dialog.tsx
- components/ui/drawer.tsx
- components/ui/dropdown-menu.tsx
- components/ui/form.tsx
- components/ui/hover-card.tsx
- components/ui/input-otp.tsx
- components/ui/input.tsx
- components/ui/label.tsx
- components/ui/line-chart.tsx
- components/ui/menubar.tsx
- components/ui/navigation-menu.tsx
- components/ui/pagination.tsx
- components/ui/pie-chart.tsx
- components/ui/popover.tsx
- components/ui/progress.tsx
- components/ui/radar-chart.tsx
- components/ui/radial-bar-chart.tsx
- components/ui/radio-group.tsx
- components/ui/resizable.tsx
- components/ui/scroll-area.tsx
- components/ui/select.tsx
- components/ui/separator.tsx
- components/ui/sheet.tsx
- components/ui/skeleton.tsx
- components/ui/slider.tsx
- components/ui/sonner.tsx
- components/ui/switch.tsx
- components/ui/table.tsx
- components/ui/tabs.tsx
- components/ui/textarea.tsx
- …and 3 more components

## Lib / helpers (4)
- lib/mobile-api-cors.ts
- lib/portfolio-data.ts — exports: HeroData, AboutData, Project, Place, TimelineEntry, PortfolioData, getPortfolioData, updatePortfolioSection — Mock portfolio data store — in-memory, persists for the lifetime of the dev server process
- lib/theme-context.tsx
- lib/utils.ts

## Other files (6)
- .npmrc
- components.json
- hooks/use-toast.ts
- package-lock.json
- package.json
- tailwind.config.ts

## Database entities
- (no database entities)

## npm dependencies
- @auth/pg-adapter
- @hookform/resolvers
- @radix-ui/react-accordion
- @radix-ui/react-alert-dialog
- @radix-ui/react-avatar
- @radix-ui/react-checkbox
- @radix-ui/react-collapsible
- @radix-ui/react-context-menu
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-hover-card
- @radix-ui/react-label
- @radix-ui/react-menubar
- @radix-ui/react-navigation-menu
- @radix-ui/react-popover
- @radix-ui/react-progress
- @radix-ui/react-radio-group
- @radix-ui/react-scroll-area
- @radix-ui/react-select
- @radix-ui/react-separator
- @radix-ui/react-slider
- @radix-ui/react-slot
- @radix-ui/react-switch
- @radix-ui/react-tabs
- @radix-ui/react-toggle
- @radix-ui/react-toggle-group
- @radix-ui/react-tooltip
- @sendgrid/mail
- @tanstack/react-table
- autoprefixer
- bcryptjs
- class-variance-authority
- clsx
- cmdk
- date-fns
- embla-carousel-react
- framer-motion
- gsap
- input-otp
- lucide-react
- next
- next-auth
- next-themes
- pg
- postcss
- react
- react-day-picker
- react-dom
- react-hook-form
- react-resizable-panels
- recharts
- resend
- sonner
- stripe
- swr
- tailwind-merge
- tailwindcss
- tailwindcss-animate
- three
- twilio
- typescript
- vaul
- zod

## Images
_No images in `public/images/library/` yet. Search with `image_search`, then `materialize_image` to save once and reuse the returned `url_path` everywhere._

## Platform conventions
- Next.js **App Router**. Public pages use `app/<segment>/page.tsx`; authenticated pages use `app/(protected)/<segment>/page.tsx`. Never create `pages/**` files.
- API handlers live under `app/api/**/route.ts`, export named HTTP methods, and use the shared pool from `lib/db.ts` with `$1, $2…` positional placeholders — never string-interpolate values into SQL.
- JSON responses go through the helpers in `lib/json.ts`.
- Design tokens are CSS variables in `styles/globals.css` (managed by the platform) — style with the token classes, do not hardcode palette hexes.
- `package.json` is a locked path — add packages via the add_dependency tool only.
