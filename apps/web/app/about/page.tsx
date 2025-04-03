import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Container,
  Box,
  Stack,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import {
  RocketLaunch,
  DataObject,
  Storage,
  Memory,
  Build,
  Security,
  Speed,
  Code,
  Hub,
  PrecisionManufacturing,
  GitHub,
  LinkedIn
} from '@mui/icons-material';
import { Button } from '@repo/ui/Button';

/**
 * Generate SEO metadata for the about page
 * @returns Metadata object with title and description
 */
export function generateMetadata(): Metadata {
  return {
    title: 'About | DeanMachines AI',
    description: 'Learn about DeanMachines AI platform, our mission, technology stack, and team behind building advanced conversational AI solutions.',
  };
}

/**
 * Tech stack item interface
 */
interface TechStackItem {
  name: string;
  icon: React.ReactNode;
}

/**
 * About page component displaying mission, tech stack, team info, and contact links
 */
export default function AboutPage() {
  // Tech stack configuration
  const techStack: TechStackItem[] = [
    { name: 'Next.js', icon: <Speed sx={{ fontSize: 36, color: 'primary.light' }} /> },
    { name: 'React', icon: <Code sx={{ fontSize: 36, color: 'primary.light' }} /> },
    { name: 'NestJS', icon: <PrecisionManufacturing sx={{ fontSize: 36, color: 'primary.light' }} /> },
    { name: 'TypeScript', icon: <DataObject sx={{ fontSize: 36, color: 'primary.light' }} /> },
    { name: 'Supabase', icon: <Storage sx={{ fontSize: 36, color: 'primary.light' }} /> },
    { name: 'Pinecone', icon: <Hub sx={{ fontSize: 36, color: 'primary.light' }} /> },
    { name: 'Redis', icon: <Memory sx={{ fontSize: 36, color: 'primary.light' }} /> },
    { name: 'Mastra AI', icon: <RocketLaunch sx={{ fontSize: 36, color: 'primary.light' }} /> },
    { name: 'Gemini', icon: <Security sx={{ fontSize: 36, color: 'primary.light' }} /> },
    { name: 'LangSmith', icon: <Build sx={{ fontSize: 36, color: 'primary.light' }} /> },
    { name: 'MUI', icon: <Code sx={{ fontSize: 36, color: 'primary.light' }} /> },
    { name: 'TurboRepo', icon: <Speed sx={{ fontSize: 36, color: 'primary.light' }} /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Stack spacing={10}>
        {/* Mission Section */}
        <Box textAlign="center">
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
            Our Mission
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "md", mx: "auto" }}>
            Empowering developers to build truly intelligent, context-aware conversational AI applications.
            DeanMachines AI provides a powerful, integrated platform to build, deploy, and manage
            sophisticated conversational AI agents with advanced memory, reasoning, and tool-use capabilities.
            We handle the complexity so you can focus on creating unique AI experiences.
          </Typography>
        </Box>

        {/* Tech Stack Section */}
        <Box textAlign="center">
          <Typography variant="h4" sx={{ mb: 4 }}>
            Built with Cutting-Edge Technology
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {techStack.map((tech, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    textAlign: 'center',
                    height: '100%',
                    bgcolor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    borderRadius: 1,
                    '&:hover': {
                      borderColor: 'primary.light',
                      boxShadow: (theme) => theme.shadows[2]
                    }
                  }}
                >
                  {tech.icon}
                  <Typography variant="caption" display="block" fontWeight="medium">
                    {tech.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team/Creator Section */}
        <Box textAlign="center">
          <Typography variant="h4" sx={{ mb: 2 }}>
            Meet the Creator
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: "md", mx: "auto" }}>
            DeanMachines was founded by AI engineers with experience building conversational
            agent systems at scale. Our team combines expertise in NLP, vector databases,
            and modern web development to create a platform that makes advanced AI accessible.
          </Typography>
        </Box>

        {/* Contact/Links Section */}
        <Box textAlign="center">
          <Typography variant="h4" sx={{ mb: 3 }}>
            Connect & Contribute
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Link href="https://github.com/ssdeanxs" target="_blank" rel="noopener noreferrer" passHref legacyBehavior>
              <Button
                variant="outline"
                startIcon={<GitHub />}
                component="a" // Use 'a' tag for styling consistency if needed, or remove
              >
                GitHub
              </Button>
            </Link>
            <Link href="https://linkedin.com/company/deanmachines" target="_blank" rel="noopener noreferrer" passHref legacyBehavior>
              <Button
                variant="outline"
                startIcon={<LinkedIn />}
                component="a" // Use 'a' tag for styling consistency if needed, or remove
              >
                LinkedIn
              </Button>
            </Link>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
