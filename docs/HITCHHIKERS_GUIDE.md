# The Hitchhiker's Guide to Equation Bench

> Don't panic. Small files, boring names, one job each.

Stack: Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind 4.
The rule behind every rule: **a reader should understand a file without scrolling.**

Rules are tagged **[MUST]** (a checker will flag it) or **[SHOULD]** (a checker will note it).

## 1. Size limits

| Thing | Limit |
| --- | --- |
| File (`.ts`/`.tsx`) | **[MUST]** ≤ 150 lines |
| Component / function body | **[MUST]** ≤ 60 lines · **[SHOULD]** ≤ 40 |
| JSX nesting depth | **[SHOULD]** ≤ 4 levels; extract a component past that |
| Function parameters | **[SHOULD]** ≤ 3; use an options object past that |
| Static data tables (buttons, presets) | **[MUST]** live in their own file, not next to logic |
| `className` strings | **[SHOULD]** ≤ ~100 chars; longer → extract a component or a `cn`-style constant |

## 2. Folder layout (colocation)

Group by feature, not by file type. Route-specific code lives next to its route.

```
app/
  layout.tsx  page.tsx  globals.css      # routing files only, thin
  _components/                           # private folder: not routable
    equation-bench/                      # one folder per feature
      equation-bench.tsx                 # composition root (client)
      toolbar/  editor/  preview/  documents/  latex/  layout/  ui/   # one subfolder per area
      toolbar/toolbar-data.ts            # static data
      documents/use-document-list.ts     # hook
      editor/editor-theme.ts             # CodeMirror config
lib/                                     # pure, framework-free helpers (shared by 2+ features)
```

- **[MUST]** `page.tsx` / `layout.tsx` contain composition and metadata only, no logic.
- **[SHOULD]** Promote code to `lib/` only when a second feature needs it.
- **[SHOULD]** Import shared code with the `@/` alias; siblings with `./`. Never `../../..`.

## 3. Naming

| Thing | Style | Example |
| --- | --- | --- |
| Files and folders | **[MUST]** kebab-case | `math-toolbar.tsx` |
| Next.js special files | **[MUST]** exact convention names | `page.tsx`, `layout.tsx`, `loading.tsx` |
| Components, types | **[MUST]** PascalCase | `MathToolbar`, `MathButton` |
| Functions, variables | **[MUST]** camelCase | `loadSavedSource` |
| Hooks | **[MUST]** `use` prefix, own file | `useDocumentList` |
| Module-level constants | **[SHOULD]** SCREAMING_SNAKE_CASE | `STORAGE_KEY` |
| Booleans | **[SHOULD]** `is/has/can` prefix | `isDirty` |

One exported component per file, named like the file.

## 4. Server and Client Components

- **[MUST]** Server Component is the default. Add `"use client"` only where state, effects, refs or browser APIs are needed.
- **[MUST]** Push `"use client"` down the tree: a page must not be client just because a leaf is.
  (Use `dynamic(..., { ssr: false })` only inside a small client wrapper, never on a whole page by habit.)
- **[SHOULD]** Server-only modules import `"server-only"`.
- **[MUST]** Await `params` / `searchParams` (they are Promises). Use the generated `PageProps<"/route">` / `LayoutProps<"/route">` helpers.
- **[SHOULD]** Fetch independent data with `Promise.all`; wrap slow parts in `<Suspense>`.
- **[SHOULD]** Every route with real content exports `metadata` or `generateMetadata`.

## 5. React 19 style

- **[MUST]** Function components only. Props typed with a named `type`, destructured in the signature.
- **[MUST]** No `useMemo` / `useCallback` / `React.memo` added "just in case". Add one only with a measured reason and a one-line comment.
- **[SHOULD]** Derive values during render instead of syncing them with `useEffect`.
- **[SHOULD]** Extract stateful logic into a custom hook once a component has more than ~2 `useState`s.
- **[MUST]** Lists have stable `key`s (never the array index for reorderable data).

## 6. TypeScript

- **[MUST]** No `any`, no `@ts-ignore`. Use `unknown` and narrow, or `@ts-expect-error` with a reason.
- **[MUST]** `import type { … }` for type-only imports.
- **[SHOULD]** Prefer `type` for props and data; `interface` only when extending.
- **[SHOULD]** Let inference work for locals; annotate exported function returns.
- **[SHOULD]** Static tables use `as const` / `satisfies` so keys stay checked.

## 7. Imports order

Blank line between groups, alphabetical inside each:

1. `react` / `next/*`
2. third-party packages
3. `@/` aliases
4. relative (`./`)
5. side-effect and CSS imports last

## 8. Styling (Tailwind 4)

- **[MUST]** Utility classes in JSX; no inline `style={{}}` unless the value is dynamic.
- **[MUST]** Colors, fonts, spacing come from CSS variables / `@theme` tokens in `globals.css`. No hard-coded hex in components.
- **[SHOULD]** Class order: layout → box → typography → color → state (`hover:`, `dark:`).
- **[SHOULD]** Repeated class clusters become a component, not a copy-paste.

## 9. Comments and errors

- **[SHOULD]** Comment *why*, never *what*. No commented-out code.
- **[SHOULD]** A file that needs a header comment is probably too big.
- **[MUST]** Never swallow errors silently: an empty `catch {}` needs a comment saying why it is safe.
- **[SHOULD]** Early returns over nested `if`/`else`.

## 10. Before you commit

`npm run lint` and `npx tsc --noEmit` pass · no file over 150 lines · new files follow section 2.

---

### Where this comes from

Next.js 16 docs bundled in `node_modules/next/dist/docs/` (project structure, server/client components), plus 2026 community consensus:
[Next.js App Router Best Practices in 2026](https://dev.to/thekitbase/nextjs-app-router-best-practices-in-2026-2b0f),
[Next.js Folder Structure 2026](https://www.groovyweb.co/blog/nextjs-project-structure-full-stack),
[React Folder Structure 2026 (Robin Wieruch)](https://www.robinwieruch.de/react-folder-structure/),
[File Naming Best Practices](https://shipixen.com/blog/nextjs-file-naming-best-practices).
Size limits, ordering and the React 19 rules are this project's own choices.
