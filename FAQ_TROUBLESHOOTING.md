# FAQ & Troubleshooting Guide

## Frequently Asked Questions

### Q1: How do I enable dark mode?
**A:** Dark mode is built-in and automatic! Click the moon/sun icon in the top header to toggle between light and dark modes. Your preference is saved automatically.

### Q2: Do I need to install any new packages?
**A:** No! All dependencies were already in your `package.json`. The new components use:
- React 19.1.0 (already installed)
- Tailwind CSS 3.4.19 (already installed)
- Lucide React 0.511.0 (already installed)
- clsx 2.1.1 (already installed)

### Q3: How do I use the new components in my pages?
**A:** Import them from `./components/ui`:

```jsx
import { Button, Card, Input, Badge } from './components/ui';
```

### Q4: Will the new components work with my existing code?
**A:** Yes! The new components are backward compatible and can coexist with old code. Migrate gradually.

### Q5: How do I add custom styling to components?
**A:** All components accept a `className` prop for additional Tailwind classes:

```jsx
<Button className="px-8 py-4 shadow-lg">Custom Button</Button>
<Card className="border-2 border-blue-500">Custom Card</Card>
```

### Q6: Can I use the components without Tailwind?
**A:** The components are built with Tailwind CSS and require it. Tailwind is already in your project.

### Q7: How do I customize colors?
**A:** Edit the CSS variables in `frontend/src/styles/globals.css`:

```css
:root {
  --slb-navy: #001f3f;
  --slb-accent: #00b4d8;
  /* ... more colors ... */
}
```

### Q8: How do I add new component variants?
**A:** Edit the component file and add to the variants object:

```jsx
const variants = {
  primary: 'bg-slb-navy text-white',
  // Add your new variant here:
  custom: 'bg-purple-500 text-white',
};
```

### Q9: Do the components support TypeScript?
**A:** The components are JavaScript but fully compatible with TypeScript. Add type comments if needed:

```tsx
/** @type {import('react').ReactNode} */
const MyComponent = ({ children }) => {
  return <div>{children}</div>;
};
```

### Q10: How do I make components responsive?
**A:** Use Tailwind's responsive prefixes:

```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  <Card className="text-sm md:text-base lg:text-lg">
    Responsive content
  </Card>
</div>
```

---

## Troubleshooting

### Problem: Dark mode toggle not appearing in header
**Solution:**
1. Make sure App.jsx is wrapped with `<ThemeProvider>`
2. Make sure the Header component is properly rendering
3. Check console for errors
4. Try clearing browser cache

### Problem: Dark mode colors look wrong
**Solution:**
1. Check that globals.css dark mode section wasn't overridden
2. Verify Tailwind config has `darkMode: 'class'`
3. Make sure browser supports CSS variables
4. Clear browser cache and rebuild

### Problem: Components not styled properly
**Solution:**
1. Verify Tailwind CSS is loading (check in DevTools)
2. Make sure `index.css` imports `globals.css`
3. Check that `tailwind.config.js` includes all component paths
4. Rebuild the project: `npm run build`

### Problem: Button/Input not responding to clicks
**Solution:**
1. Check that onClick handler is properly passed
2. Make sure component isn't disabled
3. Verify event handler is being called
4. Check browser console for errors

### Problem: Modal appears behind other content
**Solution:**
The Modal has `z-50` by default. If still behind:
1. Check parent containers' z-index
2. Remove `relative` positioning from parents if not needed
3. Manually adjust Modal z-index if needed

### Problem: Toast notifications not showing
**Solution:**
1. Make sure `<ToastContainer />` is in your app root
2. Import from correct path: `from './components/ui'`
3. Call `showToast()` after imports are loaded
4. Check browser console for errors

### Problem: Dropdown menu appears in wrong position
**Solution:**
1. The dropdown uses absolute positioning
2. Make sure parent has `position: relative` or use a wrapper div
3. Check if parent has `overflow: hidden`
4. Use `placement` prop: `placement="top"`

### Problem: Input validation icons not showing
**Solution:**
1. Pass either `error={true}` or `success={true}`
2. Make sure you're importing from `'./components/ui'`
3. Icons require the `helperText` prop to align properly
4. Check that theme is applying correctly

### Problem: Components don't appear responsive
**Solution:**
1. Use Tailwind responsive prefixes: `md:`, `lg:`, `xl:`
2. Don't use hardcoded pixel sizes
3. Test in actual responsive sizes, not just DevTools
4. Make sure viewport meta tag exists in HTML

### Problem: Animations feel too slow/fast
**Solution:**
1. Check CSS variables for `--transition-fast`, `--transition-base`, `--transition-slow`
2. Modify in globals.css:
   ```css
   --transition-fast: 100ms cubic-bezier(0.4, 0, 0.2, 1);
   --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
   ```
3. Some animations can be disabled in `prefers-reduced-motion`

### Problem: Dark mode flashes on page load
**Solution:**
1. Move theme initialization earlier in the app
2. Add this to your main.jsx before React mount:
   ```js
   const theme = localStorage.getItem('app-theme') || 'light';
   if (theme === 'dark') {
     document.documentElement.classList.add('dark');
   }
   ```

---

## Performance Tips

### 1. Use React.memo for frequently rendered components
```jsx
const MyCard = React.memo(({ data }) => (
  <Card>{data}</Card>
));
```

### 2. Lazy load heavy components
```jsx
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Card>Loading...</Card>}>
  <HeavyComponent />
</Suspense>
```

### 3. Use useCallback for event handlers
```jsx
const handleClick = useCallback(() => {
  // Your logic
}, [dependencies]);

<Button onClick={handleClick}>Click</Button>
```

### 4. Minimize re-renders
```jsx
// Good - only re-renders when items change
{items.map((item) => (
  <Card key={item.id}>{item.name}</Card>
))}

// Bad - re-creates component on every render
{items.map((item) => (
  <Card key={Math.random()}>{item.name}</Card>
))}
```

### 5. Use CSS classes instead of inline styles
```jsx
// Good - static styling
<Button className="px-4 py-2">Click</Button>

// Less optimal - new style object each render
<Button style={{ padding: '8px 16px' }}>Click</Button>
```

---

## Best Practices

### 1. Always provide unique keys in lists
```jsx
{items.map((item) => (
  <Card key={item.id}>...</Card>
))}
```

### 2. Use semantic color classes
```jsx
// Good - theme-aware
<div className="bg-surface-primary text-text-primary">

// Less good - hardcoded
<div className="bg-white text-black">
```

### 3. Keep components small and focused
```jsx
// Good - single responsibility
<UserCard user={user} />

// Less good - too many concerns
<FullPageComponent />
```

### 4. Use composition over inheritance
```jsx
// Good - compose components
<Card>
  <Badge>New</Badge>
  <h3>Title</h3>
</Card>

// Less good - try to add everything to one component
<Card showBadge badgeText="New" title="Title" />
```

### 5. Document complex components
```jsx
/**
 * MyComponent
 * 
 * @param {string} title - The component title
 * @param {ReactNode} children - Content to render
 * @param {function} onClose - Called when component closes
 */
export function MyComponent({ title, children, onClose }) {
  // implementation
}
```

---

## Common Patterns

### Loading State with Button
```jsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await api.submit(data);
    showToast('Saved!', 'success');
  } catch {
    showToast('Error!', 'error');
  } finally {
    setIsLoading(false);
  }
};

<Button loading={isLoading} onClick={handleSubmit}>
  Submit
</Button>
```

### Form with Validation
```jsx
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const handleChange = (e) => {
  setEmail(e.target.value);
  setEmailError('');
};

const handleBlur = () => {
  if (!isValidEmail(email)) {
    setEmailError('Invalid email');
  }
};

<Input
  label="Email"
  value={email}
  onChange={handleChange}
  onBlur={handleBlur}
  error={!!emailError}
  helperText={emailError}
/>
```

### Modal Confirmation
```jsx
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Delete Item?"
  footerActions={
    <>
      <Button onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="danger" onClick={confirmDelete}>
        Delete
      </Button>
    </>
  }
>
  <Alert variant="warning">
    This cannot be undone.
  </Alert>
</Modal>
```

### Dropdown Menu
```jsx
<Dropdown
  trigger={<Menu size={20} />}
  items={[
    {
      label: 'Profile',
      icon: User,
      onClick: () => navigate('/profile'),
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => navigate('/settings'),
    },
    {
      label: 'Logout',
      icon: LogOut,
      onClick: handleLogout,
    },
  ]}
/>
```

---

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full Support |
| Firefox | 88+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| Edge    | 90+     | ✅ Full Support |
| Opera   | 76+     | ✅ Full Support |
| IE 11   | Any     | ❌ Not Supported |

---

## Getting Help

### Check Documentation
1. **COMPONENT_DOCUMENTATION.md** - Detailed API docs
2. **QUICK_START.md** - Common patterns
3. **COMPONENT_GALLERY.md** - Visual examples
4. **This file** - FAQ & troubleshooting

### Debug Steps
1. Check browser console for errors
2. Verify all imports are correct
3. Check component props match documentation
4. Test with simplified example first
5. Check if issue exists in light AND dark mode

### Common Error Messages

**"useTheme must be used within ThemeProvider"**
- Solution: Make sure App is wrapped with `<ThemeProvider>`

**"Component is not a function"**
- Solution: Check import path and make sure component exists

**"Module not found"**
- Solution: Verify correct import path with proper case sensitivity

---

## Version Information

- React: 19.1.0+
- Tailwind CSS: 3.4.19+
- Lucide React: 0.511.0+
- clsx: 2.1.1+

---

**Still having issues? Check the files in your components/ui folder and compare with the documentation!**
