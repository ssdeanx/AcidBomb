import { Box, Container, Typography, Paper, Link as MuiLink, Stack } from '@mui/material';
import { Psychology, Storage as StorageIcon, Code as CodeIcon } from '@mui/icons-material';
import { Hero } from '@repo/ui/Hero';
import { Card } from '@repo/ui/Card';
import { Code } from '@repo/ui/Code';
import { Button } from '@repo/ui/Button';
import Link from 'next/link';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { createClient } from './utils/supabase/server';
import styles from './page.module.css';

interface LinkData {
  id: string;
  title: string;
  url: string;
  description: string;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'DeanMachines AI: Build & Deploy Advanced Conversational Agents',
    description:
      'Leverage Mastra, Pinecone vector search, and robust backend tools to create intelligent AI experiences with persistent memory and RAG.',
    keywords: [
      'AI agents',
      'Mastra',
      'Pinecone',
      'Redis',
      'Upstash',
      'Vector Database',
      'RAG',
      'Conversational AI',
      'NestJS',
      'Next.js',
      'Developer Platform',
      'Gemini AI',
      'LangSmith',
      'TypeScript',
      'Large Language Models',
      'Vector Embeddings',
      'Semantic Search'
    ]
  };
}

async function fetchLinks(): Promise<LinkData[]> {
  try {
    const supabase = createClient(cookies());
    const { data, error } = await supabase
      .from('links')
      .select('id, title, url, description')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching links:', error.message);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching links:', error);
    return [];
  }
}

export default async function HomePage() {
  const links = await fetchLinks();
  const supabase = createClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <Box component="main">
      {/* Hero Section */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Hero
          title="Build Smarter Bots, Faster."
          highlightText="DeanMachines AI"
          description="The integrated platform for developers crafting next-generation conversational AI. Go beyond simple chatbots with persistent memory, RAG, and custom tool integration powered by Mastra."
        />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Button
            component={Link}
            href={user ? '/chat' : '/signup'}
            variant="primary"
            size="lg"
          >
            {user ? 'Go to Dashboard' : 'Sign Up Free'}
          </Button>
          <Button
            component={Link}
            href="/documentation"
            variant="primary"
            size="lg"
          >
            View Documentation
          </Button>
        </Stack>
      </Box>

      {/* Features Section */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" sx={{ mb: 6, fontWeight: 700 }}>
            Powerful AI Features
          </Typography>
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'center'
          }}>
            <Box sx={{
              width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' },
              minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' }
            }}>
              <Card
                title="Mastra AI Integration"
                description="Build advanced conversational agents powered by Mastra with custom tool integration, memory chains, and intelligent reasoning."
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-5px)',
                    boxShadow: theme => `${theme.shadows[8]}`
                  }
                }}
              >
                <Psychology sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              </Card>
            </Box>
            <Box sx={{
              width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' },
              minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' }
            }}>
              <Card
                title="Persistent Memory"
                description="Store and retrieve conversation context with Pinecone vector embeddings and Redis for short-term memory, enabling truly contextual AI interactions."
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-5px)',
                    boxShadow: theme => `${theme.shadows[8]}`
                  }
                }}
              >
                <StorageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              </Card>
            </Box>
            <Box sx={{
              width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' },
              minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' }
            }}>
              <Card
                title="Developer-First Stack"
                description="Built on Next.js, NestJS, TypeScript, and Supabase, with comprehensive tools for development, deployment, and monitoring of production-ready AI solutions."
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-5px)',
                    boxShadow: theme => `${theme.shadows[8]}`
                  }
                }}
              >
                <CodeIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Code Demo Section */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md" sx={{ my: { xs: 10, md: 16 } }}>
          <Paper
            sx={{
              p: { xs: 3, sm: 4 },
              bgcolor: 'grey.900',
              border: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2
            }}
          >
            <Typography variant="h4" sx={{ mb: 3 }}>
              Example: Defining a Mastra Tool
            </Typography>
            <Code variant="block" highlight={true}>
{`import { definePluginTool } from '@mastra/core';

export const weatherTool = definePluginTool({
  name: "weather",
  description: "Get current weather data for a location",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "City name, e.g. 'New York'",
      },
      units: {
        type: "string",
        enum: ["metric", "imperial"],
        description: "Units for the temperature (C or F)",
        default: "metric"
      },
    },
    required: ["location"],
  },
  handler: async ({ location, units = "metric" }) => {
    try {
      const API_KEY = process.env.WEATHER_API_KEY;
      const response = await fetch(
        \`https://api.openweathermap.org/data/2.5/weather?q=\${location}&units=\${units}&appid=\${API_KEY}\`
      );
      const data = await response.json();

      if (data.cod !== 200) {
        throw new Error(\`Weather API error: \${data.message}\`);
      }

      return {
        temperature: data.main.temp,
        conditions: data.weather[0].description,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        location: \`\${data.name}, \${data.sys.country}\`,
        units: units === "metric" ? "°C" : "°F"
      };
    } catch (error) {
      return { error: error.message };
    }
  },
});`}
            </Code>
          </Paper>
        </Container>
      </Box>

      {/* Links Section */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" sx={{ mb: 6, fontWeight: 700 }}>
            Resources & Updates
          </Typography>
          {links.length === 0 ? (
            <Typography variant="body1" component="p" align="center" color="text.secondary">
            </Typography>
          ) : (
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              justifyContent: 'center'
            }}>
              {links.map((link) => (
                <Box
                  key={link.id}
                  sx={{
                    width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' },
                    minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' }
                  }}
                >
                  <MuiLink
                    component={Link}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'block',
                      height: '100%',
                      textDecoration: 'none'
                    }}
                  >
                    <Card
                      title={link.title}
                      description={link.description}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'primary.light',
                          boxShadow: theme => `${theme.shadows[4]}`
                        }
                      }}
                    />
                  </MuiLink>
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* Final CTA */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container sx={{ textAlign: 'center', py: { xs: 10, md: 16 } }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Ready to build smarter AI?
          </Typography>
          <Button
            component={Link}
            href={user ? '/chat' : '/signup'}
            variant="primary"
            size="lg"
          >
            {user ? 'Start Chatting Now' : 'Sign Up For Free'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
