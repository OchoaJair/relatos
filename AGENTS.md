# Agents Guide for Relatos Project

This document provides guidelines for agentic coding assistants working in this repository.

## Build Commands

```bash
pnpm run dev         # Start development server with Vite HMR
pnpm run build       # Build for production (outputs to dist/)
pnpm run preview     # Preview production build locally
pnpm run lint        # Run ESLint on all files
```

**No test framework is configured.** All changes must be manually tested.

## Tech Stack

- **Framework**: React 19 with Vite
- **Styling**: CSS Modules exclusively
- **Routing**: React Router v7
- **State Management**: Context API with localStorage persistence
- **Language**: JavaScript (no TypeScript)
- **Package Manager**: pnpm (pnpm-lock.yaml present)

## Code Style Guidelines

### File Organization

```
src/
├── components/      # Reusable React components
├── pages/          # Route-level components
├── context/        # Context providers
├── utils/          # Utility functions
├── styles/         # CSS Modules (components/ and pages/)
└── assets/         # Images, icons, static files
```

### Imports

Order: React/third-party → internal (context, components, utils, assets) → styles

```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hls from "hls.js";

import { useData } from "../context/DataContext";
import Button from "../components/Button.jsx";
import { parseSRT } from "../utils/srtParser.js";

import styles from "../styles/components/MyComponent.module.css";
```

Use `.jsx` for React components, `.js` for utilities.

### Component Structure

Functional components with hooks:

```jsx
export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);
  const navigate = useNavigate();

  useEffect(() => {
    // effect logic
    return () => cleanup();
  }, [dependencies]);

  const handleClick = useCallback(() => {
    // handler logic
  }, [dependencies]);

  return <div className={styles.container}>{/* JSX */}</div>;
}
```

### Naming Conventions

- **Components**: PascalCase (`VideoPlayer.jsx`, `StoryPoint.jsx`)
- **Functions/Variables**: camelCase (`handleClick`, `parseSRT`)
- **Constants**: UPPER_SNAKE_CASE (`TWO_PI`)
- **CSS Classes**: kebab-case (`video-container`, `active-segment`)
- **CSS Modules**: ComponentName.module.css

### Styling

Use CSS Modules exclusively. No global CSS for components.

```jsx
import styles from "./MyComponent.module.css";
return <div className={styles.container} style={{ left: `${percent}%` }} />;
```

### State Management

Context API with localStorage initialization:

```jsx
const [data, setData] = useState(() => {
  const saved = localStorage.getItem("data");
  return saved ? JSON.parse(saved) : [];
});

// Always sync to localStorage when persisting
const handleUpdate = (newData) => {
  setData(newData);
  localStorage.setItem("data", JSON.stringify(newData));
};
```

See `src/context/DataContext.jsx` for the pattern.

### Hooks

- `useCallback` for event handlers passed to children
- `useMemo` for expensive computations/derived state
- `useRef` for DOM access and values persisting across renders
- `useEffect` cleanup functions required for subscriptions/listeners

### Error Handling

Try-catch async operations:

```jsx
try {
  const response = await fetch("/data/data.json");
  const data = await response.json();
  setData(data);
} catch (error) {
  console.error(error);
}
```

### Documentation

JSDoc comments for utility functions:

```js
/**
 * Parse SRT subtitle file
 * @param {string} srtText - SRT content
 * @returns {Array} - Array of subtitle objects
 */
export function parseSRT(srtText) {
  // implementation
}
```

### ESLint Rules

- Extends recommended rules + React Hooks rules
- Variables starting with uppercase letters exempt from unused vars
- **All code must pass `npm run lint`**
- No TypeScript types

### Code Quality

- Use meaningful variable/function names
- Avoid console.log (sparingly for debugging only)
- Keep components focused and single-purpose
- Extract complex logic to utility functions

### Assets

Import assets directly:

```jsx
import logo from "../assets/logo.svg";
import backgroundImage from "../assets/background.webp";
```

## Working with This Codebase

### Adding New Components
1. Create component in `src/components/`
2. Create CSS Module in `src/styles/components/`
3. Follow import order above

### Modifying Context
- Context in `src/context/DataContext.jsx`
- Add state with localStorage pattern
- Export named value from provider
- Add setter that updates localStorage

### Adding Pages
1. Create page in `src/pages/`
2. Add route in `src/App.jsx`
3. Create CSS Module in `src/styles/pages/`

## After Making Changes

Always run `pnpm run lint` and fix all errors before committing.
