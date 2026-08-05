# Spec: Client UI Redesign — "Codex"

**Date:** 2026-08-05
**Status:** Approved

## Context

The Angular client currently uses the stock Material Design prebuilt indigo-pink theme with no customization. The visual identity is 100% default. All colors are hardcoded in CSS. Typography uses scattered `!important` overrides. Borders are mixed sharp/round. Empty states lack CTAs. Loading states are primitive text+spinner.

This spec describes a complete visual redesign to give the blog a polished, editorial developer-publication identity.

## Design Tokens

### Color System

```
--color-primary:        #1e293b    (slate-800)
--color-primary-light:  #334155    (slate-700, hover/active)
--color-accent:         #f59e0b    (amber-500)
--color-accent-dark:    #d97706    (amber-600, hover)
--color-surface:        #ffffff
--color-background:     #f8fafc    (slate-50)
--color-warn:           #ef4444    (red-500)
--color-warn-light:     #fef2f2    (red-50, error bg)
--color-text-primary:   #1e293b
--color-text-secondary: #64748b    (slate-500)
--color-text-muted:     #94a3b8    (slate-400)
--color-border:         #e2e8f0    (slate-200)
--color-success:        #10b981    (emerald-500)
```

### Typography Scale

| Level | Size | Weight | Usage |
|---|---|---|---|
| Display | 1.75rem | 700 | Hero title only |
| Heading | 1.25rem | 600 | Card titles, section headers |
| Body | 1rem | 400 | Content text, 1.7 line-height |
| Body-sm | 0.875rem | 400 | Metadata, captions, form hints |
| Button | 0.9375rem | 500 | All button labels |
| Code | 0.8125rem | 400 | Monospace inline code (future) |

### Spacing & Shape

- Card border-radius: **8px** everywhere, consistent
- Button border-radius: **6px**
- Card padding: 24px
- Section gap: 20px
- Container max-width: 960px
- Page padding: 24px/16px (desktop/mobile)

### Iconography

Keep Material Icons. Size scale:
- Hero/decorative: 40px
- Card title companion: 24px
- Button icon: 18px
- Metadata inline: 14px
- Empty state: 56px

## Component Design

### 1. App Shell (app.html)

**Current:** Indigo mat-toolbar with hardcoded shadow, default font sizes.

**Target:**
- Slate-800 toolbar background (primary)
- No hardcoded box-shadow — use Material elevation class or remove
- Brand: "NestJS GraphQL Blog" — 1.3rem, weight 700, letter-spacing -0.5px
- Nav links: "Posts" and "New Post" as mat-button, 0.9rem, weight 500
- Accent indicator bar (2px amber) under active nav item via routerLinkActive
- Container background: slate-50 (#f8fafc)

### 2. Home Page (home.html)

**Current:** White card on gray, two paragraphs, two rectangular buttons.

**Target:**
- Hero card with 3px top border gradient (amber-500 → slate-700)
- Card background: white, 8px radius, subtle shadow
- Icon: `auto_stories` at 40px, amber-500 color (not hardcoded indigo)
- Title: 1.75rem, weight 700, slate-800
- Subtitle: 0.875rem, slate-500, italic
- Description: 1rem, line-height 1.7, max-width 65ch
- Two CTA buttons below description:
  - "Browse Posts" — mat-flat-button, primary (slate)
  - "Create a Post" — mat-flat-button, accent (amber), right-aligned
- Button group: flex row, gap 12px, justify-content: flex-end

### 3. Post List (posts/post-list.html)

**Current:** White card wrapping list, search field, card-per-post with 3 action buttons each.

**Target:**
- Toolbar within card: search field + "New Post" button, flex row, space-between
- Each post card: white card, 8px radius, 3px left border accent bar (amber-500), 16px padding
- Post title: 1.25rem, weight 600, clickable link (slate-800 → 700 on hover)
- Metadata row below title: material icons + date, 0.875rem, slate-500
- Content preview: 1rem, line-height 1.6, max-height 4.5em, overflow hidden with gradient fade
- Action buttons: icon-only with tooltip or icon+text compact
  - "Read" — stroked-button, primary
  - "Edit" — stroked-button, slate-500
  - "Delete" — stroked-button, warn (red) — **leftmost**, separated with ml-auto
- Paginator at bottom, clean

**Button position rule:**
- Secondary actions left (Edit, Back)
- Primary/constructive actions right (Read, Save, Create, Post)
- Destructive actions leftmost or far right — consistent across all views

### 4. Post Detail (posts/post-detail.html)

**Current:** Two white cards, comment avatars with hash colors, text-based timestamps.

**Target:**
- Post card: same as list but full content visible, 8px radius
- Metadata row: calendar icon + formatted date, update icon + updated date
- Content: 1rem, line-height 1.7, white-space pre-wrap, slate-700
- Action buttons below content:
  - "Delete" — stroked, warn, left
  - "Edit" — stroked, accent, middle
  - "Back to Posts" — stroked, slate-500, rightmost
- Comments card: 8px radius, white
- Comment list: mat-list with consistent spacing
- Comment avatars: 40px circles, same hash-color system but refined palette
- Comment form: textarea + "Post Comment" button (flat, primary, right-aligned)
- Timestamps: relative format ("2 hours ago", "Jan 15") on mobile

### 5. Post Create / Edit (shared post-form.html)

**Current:** White card, two outline fields, buttons left-aligned.

**Target:**
- Card: white, 8px radius
- Icon + title in card header
- Fields: outline appearance, full-width, consistent label styling
- Character count visible on content field (min 10 chars)
- Button row:
  - "Cancel" — stroked, slate-500, left
  - "Create Post" / "Update Post" — flat, primary (slate), right
- Submitting state: button shows amber spinner + "Saving..."
- Error banner: red-50 background, red-700 text, 8px radius, 16px padding

### 6. Shared States

**Loading (replaces current spinner+text):**
- Skeleton cards with mat-skeleton-loader or CSS shimmer animation
- ~3 skeleton placeholders on post list
- 1 skeleton card on post detail
- No text — just shapes that match the layout

**Empty States (add CTAs where missing):**
- Post list empty: icon (48px, 40% opacity), "No posts yet", "Create your first post" CTA button
- Comments empty: icon, "No comments yet. Be the first to share your thoughts!" with quick-scroll-to-form button
- Post not found: icon, "This post doesn't exist or was removed", "Back to Posts" button

**Error States:**
- Error banner: red-50 bg, red-700 text, icon + message, full-width, 8px radius
- Network error: specific message + retry button

## Implementation Plan

### Approach: Custom Material Theme via Sass

Replace `@import '@angular/material/prebuilt-themes/indigo-pink.css'` with a custom `mat.define-light-theme()` using our design tokens. This propagates the new colors through every Material component automatically.

### Files to Create

| File | Purpose |
|---|---|
| `apps/client/src/_theme.scss` | Custom Material theme (colors, typography, shape) |
| `apps/client/src/_tokens.scss` | CSS custom properties for non-Material elements |

### Files to Modify

| File | Changes |
|---|---|
| `apps/client/src/styles.css` | Replace prebuilt import → custom theme, add design tokens, skeleton animations, responsive breakpoints |
| `apps/client/src/app/app.html` | Toolbar color from primary, add active nav indicator |
| `apps/client/src/app/app.css` | Clean up, add shell styles |
| `apps/client/src/app/home/home.html` | Hero redesign with gradient accent bar, new button layout |
| `apps/client/src/app/posts/post-list.html` | Accent bar on cards, refined metadata, loading skeletons, empty CTA |
| `apps/client/src/app/posts/post-list.ts` | Remove dead MatTableModule import |
| `apps/client/src/app/posts/post-detail.html` | Refined layout, relative timestamps, comment avatar sizing |
| `apps/client/src/app/posts/post-detail.ts` | Refined avatar color palette, relative time pipe |
| `apps/client/src/app/posts/post-form.html` | Consistent button placement, character count, error styling |
| `apps/client/src/app/posts/post-create.html` | Cleanup |
| `apps/client/src/app/posts/post-edit.html` | Cleanup |
| `apps/client/angular.json` | Switch build to process Sass (add `stylePreprocessorOptions` if needed) |

## Verification

1. `nx build client` — production build passes with Sass compilation
2. `nx test client` — 3/3 tests still pass
3. Visual smoke test at every route: `/`, `/posts`, `/posts/new`, `/posts/:id`, `/posts/:id/edit`
4. Verify all states: loading, empty, error, populated for each view
5. Responsive: test at 375px, 768px, 1024px+ widths
