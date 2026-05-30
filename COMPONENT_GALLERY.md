# Component Gallery & Preview

## Button Component

### Variants
```jsx
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="danger">Danger Button</Button>
<Button variant="success">Success Button</Button>
```

### Sizes
```jsx
<Button size="sm">Small Button</Button>
<Button size="md">Medium Button</Button>
<Button size="lg">Large Button</Button>
```

### States
```jsx
<Button loading>Loading Button</Button>
<Button disabled>Disabled Button</Button>
<Button fullWidth>Full Width Button</Button>
```

### With Icons
```jsx
import { Plus, Save, Trash2 } from 'lucide-react';

<Button startIcon={Plus}>Create</Button>
<Button endIcon={Save}>Save</Button>
<Button variant="danger" startIcon={Trash2}>Delete</Button>
```

---

## Input Component

### Basic
```jsx
<Input label="Email" type="email" placeholder="user@example.com" />
<Input label="Password" type="password" />
```

### With Validation
```jsx
<Input 
  label="Email"
  error={true}
  helperText="Please enter a valid email"
/>

<Input 
  label="Username"
  success={true}
  helperText="Username available ✓"
/>
```

### With Icons
```jsx
import { Mail, Lock, Search } from 'lucide-react';

<Input label="Email" startIcon={Mail} />
<Input label="Password" startIcon={Lock} type="password" />
<Input placeholder="Search..." startIcon={Search} />
```

### Disabled
```jsx
<Input label="Disabled Field" disabled value="Cannot edit" />
```

---

## Select Component

### Basic
```jsx
<Select 
  label="Choose Option"
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ]}
/>
```

### With Disabled Options
```jsx
<Select 
  options={[
    { value: '1', label: 'Available' },
    { value: '2', label: 'Disabled', disabled: true },
    { value: '3', label: 'Available' },
  ]}
/>
```

### With Validation
```jsx
<Select 
  label="Select Country"
  error={true}
  helperText="Please select a country"
  options={countryOptions}
/>
```

---

## Card Component

### Default Variant
```jsx
<Card className="p-6">
  <h3 className="text-lg font-bold">Default Card</h3>
  <p>Standard card with subtle shadow</p>
</Card>
```

### Elevated Variant
```jsx
<Card variant="elevated" className="p-6">
  <h3>Elevated Card</h3>
  <p>With stronger shadow for prominence</p>
</Card>
```

### Flat Variant
```jsx
<Card variant="flat" className="p-6">
  <h3>Flat Card</h3>
  <p>No border, just background color</p>
</Card>
```

### Outline Variant
```jsx
<Card variant="outline" className="p-6">
  <h3>Outline Card</h3>
  <p>Prominent border, subtle background</p>
</Card>
```

### With Click Handler
```jsx
<Card 
  hover={true} 
  onClick={() => navigate('/details')}
  className="p-6 cursor-pointer"
>
  Clickable card with hover effect
</Card>
```

---

## Badge Component

### Variants
```jsx
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="neutral">Neutral</Badge>
<Badge variant="primary">Primary</Badge>
```

### Sizes
```jsx
<Badge size="sm">Small Badge</Badge>
<Badge size="md">Medium Badge</Badge>
<Badge size="lg">Large Badge</Badge>
```

### With Icons
```jsx
import { CheckCircle, AlertCircle, Zap } from 'lucide-react';

<Badge variant="success" icon={CheckCircle}>Verified</Badge>
<Badge variant="warning" icon={AlertCircle}>Warning</Badge>
<Badge variant="info" icon={Zap}>Active</Badge>
```

---

## Alert Component

### Success Alert
```jsx
<Alert variant="success" title="Success!">
  Your changes have been saved successfully.
</Alert>
```

### Error Alert
```jsx
<Alert variant="error" title="Error">
  Something went wrong. Please try again.
</Alert>
```

### Warning Alert
```jsx
<Alert variant="warning" title="Warning">
  This action cannot be undone.
</Alert>
```

### Info Alert
```jsx
<Alert variant="info" title="Info">
  Here's some helpful information for you.
</Alert>
```

### Dismissible Alert
```jsx
<Alert 
  variant="success" 
  onClose={() => console.log('dismissed')}
>
  This alert can be dismissed.
</Alert>
```

---

## Modal Component

### Basic Modal
```jsx
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}
```

### Modal with Actions
```jsx
<Modal
  isOpen={isOpen}
  onClose={closeModal}
  title="Confirm Action"
  footerActions={
    <>
      <Button variant="secondary" onClick={closeModal}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

### Modal Sizes
```jsx
<Modal size="sm">Small Modal</Modal>
<Modal size="md">Medium Modal</Modal>
<Modal size="lg">Large Modal</Modal>
<Modal size="xl">Extra Large Modal</Modal>
<Modal size="full">Full Screen Modal</Modal>
```

---

## Tabs Component

### Basic Tabs
```jsx
import { BarChart3, Settings, User } from 'lucide-react';

const tabs = [
  {
    label: 'Overview',
    icon: BarChart3,
    content: <OverviewPanel />,
  },
  {
    label: 'Settings',
    icon: Settings,
    content: <SettingsPanel />,
  },
  {
    label: 'Profile',
    icon: User,
    content: <ProfilePanel />,
  },
];

<Tabs 
  tabs={tabs} 
  onChange={(index) => console.log(index)}
/>
```

---

## Tooltip Component

### Tooltip Positions
```jsx
<Tooltip content="Helpful info" position="top">
  <button>Top Tooltip</button>
</Tooltip>

<Tooltip content="Helpful info" position="right">
  <button>Right Tooltip</button>
</Tooltip>

<Tooltip content="Helpful info" position="bottom">
  <button>Bottom Tooltip</button>
</Tooltip>

<Tooltip content="Helpful info" position="left">
  <button>Left Tooltip</button>
</Tooltip>
```

### With Delay
```jsx
<Tooltip content="Wait for this" delay={500}>
  <button>Delayed Tooltip</button>
</Tooltip>
```

---

## Dropdown Component

### Basic Dropdown
```jsx
import { MoreVertical, Edit, Trash2, Share2 } from 'lucide-react';

<Dropdown
  trigger={<MoreVertical size={20} />}
  items={[
    { label: 'Edit', icon: Edit },
    { label: 'Share', icon: Share2 },
    { label: 'Delete', icon: Trash2 },
  ]}
/>
```

### With Divider
```jsx
<Dropdown
  trigger={<Button>Menu</Button>}
  items={[
    { label: 'Option 1' },
    { label: 'Option 2' },
    { label: 'Divider', divider: true },
    { label: 'Logout', icon: LogOut },
  ]}
/>
```

### With Callbacks
```jsx
<Dropdown
  trigger="Actions"
  items={[
    { label: 'Save', onClick: handleSave },
    { label: 'Delete', onClick: handleDelete },
    { label: 'Disabled', disabled: true },
  ]}
/>
```

---

## Progress Component

### Linear Progress
```jsx
<Progress value={30} max={100} showLabel />
<Progress value={65} max={100} variant="success" showLabel />
<Progress value={45} max={100} variant="warning" showLabel />
<Progress value={20} max={100} variant="error" showLabel />
```

### Circular Progress
```jsx
<CircularProgress value={40} max={100} size={80} showLabel />
<CircularProgress value={75} max={100} size={100} variant="success" showLabel />
<CircularProgress value={30} max={100} size={120} variant="warning" showLabel />
```

---

## Toast Notifications

### Show Toast
```jsx
import { showToast } from './components/ui';

showToast('Changes saved!', 'success');
showToast('Something went wrong', 'error');
showToast('Please be careful', 'warning');
showToast('Here\'s some info', 'info');
```

### Custom Duration
```jsx
showToast('Quick message', 'info', 1500);
showToast('Long message', 'success', 5000);
showToast('Stays forever', 'warning', 0); // Requires manual close
```

### Add ToastContainer
```jsx
// In your app root component
import { ToastContainer } from './components/ui';

function App() {
  return (
    <>
      <ToastContainer />
      {/* Your app content */}
    </>
  );
}
```

---

## Color Palette

### Light Mode
- **Primary**: Navy (#001f3f)
- **Accent**: Cyan (#00b4d8)
- **Success**: Green (#28a745)
- **Warning**: Yellow (#ffc107)
- **Error**: Red (#dc3545)
- **Info**: Teal (#17a2b8)
- **Backgrounds**: White, Light Gray, Medium Gray

### Dark Mode
- **Primary**: Bright Blue (#4a8cff)
- **Accent**: Bright Cyan (#1dd9ff)
- **Backgrounds**: Navy Dark, Navy Darker, Navy Darkest
- **Text**: Light Gray, Medium Gray, Dark Gray

---

## Typography

### Headings
```jsx
<h1 className="text-4xl font-bold">Heading 1</h1>
<h2 className="text-3xl font-bold">Heading 2</h2>
<h3 className="text-2xl font-bold">Heading 3</h3>
<h4 className="text-xl font-bold">Heading 4</h4>
<h5 className="text-lg font-bold">Heading 5</h5>
<h6 className="text-base font-bold">Heading 6</h6>
```

### Text Sizes
```jsx
<p className="text-xs">Extra Small</p>
<p className="text-sm">Small</p>
<p className="text-base">Base</p>
<p className="text-lg">Large</p>
<p className="text-xl">Extra Large</p>
```

---

## Spacing Examples

```jsx
// Using Tailwind spacing with semantic sizing
<div className="p-4">    {/* 16px padding */}
  <div className="mb-6">   {/* 24px margin bottom */}
    <div className="gap-3"> {/* 12px gap */}
    </div>
  </div>
</div>
```

---

## Complete Dashboard Example

```jsx
import {
  Card,
  Button,
  Badge,
  Alert,
  MetricCard,
  Progress,
  Tabs,
} from './components/ui';
import { Users, TrendingUp, Activity, Zap } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-text-secondary">Welcome back!</p>
      </div>

      {/* Alerts */}
      <Alert variant="info" title="Tip">
        Check your settings to optimize your experience.
      </Alert>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Users"
          value="12,345"
          change="+2.5%"
          icon={Users}
          trend="up"
        />
        <MetricCard
          label="Performance"
          value="98.5%"
          change="+0.8%"
          icon={TrendingUp}
          trend="up"
        />
        <MetricCard
          label="Active"
          value="2,341"
          change="-1.2%"
          icon={Activity}
          trend="down"
        />
        <MetricCard
          label="API Calls"
          value="48.3K"
          change="+5.2%"
          icon={Zap}
          trend="up"
        />
      </div>

      {/* Content Card */}
      <Card variant="elevated" className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Performance</h2>
          <Badge variant="success">Active</Badge>
        </div>
        <Progress value={75} max={100} showLabel />
      </Card>

      {/* Tabbed Content */}
      <Tabs
        tabs={[
          {
            label: 'Overview',
            content: <div className="p-4">Overview content</div>,
          },
          {
            label: 'Details',
            content: <div className="p-4">Details content</div>,
          },
        ]}
      />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="primary">Save Changes</Button>
        <Button variant="secondary">Cancel</Button>
      </div>
    </div>
  );
}
```

---

**That's the complete component gallery! Mix and match these components to build beautiful interfaces. 🎨**
