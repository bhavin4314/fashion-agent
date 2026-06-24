# Vistra — AI Fashion Concierge

Vistra is a premium, AI-driven personal stylist and collection manager designed to curate coordinated outfits from a professional inventory catalog. Combining the editorial quality of high-end luxury fashion with the functional efficiency of modern travel platforms, Vistra follows a design system based on **"Warm Precision"** (Minimalist layouts, elegant typography, and Radical Coral high-intent brand highlights).

---

## 🚀 Key Features

### 1. Interactive AI Stylist Concierge
- **Conversational Stylist Assistant**: A professional agent utilizing Google Gemini (`gemini-3.1-flash-lite`) via the Vercel AI SDK to recommend, coordinate, and answer styling queries in real-time.
- **Smart Conversational Routing**: Intercepts basic greetings and off-topic general knowledge queries locally to reduce API costs, politely reminding users of Vistra's specialized styling scope.
- **Category-Aware Prompting**: Automatically matches product-specific queries (e.g. eyewear, watches, garments) and adjusts advice accordingly, including direct links to product pages.

### 2. Advanced Hybrid Search Engine
- **Dense-Sparse Hybrid Scoring**: Implements custom Supabase PostgreSQL functions (`match_products_hybrid`) combining pgvector similarity search (`1 - (embedding <=> query)`) and full-text keyword ranking (`ts_rank_cd`).
- **Color & Tag Synonym Expansion**: Parses search queries and expands colors to advanced synonym lists (e.g., matching a request for "blue" to *navy*, *indigo*, *teal*, or *cerulean*).
- **Soft Product Type Matching**: Smart routing rules resolve specific product types (e.g. mapping "shoes" to footwear/sneakers/loafers, and "shirt" to shirts/kurtas/tops/tees).
- **Overlapping Tag Filters**: Evaluates partial array matches for aesthetics, seasons, occasions, and materials, ensuring accurate filtering.

### 3. Seamless E-Commerce & Checkout Flow
- **Stock-Aware Shopping Cart**: Dedicated checkout/cart flow with real-time stock validations using the reusable `<QuantityInput />` component.
- **Stripe Payment Gateway**: Integration with Stripe checkout for mock/real payment routing, leading to elegant payment outcome flows.
- **Automated PDF Invoices**: Renders premium receipt documents containing complete invoice meta, shipping details, and items table on the client side using `jspdf`.

### 4. Admin Management Dashboard
- **Create Product Wizard**: A multi-step structured form (media uploads, garment specifications, metadata tagging, and description).
- **Stock & Inventory Monitor**: Real-time listing showing active stock counts, archive toggles, and status markers.
- **Order Tracking Console**: Centralized workspace for managing client orders and shipping statuses.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org) with strict React Server Components (RSC) vs Client Component isolation.
- **AI/LLM System**: [Vercel AI SDK](https://sdk.vercel.ai/) using Gemini 3.1 Flash and Gemini Embedding 2 models.
- **Styling & Theme**: Tailwind CSS 4 utilizing the custom **Vistra Design System** tokens (Radical Coral `#ff385c`, Alabaster surface background, 12px rounded corner shapes).
- **Database & Auth**: [Supabase](https://supabase.com/) with pgvector, full-text indexes, PostgreSQL triggers, and Row Level Security (RLS) policies.
- **Form Validation**: React Hook Form with Zod schema verification resolver.
- **Document Rendering**: jsPDF for premium vector invoice exports.

---

## 📂 Codebase Structure

```
src/
├── app/                        # Next.js App Router (pages and server actions)
│   ├── _components/            # Global page-level client/server wrappers (Navbar, SearchPill)
│   ├── admin/                  # Admin portal (dashboard, inventory wizard, order tracking)
│   ├── api/                    # API routes (chat concierge, checkout session, cron cleanups)
│   ├── cart/                   # Shopping cart page and checkout summaries
│   ├── checkout/               # Stripe checkout routing and success handlers
│   ├── collection/             # Catalog browsing, filtering, and pagination
│   └── stylist/                # AI Concierge stylist chat interface
├── components/                 # Shared and low-level visual components
│   ├── forms/                  # Zod schema-integrated Form wrappers (FormInput, FormSelect)
│   ├── shared/                 # Core layouts (CartDrawer, NavigationLoader)
│   └── ui/                     # Design system atoms (Button, Chip, Modal, QuantityInput)
├── hooks/                      # Global custom react hooks (useCart, useDebounce)
├── lib/                        # Common business logic (db product mappers, PDF invoice templates)
├── supabase/                   # Supabase configuration, schema migrations, and functions
└── utils/                      # Client & server supabase initialization utilities
```

---

## ⚙️ Setup & Installation

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/bhavin4314/fashion-agent.git
cd fashion-agent
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_AI_CHAT_MODEL=gemini-3.1-flash-lite
NEXT_PUBLIC_AI_EMBEDDING_MODEL=gemini-embedding-2-preview

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Cron Tasks
CRON_SECRET=your_cron_execution_token
```

### 3. Supabase Migrations
Ensure the Supabase CLI is initialized and apply migrations to sync schemas, types, and search functions:
```bash
# Push migrations to remote database
npx supabase db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📏 Codebase Guidelines (from AGENTS.md)

1. **TypeScript Strictness**: explicit/implicit `any` is forbidden. Inferred Zod schemas are required for all API payloads and inputs.
2. **Server-First Components**: Push `"use client"` directives down to leaf components. Do not declare `"use client"` unless event listeners, state hooks, or browser-only APIs are used.
3. **Zod Form Wrapper**: Use `<Form />` wrappers inside `components/forms/`. Raw HTML `<input>` tags are replaced by design-system wrappers (`<FormInput />`, `<FormPassword />`, etc.).
4. **Navigation Hooks**: Use Next.js `<Link />` for client redirections. Never trigger full page reloads via `window.location`.

