import { dashboard as Dashboard } from '@repo/ui/dashboard';
import { charts as Charts } from '@repo/ui/charts';

// Sample data
const lineData = [
  { name: 'Jan', calls: 4000, latency: 240, value: 4000 },
  { name: 'Feb', calls: 3000, latency: 139, value: 3000 },
  { name: 'Mar', calls: 2000, latency: 980, value: 2000 },
  { name: 'Apr', calls: 2780, latency: 390, value: 2780 },
  { name: 'May', calls: 1890, latency: 490, value: 1890 },
];

const barData = [
  { name: 'Model A', requests: 3200, errors: 120, value: 3200 },
  { name: 'Model B', requests: 1800, errors: 40, value: 1800 },
  { name: 'Model C', requests: 4500, errors: 90, value: 4500 },
  { name: 'Model D', requests: 2300, errors: 30, value: 2300 },
];

// In your page component
<>
  // In your page component
  <Dashboard
    title="AI Analytics"
    user={{
      name: "John Doe",
      role: "Admin"
    }}
    metrics={{
      totalCalls: 15000,
      avgLatency: 245,
      successRate: 99.2,
      totalCost: 1234.56
    }}
    prompts={[ /* prompt metrics */]}
    models={[ /* model metrics */]} />
  // In your component
  <Charts
    type="line"
    data={lineData}
    height={300}
    dataKeys={['calls', 'latency']} />
  // Area chart with custom colors
  <Charts
    type="area"
    data={lineData}
    colors={['#4caf50', '#ff9800']}
    animate={false} />
  // Pie chart
  <Charts
    type="pie"
    data={barData}
    height={400}
    colors={['#4caf50', '#ff9800']}
    animate={false} />
</>
