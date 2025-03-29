'use client';

import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { AppBar } from '@repo/ui/Appbar';
import { Sidebar } from '@repo/ui/Sidebar';
import { Dashboard } from '@repo/ui/Dashboard';
import { Charts } from '@repo/ui/Charts';

// Sample data for charts
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

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handle navigation
  const handleNavigation = (path: string) => {
    console.log(`Navigating to: ${path}`);
    // In a real app, you would use Next.js navigation here
    // router.push(path);
  };

  // Handle sidebar collapse toggle
  const handleSidebarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* AppBar */}
        <AppBar
          title="AI Analytics Platform"
          onNavigate={handleNavigation}
          onProfileAction={(action) => console.log(`Profile action: ${action}`)}
        />

        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={handleSidebarCollapse}
          onItemSelect={handleNavigation}
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            overflow: 'auto',
            ml: sidebarCollapsed ? '64px' : '240px',
            transition: (theme) => theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          {/* Dashboard Component */}
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
          />

          {/* Charts Section */}
          <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
              {/* You might want to add a Typography component here for the title */}
              <Charts
                type="line"
                data={lineData}
                height={300}
                dataKeys={['calls', 'latency']}
              />
            </Box>

            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
              {/* You might want to add a Typography component here for the title */}
              <Charts
                type="area"
                data={lineData}
                height={300}
                colors={['#4caf50', '#ff9800']}
                animate={false}
              />
            </Box>

            <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1, gridColumn: { xs: '1', md: 'span 2' } }}>
              {/* You might want to add a Typography component here for the title */}
              <Charts
                type="pie"
                data={barData}
                height={400}
                colors={['#4caf50', '#ff9800', '#2196f3', '#f44336']}
                animate={false}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
