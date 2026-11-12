# Theme (Light/Dark Mode) Guide

## How It Works

The theme system uses CSS custom properties (variables) that automatically change based on the `[data-theme]` attribute on the HTML element.

### Theme Toggle Button
- Located in the **sidebar footer** (☀️=Light mode, 🌙=Dark mode)
- Click to toggle between light and dark themes
- Your preference is saved in `localStorage` and persists across sessions

## Color Palette

### Light Theme
```
Background Colors:
- Primary:    #ffffff (White)
- Secondary:  #f5f7fa (Light Gray)
- Tertiary:   #e9ecef (Medium Gray)

Text Colors:
- Primary:    #1a1a1a (Dark text)
- Secondary:  #666666 (Medium gray text)
- Muted:      #999999 (Light gray text)

UI Elements:
- Sidebar:    Light gradient background
- Input:      #f0f0f0
- Border:     #d1d5db
```

### Dark Theme
```
Background Colors:
- Primary:    #0f0f0f (Very dark)
- Secondary:  #1a1a1a (Dark)
- Tertiary:   #2d2d2d (Medium dark)

Text Colors:
- Primary:    #ffffff (White text)
- Secondary:  #b0b0b0 (Light gray text)
- Muted:      #808080 (Medium gray text)

UI Elements:
- Sidebar:    Dark gradient background (original design)
- Input:      #2a2a2a
- Border:     #333333
```

### Accent Colors (Same in both themes)
- Green:   #00f5a0
- Cyan:    #00c3e3
- Purple:  #7c3aed
- Amber:   #fbbf24

## Components Using Theme

All components automatically update with the theme:
- ✅ Sidebar Navigation
- ✅ Page Background
- ✅ Text Colors
- ✅ Input Fields
- ✅ Buttons
- ✅ Cards and Containers
- ✅ Borders and Dividers
- ✅ Code Blocks

## CSS Variables Available

Use these variables in your component styles:

```css
/* Backgrounds */
var(--bg-primary)
var(--bg-secondary)
var(--bg-tertiary)
var(--sidebar-bg)
var(--card-bg)
var(--input-bg)
var(--code-bg)

/* Text Colors */
var(--text-primary)
var(--text-secondary)
var(--text-muted)

/* Borders and UI */
var(--border)
var(--shadow)
var(--input-border)

/* Accents */
var(--accent-green)
var(--accent-cyan)

/* Others */
var(--radius-sm)
var(--radius-md)
var(--radius-lg)
```

## Using Theme in Components

### Example: Styled Component with Theme Support

```jsx
import { useTheme } from '../context/ThemeContext'

export default function MyComponent() {
  const { theme } = useTheme()

  return (
    <div style={{
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
      padding: '1rem',
      borderRadius: 'var(--radius-sm)',
      transition: 'all 0.3s ease'
    }}>
      Current theme: {theme}
    </div>
  )
}
```

### Example: CSS File with Theme Variables

```css
.my-card {
  background: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px var(--shadow);
  padding: 1rem;
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.my-card:hover {
  border-color: var(--accent-cyan);
  box-shadow: 0 4px 12px var(--shadow);
}
```

## Tips for Adding New Components

1. **Always use CSS variables** instead of hardcoded colors
2. Add `transition: all 0.3s ease` for smooth theme switching
3. Test both light and dark modes when adding styles
4. Use `var(--text-primary)` for main text, `var(--text-secondary)` for labels/muted text

## Example: Complete Styled Button

```jsx
<button style={{
  background: 'var(--input-bg)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border)',
  padding: '10px 16px',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontSize: '0.9rem',
  fontWeight: '500'
}} onMouseEnter={(e) => {
  e.target.style.borderColor = 'var(--accent-cyan)'
  e.target.style.background = 'var(--bg-tertiary)'
}}>
  Click me
</button>
```

## Browser Support

Theme system works in all modern browsers:
- Chrome/Edge 49+
- Firefox 31+
- Safari 9.1+
- Opera 36+
