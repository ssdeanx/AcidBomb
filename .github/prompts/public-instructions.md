# Implementation Plan: Public Frontend Pages (`apps/web`) - v1.3 (Hyper-Detailed Final)

**ID:** `#public-instructions-root-v1.3`
**Tags:** `#frontend`, `#nextjs-15`, `#react-19`, `#typescript`, `#mui-v7`, `#public-pages`, `#hyper-detailed`, `#styling`, `#rsc`, `#performance`, `#seo`, `#a11y`, `#content-specific`, `#deanmachines-ai`, `#copilot-target`, `#final`

**Objective:** Generate the code for the **public-facing pages** (`/`, `/about`, `/documentation/*`, `/services`, `/pricing`) of the `apps/web` Next.js 15 application. Implement to **near production quality**, featuring **content specifically tailored to the DeanMachines AI platform** and adhering strictly to a **professional, modern, edgy, clean, and masculine** aesthetic (using the **dark theme by default** via `@repo/ui/ThemeProvider`). Employ **MUI v7 Core** (`@mui/material`, `@mui/icons-material`) and components from `@repo/ui` (imported via `./ComponentName` convention). Maximize **React Server Components (RSC)** usage. Implement **`next/font`**, **Next.js Metadata API**, and **explicit accessibility (a11y)** best practices.

**Core Technologies & Context:** `#tech-*`, `#context`

* **Framework:** Next.js 15 (App Router) - **Prioritize RSCs** for content/data fetching. Use Client Components (`'use client';`) **only** when essential for hooks/interactivity.
* **Language:** TypeScript 5.8+ - **Strict typing mandatory.** Use types inferred from data fetching and defined interfaces. Avoid `any`.
* **UI Library:** MUI Core v7 (`@mui/material`, `@mui/icons-material`) - Use primarily for layout (`Box`, `Container`, `Grid`, `Stack`, `Paper`) and typography (`Typography`).
* **Shared UI:** `@repo/ui` (Components: `Hero`, `Card`, `Code`, `Button`, `AppBar`, `Sidebar`, `Form`, `Input`, `ChatInterface`, `Collapsible`, `Label`, `Popover`, `ScrollArea`, `Dropdown`, `ThemeProvider`, `Footer`, etc.). Import using `./ComponentName` convention. **Adhere strictly to the props defined in `packages/ui/src/*`.** `#context-ui`, `#context-ui-src`
* **Styling:** MUI System (`sx` prop using **theme tokens extensively** - `palette.*`, `spacing()`, `typography.*`, `shadows[]`, `alpha()`, `shape.borderRadius`), `styled` components (minimal use), CSS Modules (`*.module.css` for complex layout). **Dark Theme MANDATORY**. Aesthetic: **Professional, Modern, Edgy, Clean, Masculine**. Use sharp corners (`borderRadius: 0` or small values like `theme.shape.borderRadius * 0.5`) where appropriate for the 'edgy' feel, high contrast text (`palette.text.primary` on `palette.background.paper`), and impactful primary colors (`palette.primary.main`). `#tech-styling`, `#context-theme`
* **Data Fetching (Server):** Supabase server client (`@/utils/supabase/server`) in RSCs. Use `async/await` directly within components. Implement robust `try...catch` for all fetches. `#tech-data`, `#api`, `#context-supabase-server`
* **Authentication:** Supabase SSR utilities. User state (`user` object or `null`) MUST be checked server-side in RSCs where needed for conditional rendering (e.g., CTAs). `#tech-auth`, `#supabase`, `#context-supabase-middleware`
* **Fonts:** `next/font` (`Inter` as `--font-inter`, `Roboto Mono` as `--font-roboto-mono`) integrated via CSS variables in the MUI theme. `#tech-fonts`
* **Backend Context:** `apps/api` (NestJS) provides endpoints. Uses Mastra, Gemini, Pinecone, Redis, LangSmith. `#context-backend`
* **Environment:** Requires `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`. `#context-env`

**Key Information Sources (Project Files):** `#context`

* `packages/ui/src/*`: **Authoritative source for `./ComponentName` props.** `#context-ui-src`
* `apps/web/app/utils/supabase/server.ts`: Location/usage of `createClient`. `#context-supabase-server`
* `.env.example`: **Definitive ENV VAR names.** `#context-env-example`
* `packages/api/src/links/entities/link.entity.ts`: Assumed `Link` structure: `{ id: string; title: string; url: string; description: string; created_at?: string; }`. `#context-backend-types`
* `apps/web/app/layout.tsx`: Base layout, `ThemeProvider`, root font variables. `#context-layout`
* `apps/web/app/page.module.css`: Existing page-specific styles (`styles.*`). `#context-css-modules`
* `@repo/ui/src/theme/index.ts`: **Authoritative source for theme tokens** (`darkTheme`). `#context-theme`

---

**## 0. Prerequisite Verification (#buildfix-core)** `#buildfix`, `#setup`

* **Action (Manual):** Developer must confirm:
    1. `pnpm build` from root completes without errors.
    2. `apps/web` runs (`pnpm dev --filter web`) and `/about` page renders basic content.
    3. The **dark theme** defined in `@repo/ui/ThemeProvider` is correctly applied globally via `apps/web/app/layout.tsx`.

---

**## 1. Font Optimization (`apps/web/app/layout.tsx` & `@repo/ui/src/theme/index.ts`) (#layout-fonts)** `#tech-fonts`, `#performance`, `#layout`

* **Goal:** Integrate `Inter` (`--font-inter`: 400, 500, 700) and `Roboto Mono` (`--font-roboto-mono`: 400, 700) via `next/font` and apply to MUI theme.
* **Action (Copilot):**
    1. **In `apps/web/app/layout.tsx`:**
        * Import `Inter`, `Roboto_Mono` from `next/font/google`.
        * Instantiate: `const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500', '700'], display: 'swap' });` `const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono', weight: ['400', '700'], display: 'swap' });`
        * Apply to `<body>` tag: `className={`${inter.variable} ${robotoMono.variable}`}`.
    2. **In `@repo/ui/src/theme/index.ts`:**
        * Inside `createTheme` options for `darkTheme` (and `lightTheme` if exists):
        * `typography.fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'`.
        * `typography.button.fontFamily: 'var(--font-inter), sans-serif'`.
        * `typography.monospaceFamily: 'var(--font-roboto-mono), SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'`.
        * `components.MuiCssBaseline.styleOverrides`: Ensure `code, pre, kbd, samp { font-family: var(--font-roboto-mono), monospace; font-size: 0.9em; /* Slightly smaller for mono */ }`.
* **COPILOT:** Implement the font integration in `layout.tsx` and update the theme definitions in `@repo/ui/src/theme/index.ts`. Verify the CSS variable names match exactly.

---

**## 2. Home Page (`apps/web/app/page.tsx`) (#public-home)** `#public-pages`, `#ui`, `#api`, `#styling`, `#seo`, `#rsc`

* **2.1. File Setup:**
  * **Type:** RSC.
  * **Imports:** `React`, `Suspense`, MUI (`Box`, `Container`, `Grid`, `Typography`, `Paper`, `Link` as MuiLink, `Stack`, `Divider`), Next.js (`Link` as NextLink, `Metadata`), Shared UI (`./Hero`, `./Card`, `./Code`, `./Button`), Supabase (`createClient`, `cookies`), styles (`./page.module.css`), Icons (`Psychology`, `Storage as StorageIcon`, `Code as CodeIcon`). `#context-ui-src`, `#context-supabase-server`, `#context-css-modules`
* **COPILOT:** Generate imports for `apps/web/app/page.tsx`.

* **2.2. SEO Metadata (`#public-home-seo`):**
  * **Action:** `export async function generateMetadata(): Promise<Metadata>`.
  * **Content:** `title: 'DeanMachines AI: Build & Deploy Advanced Conversational Agents'`, `description: 'Leverage Mastra, Pinecone vector search, and robust backend tools to create intelligent AI experiences with persistent memory and RAG.'`, `keywords: ['AI agents', 'Mastra', 'Pinecone', 'Redis', 'Upstash', 'Vector Database', 'RAG', 'Conversational AI', 'NestJS', 'Next.js', 'Developer Platform', 'Gemini AI', 'LangSmith', 'TypeScript', 'Large Language Models', 'Vector Embeddings', 'Semantic Search']`.
* **COPILOT:** Generate the `generateMetadata` function with provided content.

* **2.3. Data Fetching (Links - RSC) (`#public-home-links-fetch`):**
  * **Interface:** `interface Link { id: string; title: string; url: string; description: string; }`. `#context-backend-types`
  * **Function:** `async function fetchLinks(): Promise<Link[]>` (define outside component). Use `createClient(cookies())`. Query: `const { data, error } = await supabase.from('links').select('id, title, url, description').order('created_at', { ascending: false }).limit(6);`. Error Handling: `if (error) { console.error('Error fetching links:', error.message); return []; } return data || [];`. `#context-supabase-server`
  * **Call:** `const links = await fetchLinks();` inside `HomePage`.
* **COPILOT:** Define `Link` interface. Implement `fetchLinks` with specified query and robust error handling. Call it in `HomePage`.

* **2.4. Auth State (RSC Check - `#public-home-auth-check`):**
  * **Action:** `const supabase = createClient(cookies()); const { data: { user } } = await supabase.auth.getUser();` inside `HomePage`. `#context-supabase-server`
* **COPILOT:** Add server-side user fetching.

* **2.5. Component Structure & Content (`#public-home-content`):**
  * **Root:** `<Box component="main">`. Use `<Box component="section" sx={{ py: { xs: 8, md: 12 }, /* Add dark gradient/pattern backgrounds if desired */ }}>` for content blocks.
  * **Hero Section (`#public-home-hero`):**
    * Use `./Hero`. Props: `title="Build Smarter Bots, Faster."`, `highlightText="DeanMachines AI"`, `description="The integrated platform for developers crafting next-generation conversational AI. Go beyond simple chatbots with persistent memory, RAG, and custom tool integration powered by Mastra."`. `#context-ui-src`
    * Buttons (Rendered below Hero, centered): `<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 4 }}>`. Use `./Button` with `component={NextLink}`, `href={user ? '/chat' : '/signup'}`, `variant="primary"`, `size="lg"`. Use `./Button` with `component={NextLink}`, `href="/documentation"`, `variant="outline"`, `size="lg"`.
    * **Styling:** Hero should manage its internal dark, high-contrast, edgy style.
  * **Features Section (`#public-home-features`):**
    * Layout: `Container(maxWidth="lg")`, `Typography(variant="h3", align="center", sx={ mb: 8, fontWeight: 700 })`, `Grid(container, spacing={4}, justifyContent="center")`.
    * Cards: 3 x `Grid(item, xs=12, sm=6, md=4)`. Use `./Card`. `#context-ui-src`
    * Card Props: `variant="outlined"`. Pass Icon component directly (e.g., `icon={<Psychology sx={{ fontSize: 48, color: 'primary.main' }} />}`). Pass `title` and `description` (use specific texts about Mastra, Pinecone/Redis Memory, Dev Stack).
    * **Styling:** Card `sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 4, textAlign: 'center', bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 2, '&:hover': { borderColor: 'primary.main', transform: 'translateY(-5px)', boxShadow: (theme) => theme.shadows[8] } }}`. Title `Typography(variant="h5", mb=1.5, fontWeight="medium")`. Description `Typography(variant="body1", color="text.secondary")`.
  * **Code Demo Section (`#public-home-code`):**
    * Layout: `Container(maxWidth="md", sx={{ my: { xs: 10, md: 16 } }})`, `Paper(variant="outlined", sx={...})`, `Typography(variant="h4", sx={ mb: 3 })`. Title: "Example: Defining a Mastra Tool".
    * Code: Use `./Code` component. Props: `variant="block"`, `highlight={true}`. Provide the `weatherTool` TypeScript snippet. `#context-ui-src`
    * **Styling:** `Paper sx={{ p: { xs: 3, sm: 4 }, bgcolor: 'grey.900', border: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }}`.
  * **Links Section (`#public-home-links-render`):**
    * Layout: `Container(maxWidth="lg")`, `Typography(variant="h4", align="center", sx={ mb: 6, fontWeight: 700 })`. Title: "Resources & Updates".
    * Conditional: If `links.length === 0`, render `<Typography align="center" color="text.secondary">No resources posted yet.</Typography>`.
    * Grid/Card: If links exist, use `<Grid container spacing={4}>`. Map `links`. `Grid(item, xs=12, sm=6, md=4)`. Use `MuiLink component={NextLink} href={link.url} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none', display: 'block', height: '100%' }}>`. Wrap `./Card`. Card props: `variant="outlined"`, `title={link.title}`, `description={link.description}`. Use `CardHeader titleTypographyProps={{ variant: 'h6', fontWeight: 'medium' }}` and `CardContent`. `#context-ui-src`
    * **Styling:** Card `sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', border: 1, borderColor: 'divider', '&:hover': { borderColor: 'primary.light', boxShadow: (theme) => theme.shadows[4] } }}`. `CardContent sx={{ flexGrow: 1 }}`.
  * **Final CTA (`#public-home-cta`):**
    * Layout: `Container(textAlign="center", sx={{ py: { xs: 10, md: 16 } }})`. `Typography(variant="h4", sx={ mb: 4 })`. Title: "Ready to build smarter AI?".
    * Button: `./Button component={NextLink} href={user ? '/chat' : '/signup'} variant="primary" size="lg"> {user ? 'Start Chatting Now' : 'Sign Up For Free'} </Button>`.
* **COPILOT:** Generate the full `HomePage` component. Use specified components, props, content. Apply hyper-detailed `sx` styling using dark theme tokens (`palette.background.paper`, `palette.primary.main`, `palette.text.secondary`, `spacing()`, `shadows[]`, `typography.*`, `alpha()`, `shape.borderRadius`). Implement dynamic links/text based on `user`. Ensure semantic `<section>` tags wrap logical blocks.

---

**## 3. Documentation Section (`apps/web/app/documentation/**`) (#public-docs)** `#public-pages`, `#ui`, `#styling`, `#seo`, `#a11y`, `#rsc`

* **3.1. Create Layout (`apps/web/app/documentation/layout.tsx`) (#public-docs-layout):**
  * **Type:** RSC.
  * **Imports:** MUI (`Container`, `Box`), `./DocumentationSidebarNav`.
  * **Structure:** `<Container maxWidth="xl" sx={{ display: 'flex', py: { xs: 3, md: 5 }, gap: { xs: 0, md: 5 } }}> <DocumentationSidebarNav /> <Box component="article" /* Use article for main doc content */ sx={{ flexGrow: 1, minWidth: 0 }}>{children}</Box> </Container>`.
* **COPILOT:** Generate `documentation/layout.tsx` with semantic `<article>`.

* **3.2. Create Client Sidebar Component (`apps/web/app/documentation/DocumentationSidebarNav.tsx`) (#public-docs-sidebar-nav):**
  * **Type:** `'use client';`
  * **Imports:** React, MUI (`Box`, `List`, `ListItemButton`, `ListItemText`, `Paper`, `Typography`, `useMediaQuery`, `useTheme`, `alpha`), `Link` (Next), `usePathname` (Next).
  * **Navigation Items:** `const navItems = [{ title: 'Overview', href: '/documentation' }, { title: 'Getting Started', href: '/documentation/getting-started' }, /* ... all others ... */ ];`.
  * **Logic:** `const pathname = usePathname(); const theme = useTheme(); const isMobile = useMediaQuery(theme.breakpoints.down('md'));`.
  * **Structure:** `if (isMobile) return null; /* Or implement Drawer toggle */`. Return `<Box component="aside" /* Use aside for nav */ sx={{ width: 240, flexShrink: 0 }}> <Paper variant="outlined" sx={{ position: 'sticky', top: 80, height: 'calc(100vh - 100px)', overflowY: 'auto', p: 1.5, bgcolor: 'background.default', border: 0, borderRight: 1, borderColor: 'divider' }}> <Typography variant="overline" sx={{ px: 1.5, py: 1, display: 'block', color: 'text.secondary', fontWeight: 'medium' }}>Documentation</Typography> <List dense component="nav" aria-label="Documentation Sections"> {navItems.map(...)} </List> </Paper> </Box>`.
  * **Mapping:** `ListItemButton component={NextLink} href={item.href} selected={pathname === item.href} aria-current={pathname === item.href ? 'page' : undefined} sx={{ '&.Mui-selected': { bgcolor: alpha(theme.palette.primary.main, 0.15), color: 'primary.light', '& .MuiListItemText-primary': { fontWeight: 500 }, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.25) } }, '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.08) }, borderRadius: 1, mb: 0.5 }}> <ListItemText primary={item.title} /> </ListItemButton>`.
* **COPILOT:** Generate `DocumentationSidebarNav.tsx` as a client component. Implement structure, detailed styling (use theme tokens), accessibility (`aria-label`, `aria-current`), and active state logic.

* **3.3. Create Individual Documentation Pages (RSC):**
  * **General:**
    * **Type:** RSC.
    * **Imports:** MUI (`Box`, `Typography`, `Stack`, `Paper`, `Table`, `TableBody`, `TableCell`, `TableContainer`, `TableHead`, `TableRow`, `List`, `ListItem`, `Link` as MuiLink, `Divider`, `Alert`), Shared UI (`./Code`, `./Collapsible`). `#context-ui-src`
    * **Metadata:** `export async function generateMetadata()` for each page.
    * **Structure:** Use `<Stack spacing={5}>` for main content blocks. Use semantic headings (`Typography variant="h2" component="h1"`, `Typography variant="h3" component="h2"`, `Typography variant="h4" component="h3"`). Use `<Divider sx={{ my: 4 }} />` between major sections if needed.
    * **Styling:** Use `sx` props with theme tokens. Code blocks: `./Code variant="inline" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), px: 0.5, borderRadius: 0.5 }}`. `./Code variant="block" highlight={true}` wrapped in `<Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.900', borderRadius: 1, overflowX: 'auto', my: 2, border: '1px solid', borderColor: 'divider' }}>`. Ensure text (`Typography variant="body1" color="text.secondary"`) is highly readable on dark background. Use `MuiLink component={NextLink}` for internal doc links, `MuiLink href="..." target="_blank"` for external. `#tech-styling`, `#context-theme`
    * **Accessibility:** Ensure logical heading order. Use `aria-describedby` if complex figures need explanation.
  * **COPILOT:** Generate each documentation page (`/page.tsx`, `/getting-started/page.tsx`, etc.) as an RSC. Implement `generateMetadata`. Structure content semantically using MUI and shared UI. Apply hyper-detailed styling using `sx` and theme tokens. **Use exact ENV VAR names from `.env.example` in the Getting Started table, marking sensitive parts like `<your_api_key>` clearly.** Provide the full, detailed text content for Core Concepts, Architecture flow, etc., as outlined in v1.1. Format API Reference clearly using `./Collapsible` (ensure trigger is accessible) and `./Code` for request/response examples (use JSON format). For Guides, use disabled `ListItemText`.

---

**## 4. About Page (`apps/web/app/about/page.tsx` - Update) (#public-about)** `#public-pages`, `#ui`, `#styling`, `#seo`, `#rsc`

* **Type:** RSC.
* **Imports:** MUI (`Container`, `Box`, `Stack`, `Typography`, `Grid`, `Paper`), Icons (Use specific MUI icons: `RocketLaunch`, `DataObject`, `Storage`, `Memory`, `Build`, `Security`, `Speed`, `Code`, `Hub`, `PrecisionManufacturing`, `GitHub`, `LinkedIn`), shared `./Button`, `Link` (Next).
* **Metadata:** `generateMetadata({ title: 'About | DeanMachines AI', ... })`.
* **Structure:** `<Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}> <Stack spacing={10}> ... </Stack> </Container>`.
* **Content:**
  * **Mission:** `Box(textAlign="center")`, `Typography(h3, sx={fontWeight: 'bold'})`, `Typography(h6, color="text.secondary", maxWidth="md", mx="auto")`. Content: "Empowering developers to build truly intelligent, context-aware conversational AI applications. DeanMachines AI provides a powerful, integrated platform to build, deploy, and manage sophisticated conversational AI agents with advanced memory, reasoning, and tool-use capabilities. We handle the complexity so you can focus on creating unique AI experiences."
  * **Tech Stack:** `Box(textAlign="center")`, `Typography(h4, sx={ mb: 4 })`. Title: "Built with Cutting-Edge Technology". `Grid(container, spacing={3}, justifyContent="center")`. Grid Items `Grid(item, xs={6}, sm={4}, md={3}, lg={2})`. Inside: `Paper(variant="outlined", sx={ p: 2.5, textAlign: 'center', height: '100%', bgcolor: 'background.default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 })`. Content: `<IconComponent sx={{ fontSize: 36, color: 'primary.light' }} /> <Typography variant="caption" display="block" fontWeight="medium">Tech Name</Typography>`. Include icons & names for: Next.js, React, NestJS, TypeScript, Supabase, Pinecone, Upstash Redis, Mastra AI, Google Gemini, LangSmith, MUI, Turborepo.
  * **Team/Creator:** `Box(textAlign="center")`. `Typography(h4, sx={ mb: 2 })`. Title: "Meet the Creator". `Typography(color="text.secondary")`: "[Insert 1-2 sentences about the creator/team, background, motivation. Placeholder text for now.]"
  * **Contact/Links:** `Box(textAlign="center")`, `Typography(h4, sx={ mb: 3 })`. Title: "Connect & Contribute". `Stack(direction="row", spacing={2}, justifyContent="center")`. Use `./Button variant="text" component={NextLink} href="[GitHub Repo URL]" target="_blank" startIcon={<GitHub />}>GitHub</Button>`. Use `./Button variant="text" component={NextLink} href="[LinkedIn URL]" target="_blank" startIcon={<LinkedIn />}>LinkedIn</Button>`.
* **COPILOT:** Update `about/page.tsx`. Implement `generateMetadata`. Structure content. Use specified MUI Icons. Apply detailed dark theme styling (`background.default`, `text.secondary`, `primary.light`). Fill in mission text. Use placeholders for Team/Links.

---

**## 5. Services Page (`apps/web/app/services/page.tsx` - Create) (#public-services)** `#public-pages`, `#ui`, `#styling`, `#seo`, `#rsc`

* **Type:** RSC.
* **Imports:** MUI (`Container`, `Box`, `Grid`, `Typography`, `Stack`, `CardContent`), Icons (`AccountTree`, `Memory`, `FindInPage`, `Build`, `Insights`), shared `./Card`, `./Button`, `Link` (Next). `#context-ui-src`
* **Metadata:** `generateMetadata({ title: 'Platform Services | DeanMachines AI', ... })`.
* **Structure:** `Container(maxWidth="lg", sx={{ py: { xs: 8, md: 12 } }})`. Header `Box(textAlign="center", mb=10)`. `Grid(container, spacing={5})`. CTA `Box`.
* **Content Sections (Grid Items):** `Grid(item, xs=12, md=6)`. Use `./Card`. Props: `variant="outlined"`, `sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', p: 1.5 }}`. Inside: `<CardContent sx={{ flexGrow: 1 }}> <Stack direction="row" spacing={2.5} alignItems="center" mb={2.5}> <IconComponent sx={{ color: 'primary.main', fontSize: 44 }} /> <Typography variant="h5" component="div" fontWeight={500}>Service Title</Typography> </Stack> <Typography variant="body1" color="text.secondary">Detailed description...</Typography> </CardContent>`. Use specified icons and **detailed descriptions** explaining *how* DeanMachines uses Mastra for orchestration, Pinecone+Redis for memory, Pinecone for RAG, Mastra for custom tools, and LangSmith for evaluation.
* **CTA:** `Box(textAlign="center", mt=10)`. `Typography(h5, sx={ mb: 3 })`. Title: "Ready to leverage these services?". `./Button variant="primary" size="lg" component={NextLink} href="/pricing">Explore Pricing Options</Button>`.
* **COPILOT:** Create `services/page.tsx`. Implement `generateMetadata`. Structure with `Container`, `Grid`, `./Card`. Populate content with specified icons and detailed descriptions. Add CTA. Apply detailed dark theme styling (`background.paper`, `text.secondary`, `primary.main`).

---

**## 6. Pricing Page (`apps/web/app/pricing/page.tsx` - Create) (#public-pricing)** `#public-pages`, `#ui`, `#styling`, `#seo`, `#a11y`, `#rsc`

* **Type:** RSC.
* **Imports:** MUI (`Container`, `Box`, `Grid`, `Typography`, `Stack`, `List`, `ListItem`, `ListItemIcon`, `ListItemText`, `Paper`, `CardHeader`, `CardContent`, `CardActions`, `Divider`), Icons (`CheckCircleOutline`, `HelpOutline`), shared `./Card`, `./Button`, `./Collapsible`, `Link` (Next). `#context-ui-src`
* **Metadata:** `generateMetadata({ title: 'Pricing Plans | DeanMachines AI', ... })`.
* **Structure:** `Container(maxWidth="lg", sx={...})`. Header `Box(textAlign="center", mb=10)`. `Grid(container, spacing={5}, justifyContent="center", alignItems="stretch")`. FAQ `Box`.
* **Tiers (Grid Items):** `Grid(item, xs=12, md=5)`. Use `./Card`.
  * **Free:** `variant="outlined"`, `sx={ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', borderRadius: 2 }`. `CardHeader(title="Free", subheader="For personal projects & exploration", sx={ bgcolor: 'grey.800' }, titleTypographyProps={ align: 'center', variant: 'h4', fontWeight: 'medium' }, subheaderTypographyProps={ align: 'center' })`. `CardContent(sx={ flexGrow: 1 })`: Price Box (`Typography(h3)` "$0", `Typography(h6, color="text.secondary")` "/mo"), Features `List(dense)` (`ListItem disablePadding` + `<ListItemIcon sx={{ minWidth: 32 }}><CheckCircleOutline sx={{ color: 'success.main', fontSize: 20 }} /></ListItemIcon>` + `ListItemText primary="Feature Text"`). Features: "100 Agent Runs/mo", "10MB Vector Storage (Pinecone)", "1-Day Memory History (Redis)", "Community Support". `CardActions(sx={ justifyContent: 'center', p: 2.5, borderTop: 1, borderColor: 'divider' }) > Button(variant="outline", fullWidth, component=NextLink, href="/signup")`.
  * **Pro:** `variant="outlined"`, `sx={ ..., borderColor: 'primary.main', borderWidth: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), boxShadow: (theme) => theme.shadows[3] }`. `CardHeader(title="Pro", subheader="For developers & small teams", sx={ bgcolor: alpha(theme.palette.primary.main, 0.1) }, ...)`. `CardContent`: Price Box (`Typography(h3)` "$19"), Features `List`. Features: "5,000 Agent Runs/mo", "1GB Vector Storage (Pinecone)", "30-Day Memory History (Redis)", "Email Support", "Access to Beta Features". `CardActions > Button(variant="primary", fullWidth, component=NextLink, href="/signup")`.
* **FAQ:** `Box(mt=10, maxWidth="md", mx="auto")`. `Typography(h4, align="center", sx={ mb: 4 })`. Title: "Frequently Asked Questions". `Stack(spacing=2)`. Map Q&A to `./Collapsible header={<Typography fontWeight="medium">Q</Typography>}> <Box sx={{ pt: 1, pl: 2 }}><Typography variant="body2" color="text.secondary">A</Typography></Box> </Collapsible>`. Ensure `./Collapsible` uses an appropriate expand/collapse icon (e.g., `ExpandMoreIcon`). `#context-ui-src`
* **COPILOT:** Create `pricing/page.tsx`. Implement `generateMetadata`. Structure with `Container`, `Grid`, `./Card`. Populate tiers with detailed styling, features, icons. Highlight Pro card. Implement FAQ using `./Collapsible`. Apply clean, modern dark theme styling with high contrast.

---

**## 7. Final Review & Accessibility Check (#review)** `#review`, `#a11y`

* **Action (Manual):** Developer must perform thorough review:
  * **Visual Consistency:** Check dark theme application, spacing, typography hierarchy, "edgy/clean" aesthetic across all pages.
  * **Content:** Verify all text, features, pricing details are accurate.
  * **Functionality:** Test all internal (`NextLink`) and external (`MuiLink target="_blank"`) links. Test responsiveness thoroughly.
  * **Accessibility:** Use browser dev tools (Lighthouse/Axe) AND manual checks (keyboard navigation for sidebar/collapsibles/buttons, screen reader compatibility for headings/links/landmarks). Ensure sufficient color contrast (`text.secondary` on `background.paper`, etc.). Add `aria-label`s where necessary (e.g., potentially on card links if only an icon is present). Ensure semantic HTML (`<main>`, `<nav>`, `<aside>`, `<article>`, `<h1>`-`<h6>`).

---

**## Copilot Execution Notes:**

* **Imports:** Use consistent path aliases (e.g., `@/utils/supabase/server`, `@/components/Button` or `@repo/ui/Button`) or relative paths for shared UI. Import MUI core components directly (`@mui/material`, `@mui/icons-material`). Verify Copilot uses the correct convention based on your `tsconfig.json` paths.
* **Styling Priority:** **Strongly prefer the `sx` prop with theme tokens.** Use tokens directly (e.g., `bgcolor: 'background.paper'`, `color: 'primary.main'`, `p: theme.spacing(2)`, `borderRadius: theme.shape.borderRadius`). Use `alpha()` from MUI for transparency. Use CSS Modules (`styles.*`) **only** for complex, non-reusable page layouts or when `sx` becomes excessively long and unreadable. Avoid the `styled` utility unless creating genuinely reusable styled components not suitable for `@repo/ui`.
* **RSC First:** Generate components as RSCs by default. Only add `'use client';` when React Hooks (`useState`, `useEffect`, `useContext`, `usePathname`, etc.) are explicitly required by the implementation step (e.g., Documentation Sidebar).
* **Content:** Use the exact text provided for titles, descriptions, features, code snippets, etc. Fill in placeholders like `[Your GitHub Repo Link]` or `[Add specific details...]` manually later.
* **Data Fetching:** Implement RSC data fetching functions (`fetchLinks`) exactly as specified, including the Supabase client call, `.select()`, `.order()`, `.limit()`, and the `try...catch` block with `console.error` and returning `[]`.
* **Accessibility:** When generating components:
  * Ensure `Typography` variants map to semantic heading levels (`component="h1"`, `component="h2"` etc.).
  * Add `aria-label` to `IconButton` components that lack visible text.
  * Use semantic HTML elements (`<Box component="main">`, `<Box component="nav">`, `<Box component="aside">`, `<Box component="article">`, `<Box component="section">`) where specified.
  * For interactive components like `./Collapsible`, ensure the trigger element (likely within the `header` prop) is a `button` or has appropriate `role="button"` and keyboard event handlers if not a native button.
* **Component Props:** Refer **strictly** to the props available on the components defined in `packages/ui/src/*` when using `./ComponentName`. If a required style or structure isn't supported by a prop, use MUI layout components (`Box`, `Stack`, `Grid`) around the shared component or apply `sx` props carefully.

---
