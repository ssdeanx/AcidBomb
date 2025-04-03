import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Link as MuiLink,
  Divider,
  List,
  ListItem,
  ListItemText,
  alpha,
} from '@mui/material';
import { Code } from '@repo/ui/Code';
import { Collapsible } from '@repo/ui/Collapsible';

/**
 * Generate SEO metadata for the guides page
 * @returns Metadata object with title and description
 */
export function generateMetadata(): Metadata {
  return {
    title: 'Implementation Guides | DeanMachines AI Documentation',
    description: 'Step-by-step guides for implementing DeanMachines AI functionality in your applications. Learn about agent creation, memory integration, and RAG deployment.',
  };
}

/**
 * Guides documentation page
 * Provides step-by-step tutorials on implementing various platform features
 */
export default function GuidesPage() {
  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h2" component="h1" gutterBottom>
          Implementation Guides
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Follow these step-by-step guides to implement DeanMachines AI features in your applications.
          Each guide provides detailed explanations and code examples to help you get started quickly.
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Guide Categories */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom>
          Available Guides
        </Typography>
        <Typography variant="body1" paragraph>
          Select a category to explore implementation guides:
        </Typography>

        <Stack spacing={3} sx={{ mt: 3 }}>
          {/* Agent Creation Guide */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h4" component="h3" gutterBottom>
              Creating AI Agents
            </Typography>
            <Typography variant="body1" paragraph>
              Learn how to create, configure, and deploy AI agents with various capabilities:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Basic Agent Setup"
                  secondary="Create a simple conversational agent with Gemini Pro"
                  primaryTypographyProps={{ color: 'primary.light' }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Adding System Instructions"
                  secondary="Define agent personality and capabilities with system messages"
                  primaryTypographyProps={{ color: 'primary.light' }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Tool Integration"
                  secondary="Extend your agent with custom tools and API integrations"
                  primaryTypographyProps={{ color: 'primary.light' }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
            </List>

            <Collapsible
              header={
                <Typography fontWeight="medium">
                  Quick Start: Basic Agent Setup
                </Typography>
              }
            >
              <Box sx={{ pt: 1, pl: 2 }}>
                <Typography variant="body2" paragraph>
                  Follow these steps to create a basic conversational agent:
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      1. Configure your agent schema
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'grey.900',
                        borderRadius: 1,
                        overflowX: 'auto',
                        my: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Code variant="block" highlight={true}>
{`// agent-config.ts
import { z } from "zod";
import { defineAgent } from "@mastra/core";

export const weatherForecastAgent = defineAgent({
  name: "weatherForecast",
  description: "An agent that provides weather forecasts",
  model: "gemini-pro",
  systemMessage:
    "You are a helpful weather assistant. Provide accurate weather forecasts " +
    "based on location data. Be concise but informative.",
});`}
                      </Code>
                    </Paper>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      2. Initialize the agent in your application
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'grey.900',
                        borderRadius: 1,
                        overflowX: 'auto',
                        my: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Code variant="block" highlight={true}>
{`// app.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { weatherForecastAgent } from "./agent-config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register the agent
  app.get(weatherForecastAgent.name).register();

  await app.listen(3000);
}

bootstrap();`}
                      </Code>
                    </Paper>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      3. Create an endpoint to interact with the agent
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'grey.900',
                        borderRadius: 1,
                        overflowX: 'auto',
                        my: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Code variant="block" highlight={true}>
{`// weather.controller.ts
import { Controller, Post, Body, Inject } from "@nestjs/common";
import { weatherForecastAgent } from "./agent-config";

@Controller("weather")
export class WeatherController {
  constructor(
    @Inject(weatherForecastAgent.name)
    private readonly agent: typeof weatherForecastAgent.type
  ) {}

  @Post()
  async getWeatherForecast(@Body() body: { location: string }) {
    const { location } = body;

    // Create a new chat session
    const session = await this.agent.createSession();

    // Send a message to the agent
    const response = await session.sendMessage(
      \`What's the weather forecast for \${location}?\`
    );

    return {
      forecast: response.content,
    };
  }
}`}
                      </Code>
                    </Paper>
                  </Box>
                </Stack>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    To learn more advanced agent configuration options, see the{' '}
                    <MuiLink component={Link} href="/documentation/api-reference">
                      API Reference
                    </MuiLink>.
                  </Typography>
                </Box>
              </Box>
            </Collapsible>
          </Paper>

          {/* Memory Integration Guide */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h4" component="h3" gutterBottom>
              Memory Integration
            </Typography>
            <Typography variant="body1" paragraph>
              Implement persistent memory using Redis and Pinecone:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Short-term Memory with Redis"
                  secondary="Configure conversation history using Redis"
                  primaryTypographyProps={{ color: 'primary.light' }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Long-term Memory with Pinecone"
                  secondary="Implement semantic memory using vector embeddings"
                  primaryTypographyProps={{ color: 'primary.light' }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Hybrid Memory Architecture"
                  secondary="Combine short and long-term memory for optimal performance"
                  primaryTypographyProps={{ color: 'primary.light' }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
            </List>

            <Collapsible
              header={
                <Typography fontWeight="medium">
                  Implementation: Hybrid Memory Setup
                </Typography>
              }
            >
              <Box sx={{ pt: 1, pl: 2 }}>
                <Typography variant="body2" paragraph>
                  Follow these steps to implement a hybrid memory architecture:
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      1. Configure memory providers
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'grey.900',
                        borderRadius: 1,
                        overflowX: 'auto',
                        my: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Code variant="block" highlight={true}>
{`// memory-config.ts
import { RedisMemory } from "@mastra/redis";
import { PineconeMemory } from "@mastra/pinecone";

// Short-term memory with Redis
export const shortTermMemory = new RedisMemory({
  url: process.env.REDIS_URL,
  ttl: 60 * 60 * 24, // 1 day in seconds
});

// Long-term memory with Pinecone
export const longTermMemory = new PineconeMemory({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
  index: "agent-memory",
  namespace: "user-interactions",
});`}
                      </Code>
                    </Paper>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      2. Create a hybrid memory manager
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'grey.900',
                        borderRadius: 1,
                        overflowX: 'auto',
                        my: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Code variant="block" highlight={true}>
{`// hybrid-memory.ts
import { HybridMemory } from "@mastra/memory";
import { shortTermMemory, longTermMemory } from "./memory-config";

export const hybridMemory = new HybridMemory({
  shortTerm: shortTermMemory,
  longTerm: longTermMemory,
  // Configure when to store in long-term memory
  persistencePolicy: {
    // Store every 5th message in long-term memory
    messageInterval: 5,
    // Always store messages with specific keywords
    keywords: ["important", "remember", "save"],
  },
});`}
                      </Code>
                    </Paper>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      3. Integrate with your agent
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'grey.900',
                        borderRadius: 1,
                        overflowX: 'auto',
                        my: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Code variant="block" highlight={true}>
{`// agent-with-memory.ts
import { defineAgent } from "@mastra/core";
import { hybridMemory } from "./hybrid-memory";

export const customerSupportAgent = defineAgent({
  name: "customerSupport",
  description: "A customer support agent with persistent memory",
  model: "gemini-pro",
  memory: hybridMemory,
  systemMessage:
    "You are a customer support agent. Use your memory of past " +
    "interactions to provide consistent and helpful support.",
});`}
                      </Code>
                    </Paper>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      4. Using memory in conversations
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'grey.900',
                        borderRadius: 1,
                        overflowX: 'auto',
                        my: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Code variant="block" highlight={true}>
{`// support.controller.ts
import { Controller, Post, Body, Inject } from "@nestjs/common";
import { customerSupportAgent } from "./agent-with-memory";

@Controller("support")
export class SupportController {
  constructor(
    @Inject(customerSupportAgent.name)
    private readonly agent: typeof customerSupportAgent.type
  ) {}

  @Post()
  async handleSupportQuery(
    @Body() body: { sessionId: string; message: string }
  ) {
    const { sessionId, message } = body;

    // Create or retrieve an existing session
    const session = await this.agent.getOrCreateSession(sessionId);

    // Send message - the agent will automatically retrieve relevant memories
    const response = await session.sendMessage(message);

    return {
      sessionId: session.id,
      response: response.content,
    };
  }
}`}
                      </Code>
                    </Paper>
                  </Box>
                </Stack>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    For more information on memory configuration options, see the{' '}
                    <MuiLink component={Link} href="/documentation/core-concepts#memory">
                      Memory documentation
                    </MuiLink>.
                  </Typography>
                </Box>
              </Box>
            </Collapsible>
          </Paper>

          {/* RAG Implementation Guide */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h4" component="h3" gutterBottom>
              Retrieval-Augmented Generation (RAG)
            </Typography>
            <Typography variant="body1" paragraph>
              Implement RAG to enhance your agents with external knowledge:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Document Processing"
                  secondary="Prepare and index documents for retrieval"
                  primaryTypographyProps={{ color: 'primary.light' }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Vector Search Integration"
                  secondary="Connect to Pinecone for semantic search"
                  primaryTypographyProps={{ color: 'primary.light' }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Query Processing"
                  secondary="Generate contextually relevant responses using retrieved information"
                  primaryTypographyProps={{ color: 'primary.light' }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
            </List>

            <Collapsible
              header={
                <Typography fontWeight="medium">
                  Coming Soon
                </Typography>
              }
            >
              <Box sx={{ pt: 1, pl: 2 }}>
                <Typography variant="body2" paragraph>
                  The comprehensive RAG implementation guide is currently being prepared and will be available soon.
                  In the meantime, please refer to the{' '}
                  <MuiLink component={Link} href="/documentation/examples">
                    Examples section
                  </MuiLink>{' '}
                  for RAG code samples.
                </Typography>
              </Box>
            </Collapsible>
          </Paper>

          {/* Custom Tools Guide */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h4" component="h3" gutterBottom>
              Custom Tool Development
            </Typography>
            <Typography variant="body1" paragraph>
              Create and integrate custom tools to extend agent capabilities:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Tool Definition"
                  secondary="Create tools using the Mastra tool framework"
                  primaryTypographyProps={{ color: 'primary.light' }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Parameter Validation"
                  secondary="Ensure tools receive properly formatted input"
                  primaryTypographyProps={{ color: 'primary.light' }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Tool Integration"
                  secondary="Connect external APIs and services to your agents"
                  primaryTypographyProps={{ color: 'primary.light' }}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
            </List>

            <Collapsible
              header={
                <Typography fontWeight="medium">
                  Quick Start: Weather Tool Example
                </Typography>
              }
            >
              <Box sx={{ pt: 1, pl: 2 }}>
                <Typography variant="body2" paragraph>
                  Follow these steps to create a custom weather tool:
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      1. Define the tool schema
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'grey.900',
                        borderRadius: 1,
                        overflowX: 'auto',
                        my: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Code variant="block" highlight={true}>
{`// weather-tool.ts
import { z } from "zod";
import { defineTool } from "@mastra/core";
import { getWeatherData } from "./weather-service";

export const weatherTool = defineTool({
  name: "getWeather",
  description: "Get current weather conditions for a location",
  parameters: z.object({
    location: z.string().describe("City name or geographic coordinates"),
    units: z.enum(["metric", "imperial"]).default("metric").describe("Units system for temperature (metric or imperial)"),
  }),
  handler: async ({ location, units }) => {
    try {
      // Call external weather API
      const weatherData = await getWeatherData(location, units);

      return {
        temperature: weatherData.temperature,
        conditions: weatherData.conditions,
        humidity: weatherData.humidity,
        wind: weatherData.wind,
        location: weatherData.location,
      };
    } catch (error) {
      throw new Error(\`Failed to get weather data: \${error.message}\`);
    }
  },
});`}
                      </Code>
                    </Paper>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      2. Create the external service connector
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'grey.900',
                        borderRadius: 1,
                        overflowX: 'auto',
                        my: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Code variant="block" highlight={true}>
{`// weather-service.ts
import axios from "axios";

interface WeatherData {
  temperature: number;
  conditions: string;
  humidity: number;
  wind: {
    speed: number;
    direction: string;
  };
  location: string;
}

export async function getWeatherData(
  location: string,
  units: "metric" | "imperial"
): Promise<WeatherData> {
  // Replace with your weather API provider
  const apiKey = process.env.WEATHER_API_KEY;

  const response = await axios.get(\`https://api.weatherprovider.com/current\`, {
    params: {
      q: location,
      units,
      appid: apiKey,
    },
  });

  return {
    temperature: response.data.main.temp,
    conditions: response.data.weather[0].description,
    humidity: response.data.main.humidity,
    wind: {
      speed: response.data.wind.speed,
      direction: getWindDirection(response.data.wind.deg),
    },
    location: \`\${response.data.name}, \${response.data.sys.country}\`,
  };
}

function getWindDirection(degrees: number): string {
  // Convert degrees to cardinal directions
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(((degrees % 360) / 45)) % 8;
  return directions[index];
}`}
                      </Code>
                    </Paper>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      3. Register the tool with your agent
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'grey.900',
                        borderRadius: 1,
                        overflowX: 'auto',
                        my: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Code variant="block" highlight={true}>
{`// agent-with-tools.ts
import { defineAgent } from "@mastra/core";
import { weatherTool } from "./weather-tool";

export const travelAssistantAgent = defineAgent({
  name: "travelAssistant",
  description: "A travel assistant with weather forecasting capability",
  model: "gemini-pro",
  tools: [weatherTool],
  systemMessage:
    "You are a travel assistant that helps users plan trips. " +
    "You can check weather conditions to provide better recommendations. " +
    "When answering about destinations, always use the getWeather tool " +
    "to provide up-to-date weather information.",
});`}
                      </Code>
                    </Paper>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      4. Using the tool in conversations
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor: 'grey.900',
                        borderRadius: 1,
                        overflowX: 'auto',
                        my: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Code variant="block" highlight={true}>
{`// Example conversation with the agent that uses the weather tool

// User: "What's the weather like in Paris right now?"

// Agent will automatically use the weatherTool to get this information
// by invoking the handler function with the location parameter

// Response from agent might be:
"Currently in Paris, France, the temperature is 22°C with partly cloudy
conditions. The humidity is 65% with light winds blowing from the SW
direction at 8 km/h."

// The agent can also proactively use the tool when it's relevant
// User: "I'm planning a trip to Barcelona next week. Any advice?"

// Agent might first check the weather before responding:
"Barcelona is a wonderful destination! I checked the current weather
conditions for you: it's currently 27°C and sunny with low humidity
at 40%. This is typical for this time of year.

Here are some recommendations for your trip:
- Pack light summer clothing, but bring a light jacket for evenings
- Don't miss the Sagrada Familia and Park Güell
- The beaches should be perfect for swimming with these conditions
- Consider outdoor dining as the weather is ideal right now

Would you like more specific recommendations for activities or areas to stay?"`}
                      </Code>
                    </Paper>
                  </Box>
                </Stack>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    For more advanced tool configurations, including handling file uploads and streaming data, see the{' '}
                    <MuiLink component={Link} href="/documentation/api-reference#tools">
                      Tools API Reference
                    </MuiLink>.
                  </Typography>
                </Box>
              </Box>
            </Collapsible>
          </Paper>
        </Stack>
      </Box>

      {/* Next Steps */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Next Steps
        </Typography>
        <Typography variant="body1" paragraph>
          Now that you've learned how to implement various DeanMachines features, check out these related resources:
        </Typography>
        <Stack component="ul" spacing={1} sx={{ pl: 3 }}>
          <Box component="li">
            <Typography variant="body1">
              <MuiLink component={Link} href="/documentation/examples">Example Projects</MuiLink> - Complete working examples
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              <MuiLink component={Link} href="/documentation/api-reference">API Reference</MuiLink> - Detailed API documentation
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              <MuiLink component={Link} href="/documentation/core-concepts">Core Concepts</MuiLink> - Learn about the foundational concepts
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
