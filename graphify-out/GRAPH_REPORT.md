# Graph Report - fashion-agent  (2026-06-23)

## Corpus Check
- 109 files · ~235,371 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 521 nodes · 867 edges · 43 communities (37 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `edca04bf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 23 edges
2. `createClient()` - 22 edges
3. `Antigravity — AI Agent Codebase Rules` - 17 edges
4. `compilerOptions` - 16 edges
5. `useCart()` - 15 edges
6. `Navbar()` - 10 edges
7. `Product` - 10 edges
8. `formatOrderId()` - 10 edges
9. `Button` - 9 edges
10. `4. Forms & Validation` - 9 edges

## Surprising Connections (you probably didn't know these)
- `ProductDetailInspectorProps` --references--> `Product`  [EXTRACTED]
  app/stylist/_components/ProductDetailInspector.tsx → lib/products.ts
- `AdminOrdersClient()` --calls--> `formatOrderId()`  [EXTRACTED]
  app/admin/orders/_components/AdminOrdersClient.tsx → lib/utils.ts
- `runHybridSearch()` --calls--> `createClient()`  [EXTRACTED]
  app/api/chat/route.ts → utils/supabase/server.ts
- `CheckoutSuccessClient()` --calls--> `useCart()`  [EXTRACTED]
  app/checkout/success/_components/CheckoutSuccessClient.tsx → hooks/use-cart.tsx
- `CheckoutSuccessClient()` --calls--> `formatOrderId()`  [EXTRACTED]
  app/checkout/success/_components/CheckoutSuccessClient.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (43 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (43): defaultValues, LoginFormProps, defaultValues, SignUpForm(), SignUpFormProps, Form(), FormProps, ChipOption (+35 more)

### Community 1 - "Community 1"
Cohesion: 0.16
Nodes (18): InvoiceModal(), InvoiceModalProps, Order, OrderItem, ProfileClientProps, ProfileItem, TrackingTimeline(), TrackingTimelineProps (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (38): CreateProductWizardClient(), CreateProductWizardClientProps, WizardContentProps, Step1Media(), Step1MediaProps, Step2Garment(), Step2GarmentProps, Step3Metadata() (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (43): dependencies, ai, @ai-sdk/google, @ai-sdk/react, clsx, @hookform/resolvers, jspdf, lucide-react (+35 more)

### Community 4 - "Community 4"
Cohesion: 0.17
Nodes (8): metadata, metadata, CollectionClient(), SearchPill(), PageProps, ProductDetailPage(), mapDbProduct(), mapDbToInventoryItem()

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (16): 4.1 Mandatory Stack, 4.2 Schema-First Workflow, 4.3 Centralized `<Form />` Wrapper, 4.4 Form Component Family — The Complete Primitives, 4.5 Form Component Family — Quick Reference, 4.6 The `components/forms/` Directory Structure, 4.7 Complete Form Usage Example, 4.8 Static Options & Default Values (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (24): metadata, ActivityItem, AdminOverviewClient(), AdminOverviewClientProps, CategoryRevenue, CHART_DATA, FEATURED_ITEMS, FeaturedItem (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.17
Nodes (8): metadata, PageProps, signUpAction(), DBOrderItem, StripeAddress, StripeCheckoutSession, StripeShippingDetails, createClient()

### Community 9 - "Community 9"
Cohesion: 0.20
Nodes (9): 11. Naming Conventions, 15. Forbidden Patterns, 2.1 Placement Rules, 2. Project & Folder Structure, 9.1 State Hierarchy, 9.2 Context Rules, 9. State Management, Antigravity — AI Agent Codebase Rules (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.22
Nodes (8): Brand & Style, Colors, Components, Design System: Vistra Fashion Concierge, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (7): 3.1 Default to Server Components, 3.2 When to Add `"use client"`, 3.3 Push `"use client"` to the Leaves, 3.4 Server Actions, 3.5 Metadata, 3.6 Navigation & Redirection, 3. Next.js: Server vs. Client Components

### Community 12 - "Community 12"
Cohesion: 0.33
Nodes (6): 1.1 Compiler Settings, 1.2 `any` is Forbidden, 1.3 Infer Types from Zod Schemas, 1.4 Utility Types, 1.5 Interface vs. Type, 1. TypeScript Strictness

### Community 13 - "Community 13"
Cohesion: 0.33
Nodes (6): 6.1 Design Tokens First, 6.2 Class Ordering, 6.3 Conditional Classes, 6.4 No `@apply` Abuse, 6.5 Responsive Design, 6. Styling & Tailwind CSS

### Community 14 - "Community 14"
Cohesion: 0.33
Nodes (6): 7.1 `next/image` is Mandatory, 7.2 `next/link` is Mandatory, 7.3 `React.memo` and `useMemo` / `useCallback`, 7.4 Dynamic Imports, 7.5 Font Optimization, 7. Performance & Optimization

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (6): 8.1 Fetch in Server Components, 8.2 Parallel Data Fetching, 8.3 `fetch` Cache and Revalidation, 8.4 Client-Side Data Fetching, 8.5 Streaming with Suspense, 8. Data Fetching

### Community 16 - "Community 16"
Cohesion: 0.40
Nodes (5): 12.1 Path Aliases, 12.2 Import Order, 12.3 Type-Only Imports, 12.4 Barrel Files (`index.ts`), 12. Imports & Module Resolution

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (6): 5.1 Mandatory Component Usage, 5.2 Component API Rules, 5.3 The `cn()` Utility, 5.4 Modal Component Rules, 5.5 Shared & Common UI Components, 5. Design System & Base Components

### Community 18 - "Community 18"
Cohesion: 0.60
Nodes (3): config, proxy(), updateSession()

### Community 19 - "Community 19"
Cohesion: 0.40
Nodes (4): name, organization_id, organization_slug, ref

### Community 20 - "Community 20"
Cohesion: 0.50
Nodes (4): 10.1 Route Error Boundaries, 10.2 Typed Error Results, 10.3 `not-found.tsx`, 10. Error Handling

### Community 21 - "Community 21"
Cohesion: 0.50
Nodes (4): 13.1 Stack, 13.2 What to Test, 13.3 Testing Philosophy, 13. Testing Standards

### Community 22 - "Community 22"
Cohesion: 0.50
Nodes (4): 14.1 Baseline Requirements, 14.2 ARIA Rules, 14.3 Form Accessibility, 14. Accessibility (a11y)

### Community 23 - "Community 23"
Cohesion: 0.24
Nodes (4): ProductDetailInspector(), ProductDetailInspectorProps, StylistClient(), metadata

### Community 24 - "Community 24"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 25 - "Community 25"
Cohesion: 0.25
Nodes (12): analyzeQuery(), CHAT_MODEL, checkFashionRelevance(), classifyQuery(), DBProductRecord, EMBEDDING_MODEL, filterProductsByType(), google (+4 more)

### Community 32 - "Community 32"
Cohesion: 0.21
Nodes (7): metadata, AdminLogoutButton(), SidebarNav(), loginAction(), signOutAction(), LoginFormValues, loginSchema

### Community 33 - "Community 33"
Cohesion: 0.30
Nodes (7): metadata, Navbar(), NavbarProps, StripeRedirectClient(), useCart(), getAvatarInitials(), CartDrawer()

### Community 34 - "Community 34"
Cohesion: 0.25
Nodes (5): defaultFlags, FeatureFlagContext, FeatureFlagContextType, Flags, Window

### Community 35 - "Community 35"
Cohesion: 0.83
Nodes (3): GET(), handleCleanup(), POST()

### Community 37 - "Community 37"
Cohesion: 0.07
Nodes (28): AdminOrdersClient(), AdminOrdersClientProps, OrderItemDetail, OrderSummary, SelectedOrderDetails, statusOptions, categoryOptions, InventoryClient() (+20 more)

### Community 38 - "Community 38"
Cohesion: 0.33
Nodes (7): fetchFilteredProductsAction(), FetchProductsParams, CollectionClientProps, ProductDetailClient(), ProductDetailClientProps, Product, PRODUCTS

### Community 39 - "Community 39"
Cohesion: 0.25
Nodes (6): CheckoutSuccessClient(), OrderDetail, OrderItemDetail, getOrderDetailsAction(), verifyStripeSessionAndCreateOrder(), metadata

### Community 40 - "Community 40"
Cohesion: 0.29
Nodes (5): metadata, CartContext, CartContextType, CartItem, CartProvider()

### Community 41 - "Community 41"
Cohesion: 0.33
Nodes (4): ProfileClient(), DBOrder, DBOrderItem, metadata

### Community 42 - "Community 42"
Cohesion: 0.40
Nodes (3): LoginForm(), metadata, PageProps

## Knowledge Gaps
- **243 isolated node(s):** `Flags`, `FeatureFlagContextType`, `FeatureFlagContext`, `defaultFlags`, `Window` (+238 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 8` to `Community 32`, `Community 33`, `Community 2`, `Community 1`, `Community 4`, `Community 37`, `Community 38`, `Community 7`, `Community 41`, `Community 25`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `Antigravity — AI Agent Codebase Rules` connect `Community 9` to `Community 6`, `Community 11`, `Community 12`, `Community 13`, `Community 14`, `Community 15`, `Community 16`, `Community 17`, `Community 20`, `Community 21`, `Community 22`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 7` to `Community 33`, `Community 2`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `Flags`, `FeatureFlagContextType`, `FeatureFlagContext` to the rest of the system?**
  _243 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07010402532790593 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06972789115646258 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._