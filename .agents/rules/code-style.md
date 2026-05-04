---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---
# Code Style

## Naming
- Component files: PascalCase or kebab-case (match the convention of the package)
- Utility files: kebab-case
- Custom hooks: camelCase with `use` prefix
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase
- Backend handlers/controllers: camelCase

## Imports
- Use path aliases within packages — never `../../` across module boundaries
- Within a package: use the package's configured path alias
- Group: external libs → package-local → module-local

## TypeScript (strictly enforced on all layers)
- `tsconfig.json` must have `"strict": true` and `"noImplicitAny": true`
- No `any` — use `unknown` + type guards, or define the type explicitly
- No `@ts-ignore` without a `// reason:` comment on the same line
- No `@ts-expect-error` without a comment explaining why it is expected
- No `as T` type assertions as a substitute for proper typing
- Explicit return types on all exported functions
- Hooks return typed data — never `unknown` or `any` in hook signatures
- Service functions return `Promise<T>` — never `Promise<any>`

## React
- Functional components only
- Custom hooks for all stateful logic
- No inline event handlers longer than one line
- Components typed with `React.FC<Props>` or explicit inline prop types

## UI Components
- Always use antd component library
- No inline styles or one-off components

## Styling
- All styling via antd components or CSS modules
- No `style={{}}` inline props
- No hardcoded color values — always use design tokens / CSS variables

## Banned patterns
- No direct HTTP client calls in components — use the service layer
- No `localStorage` access outside the designated utility
- No hardcoded URL strings — use config constants
- No hardcoded colors or inline styles
- No `console.log` in committed code
- No `// @ts-ignore` without reason comment
- No business logic in route handlers or page components
- No cross-module imports — modules never import from each other directly
