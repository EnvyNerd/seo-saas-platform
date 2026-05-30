# UI Components Quick Start Guide

## Installation & Setup

The new UI components are already installed! Just make sure your app is wrapped with the theme provider.

### Verify App.jsx Has ThemeProvider
```jsx
import AppRouter from "./router/AppRouter";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
```

### Add ToastContainer to Your Root Layout
```jsx
import { ToastContainer } from './components/ui';

export function RootLayout({ children }) {
  return (
    <>
      <ToastContainer />
      {children}
    </>
  );
}
```

## Common Patterns

### 1. Form with Validation
```jsx
import { Input, Select, Button, Alert } from './components/ui';
import { useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate and submit
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
      />

      <Button variant="primary" fullWidth type="submit">
        Login
      </Button>
    </form>
  );
}
```

### 2. Data Table with Actions
```jsx
import { Card, Button, Badge, Dropdown, showToast } from './components/ui';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';

export function DataTable({ data }) {
  const handleDelete = (id) => {
    // Delete logic
    showToast('Item deleted successfully', 'success');
  };

  return (
    <Card className="p-6">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-light">
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Status</th>
            <th className="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-border-light hover:bg-surface-secondary">
              <td className="py-3">{item.name}</td>
              <td className="py-3">
                <Badge variant={item.status === 'active' ? 'success' : 'warning'}>
                  {item.status}
                </Badge>
              </td>
              <td className="py-3">
                <Dropdown
                  trigger={<MoreVertical size={20} />}
                  items={[
                    { label: 'Edit', icon: Edit },
                    { label: 'Delete', icon: Trash2, onClick: () => handleDelete(item.id) },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
```

### 3. Modal Confirmation
```jsx
import { Modal, Button, Alert } from './components/ui';
import { useState } from 'react';

export function DeleteConfirmation({ itemName }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    // Delete logic
    setIsOpen(false);
    showToast('Deleted successfully', 'success');
  };

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Delete
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Deletion"
        footerActions={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirm}>
              Delete
            </Button>
          </>
        }
      >
        <Alert variant="warning" title="Warning">
          Are you sure you want to delete "{itemName}"? This action cannot be undone.
        </Alert>
      </Modal>
    </>
  );
}
```

### 4. Statistics Dashboard
```jsx
import { Card, MetricCard, Progress, Badge } from './components/ui';
import { TrendingUp, Users, Activity, Zap } from 'lucide-react';

export function StatsDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Total Users"
        value="12,345"
        change="+2.5%"
        icon={Users}
        trend="up"
      />
      <MetricCard
        label="Active Sessions"
        value="2,341"
        change="-1.2%"
        icon={Activity}
        trend="down"
      />
      <MetricCard
        label="Performance"
        value="98.5%"
        change="+0.8%"
        icon={TrendingUp}
        trend="up"
      />
      <MetricCard
        label="API Calls"
        value="48.3K"
        change="+5.2%"
        icon={Zap}
        trend="up"
      />
    </div>
  );
}
```

### 5. Notification Center
```jsx
import { Alert, Card, Badge } from './components/ui';
import { Trash2 } from 'lucide-react';

export function NotificationCenter({ notifications }) {
  const [items, setItems] = useState(notifications);

  const handleDismiss = (id) => {
    setItems(items.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-3">
      {items.map((notification) => (
        <Alert
          key={notification.id}
          variant={notification.type}
          title={notification.title}
          onClose={() => handleDismiss(notification.id)}
        >
          {notification.message}
        </Alert>
      ))}
    </div>
  );
}
```

### 6. Settings Panel with Tabs
```jsx
import { Card, Tabs, Input, Button, Toggle } from './components/ui';
import { Settings, Bell, Lock } from 'lucide-react';

export function SettingsPanel() {
  const tabs = [
    {
      label: 'General',
      icon: Settings,
      content: (
        <div className="space-y-4">
          <Input label="Display Name" />
          <Input label="Email" type="email" />
          <Button variant="primary">Save</Button>
        </div>
      ),
    },
    {
      label: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-4">
          <label>
            <input type="checkbox" /> Email notifications
          </label>
          <label>
            <input type="checkbox" /> Push notifications
          </label>
          <Button variant="primary">Save</Button>
        </div>
      ),
    },
    {
      label: 'Security',
      icon: Lock,
      content: (
        <div className="space-y-4">
          <Input label="Current Password" type="password" />
          <Input label="New Password" type="password" />
          <Button variant="primary">Update Password</Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <Tabs tabs={tabs} />
    </Card>
  );
}
```

### 7. Loading & Progress States
```jsx
import { Button, Progress, CircularProgress, Card } from './components/ui';
import { useState } from 'react';

export function ProgressExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStart = () => {
    setIsLoading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <Card className="p-6 space-y-6">
      <Progress value={progress} max={100} showLabel />
      <CircularProgress value={progress} max={100} showLabel />
      <Button
        loading={isLoading}
        onClick={handleStart}
      >
        Start Process
      </Button>
    </Card>
  );
}
```

## Dark Mode Usage

The dark mode is **automatically enabled** when users click the theme toggle in the header. No additional setup needed!

```jsx
import { useTheme } from './context/ThemeContext';

export function ThemeAware() {
  const { theme } = useTheme();
  
  return (
    <div className="p-4">
      Current theme: {theme}
    </div>
  );
}
```

## Styling Tips

### Use Semantic Color Classes
```jsx
// ✅ Good - Semantic and theme-aware
<div className="bg-surface-primary text-text-primary">
  Content
</div>

// ❌ Avoid - Hardcoded colors
<div className="bg-white text-black">
  Content
</div>
```

### Combine with Tailwind
```jsx
import { Button } from './components/ui';

// Add custom padding/margin
<Button className="px-8 py-4 mt-4">
  Click me
</Button>

// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>
```

### Dark Mode Specific Styles
```jsx
// Use dark: prefix for dark mode specific styles
<div className="bg-white dark:bg-slate-800">
  Automatically switches in dark mode
</div>
```

## Migration Checklist

- [ ] Wrap App with ThemeProvider
- [ ] Add ToastContainer to app root
- [ ] Replace old Header with new one (already done)
- [ ] Update Card components to use new variants
- [ ] Replace old Button components with new Button
- [ ] Use Input instead of plain `<input>` tags
- [ ] Test dark mode toggle
- [ ] Test all components in both themes
- [ ] Update forms with validation UI
- [ ] Add toast notifications for user feedback

## Performance Optimization

### Code Splitting
```jsx
import { lazy, Suspense } from 'react';
import { Card } from './components/ui';

const Modal = lazy(() => import('./components/ui/Modal'));

export function Page() {
  return (
    <Suspense fallback={<Card>Loading...</Card>}>
      <Modal />
    </Suspense>
  );
}
```

### Memoization
```jsx
import { memo } from 'react';
import { Card } from './components/ui';

const UserCard = memo(({ user }) => (
  <Card className="p-4">
    <h3>{user.name}</h3>
    <p>{user.email}</p>
  </Card>
));

export default UserCard;
```

---

**🎉 You're all set! Start using the new components to build a beautiful interface.**
