# Graph Report - fashion-agent  (2026-06-03)

## Corpus Check
- 67 files · ~171,058 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 346 nodes · 510 edges · 35 communities (28 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ac981bbb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Form Components and UI Primitives|Form Components and UI Primitives]]
- [[_COMMUNITY_Package Configuration & Project Dependencies|Package Configuration & Project Dependencies]]
- [[_COMMUNITY_TypeScript Compiler Settings|TypeScript Compiler Settings]]
- [[_COMMUNITY_Interactive Form Selectors and Layouts|Interactive Form Selectors and Layouts]]
- [[_COMMUNITY_Vistra Design System and Secure Authentication|Vistra Design System and Secure Authentication]]
- [[_COMMUNITY_AI Agent Architectural Guidelines and Form Conventions|AI Agent Architectural Guidelines and Form Conventions]]
- [[_COMMUNITY_Development Tools and Environments|Development Tools and Environments]]
- [[_COMMUNITY_Multi-line Text Inputs|Multi-line Text Inputs]]
- [[_COMMUNITY_Global Root Layout and Font Optimization|Global Root Layout and Font Optimization]]
- [[_COMMUNITY_Standard Home Page Segment|Standard Home Page Segment]]
- [[_COMMUNITY_Code Quality & Linting Rules|Code Quality & Linting Rules]]
- [[_COMMUNITY_Next.js Framework Configurations|Next.js Framework Configurations]]
- [[_COMMUNITY_PostCSS Configurations|PostCSS Configurations]]
- [[_COMMUNITY_Root Readme Documentation|Root Readme Documentation]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 30 edges
2. `Antigravity — AI Agent Codebase Rules` - 17 edges
3. `compilerOptions` - 16 edges
4. `Form System Architecture Stack` - 9 edges
5. `4. Forms & Validation` - 8 edges
6. `4.4 Form Component Family — The Complete Primitives` - 8 edges
7. `Design System: Vistra Fashion Concierge` - 8 edges
8. `Button` - 7 edges
9. `LoginForm()` - 6 edges
10. `Form()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `LoginForm()` --implements--> `Form System Architecture Stack`  [INFERRED]
  app/login/_components/LoginForm.tsx → AGENTS.md
- `LoginForm()` --references--> `Radical Coral Accent Color`  [EXTRACTED]
  app/login/_components/LoginForm.tsx → DESIGN.md
- `LoginForm()` --references--> `12px Rounded Corner Radius`  [EXTRACTED]
  app/login/_components/LoginForm.tsx → DESIGN.md
- `LoginPage()` --implements--> `Vistra Design System`  [EXTRACTED]
  app/login/page.tsx → DESIGN.md
- `LoginForm()` --implements--> `Vistra Design System`  [EXTRACTED]
  app/login/_components/LoginForm.tsx → DESIGN.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Vistra Design Tokens** — design_radical_coral, design_tonal_layers, design_rounded_corners [EXTRACTED 1.00]
- **AI Agent Architecture Rules** — agents_typescript_strict, agents_form_stack, agents_rsc_default [EXTRACTED 1.00]

## Communities (35 total, 7 thin omitted)

### Community 0 - "Form Components and UI Primitives"
Cohesion: 0.08
Nodes (46): Form System Architecture Stack, defaultValues, LoginFormValues, loginSchema, defaultValues, SignUpForm(), SignUpFormValues, signUpSchema (+38 more)

### Community 1 - "Package Configuration & Project Dependencies"
Cohesion: 0.33
Nodes (4): INITIAL_ITEMS, InventoryClient(), InventoryItem, metadata

### Community 2 - "TypeScript Compiler Settings"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 3 - "Interactive Form Selectors and Layouts"
Cohesion: 0.33
Nodes (6): 1.1 Compiler Settings, 1.2 `any` is Forbidden, 1.3 Infer Types from Zod Schemas, 1.4 Utility Types, 1.5 Interface vs. Type, 1. TypeScript Strictness

### Community 4 - "Vistra Design System and Secure Authentication"
Cohesion: 0.31
Nodes (8): LoginForm(), Radical Coral Accent Color, 12px Rounded Corner Radius, Tonal Layering & Depth, Vistra Design System, Warm Precision Brand Direction, LoginPage(), metadata

### Community 5 - "AI Agent Architectural Guidelines and Form Conventions"
Cohesion: 0.29
Nodes (6): 11. Naming Conventions, 15. Forbidden Patterns, 2.1 Placement Rules, 2. Project & Folder Structure, Antigravity — AI Agent Codebase Rules, Table of Contents

### Community 6 - "Development Tools and Environments"
Cohesion: 0.06
Nodes (34): dependencies, clsx, @hookform/resolvers, lucide-react, next, postcss, @radix-ui/react-checkbox, @radix-ui/react-dialog (+26 more)

### Community 7 - "Multi-line Text Inputs"
Cohesion: 0.13
Nodes (15): 4.1 Mandatory Stack, 4.2 Schema-First Workflow, 4.3 Centralized `<Form />` Wrapper, 4.4 Form Component Family — The Complete Primitives, 4.5 Form Component Family — Quick Reference, 4.6 The `components/forms/` Directory Structure, 4.7 Complete Form Usage Example, 4. Forms & Validation (+7 more)

### Community 8 - "Global Root Layout and Font Optimization"
Cohesion: 0.33
Nodes (4): geistMono, geistSans, inter, metadata

### Community 9 - "Standard Home Page Segment"
Cohesion: 0.09
Nodes (19): metadata, metadata, CollectionClient(), Product, PRODUCTS, Navbar(), NavbarProps, ProductDetailClient() (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.22
Nodes (8): Brand & Style, Colors, Components, Design System: Vistra Fashion Concierge, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (6): 6.1 Design Tokens First, 6.2 Class Ordering, 6.3 Conditional Classes, 6.4 No `@apply` Abuse, 6.5 Responsive Design, 6. Styling & Tailwind CSS

### Community 16 - "Community 16"
Cohesion: 0.13
Nodes (14): CreateProductWizardClient(), CreateProductWizardClientProps, WizardContentProps, Step1Media(), Step1MediaProps, Step2Garment(), Step3Metadata(), Step3MetadataProps (+6 more)

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (6): 7.1 `next/image` is Mandatory, 7.2 `next/link` is Mandatory, 7.3 `React.memo` and `useMemo` / `useCallback`, 7.4 Dynamic Imports, 7.5 Font Optimization, 7. Performance & Optimization

### Community 19 - "Community 19"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 23 - "Community 23"
Cohesion: 0.15
Nodes (10): metadata, AdminLogoutButton(), SidebarNav(), loginAction(), LoginFormValues, loginSchema, signUpAction(), SignUpFormValues (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.22
Nodes (7): metadata, ActivityItem, AdminOverviewClient(), CHART_DATA, FEATURED_ITEMS, FeaturedItem, RECENT_ACTIVITIES

### Community 25 - "Community 25"
Cohesion: 0.33
Nodes (6): 3.1 Default to Server Components, 3.2 When to Add `"use client"`, 3.3 Push `"use client"` to the Leaves, 3.4 Server Actions, 3.5 Metadata, 3. Next.js: Server vs. Client Components

### Community 26 - "Community 26"
Cohesion: 0.33
Nodes (6): 8.1 Fetch in Server Components, 8.2 Parallel Data Fetching, 8.3 `fetch` Cache and Revalidation, 8.4 Client-Side Data Fetching, 8.5 Streaming with Suspense, 8. Data Fetching

### Community 27 - "Community 27"
Cohesion: 0.40
Nodes (5): 12.1 Path Aliases, 12.2 Import Order, 12.3 Type-Only Imports, 12.4 Barrel Files (`index.ts`), 12. Imports & Module Resolution

### Community 28 - "Community 28"
Cohesion: 0.40
Nodes (5): 5.1 Mandatory Component Usage, 5.2 Component API Rules, 5.3 The `cn()` Utility, 5.4 Modal Component Rules, 5. Design System & Base Components

### Community 29 - "Community 29"
Cohesion: 0.50
Nodes (4): 10.1 Route Error Boundaries, 10.2 Typed Error Results, 10.3 `not-found.tsx`, 10. Error Handling

### Community 30 - "Community 30"
Cohesion: 0.50
Nodes (4): 13.1 Stack, 13.2 What to Test, 13.3 Testing Philosophy, 13. Testing Standards

### Community 31 - "Community 31"
Cohesion: 0.50
Nodes (4): 14.1 Baseline Requirements, 14.2 ARIA Rules, 14.3 Form Accessibility, 14. Accessibility (a11y)

### Community 32 - "Community 32"
Cohesion: 0.67
Nodes (3): 9.1 State Hierarchy, 9.2 Context Rules, 9. State Management

### Community 34 - "Community 34"
Cohesion: 0.60
Nodes (3): config, middleware(), updateSession()

### Community 35 - "Community 35"
Cohesion: 0.50
Nodes (4): Antigravity Codebase Rules, RSC-First Component Rules, Strict TypeScript Standards, Claude Agent References

## Knowledge Gaps
- **176 isolated node(s):** `NavbarProps`, `ActivityItem`, `FeaturedItem`, `RECENT_ACTIVITIES`, `FEATURED_ITEMS` (+171 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Antigravity — AI Agent Codebase Rules` connect `AI Agent Architectural Guidelines and Form Conventions` to `Community 32`, `Interactive Form Selectors and Layouts`, `Multi-line Text Inputs`, `Community 15`, `Community 17`, `Community 25`, `Community 26`, `Community 27`, `Community 28`, `Community 29`, `Community 30`, `Community 31`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `Form()` connect `Form Components and UI Primitives` to `Community 16`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `NavbarProps`, `ActivityItem`, `FeaturedItem` to the rest of the system?**
  _177 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Form Components and UI Primitives` be split into smaller, more focused modules?**
  _Cohesion score 0.08033362598770852 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Development Tools and Environments` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `Multi-line Text Inputs` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._