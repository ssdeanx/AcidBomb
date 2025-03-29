'use client';

import { Box, Typography, Container, Paper, Divider } from '@repo/ui';
import { useTheme } from '@repo/ui/ThemeProvider';
import { Switch_ as Switch } from '@repo/ui/Switch';
import { Code } from '@repo/ui/Code';

export default function DocumentationPage() {
  const { mode, toggleTheme } = useTheme();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Documentation
          </Typography>
          <Switch
            checked={mode === 'dark'}
            onChange={toggleTheme}
            label="Dark Mode"
          />
        </Box>

        <Typography variant="h5" gutterBottom>
          Getting Started
        </Typography>
        <Code>
          {`# Clone the repository
git clone https://github.com/your-repo/turbo-next.git

# Install dependencies
pnpm install

# Start development server
pnpm dev`}
        </Code>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Project Structure
        </Typography>
        <Code>
          {`apps/
  ├── web/              # Next.js web application
  └── docs/             # Documentation site
packages/
  ├── ui/              # Shared UI components
  ├── config/          # Shared configuration
  └── types/           # Shared TypeScript types`}
        </Code>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Available Scripts
        </Typography>
        <Typography paragraph>
          <Code>pnpm dev</Code> - Start development server
          <br />
          <Code>pnpm build</Code> - Build for production
          <br />
          <Code>pnpm test</Code> - Run tests
          <br />
          <Code>pnpm lint</Code> - Lint code
        </Typography>
      </Paper>
    </Container>
  );
}
