# Mastra API - NestJS Backend

## Overview

This NestJS application serves as the backend API layer for the Mastra project, exposing AI functionality from the shared `packages/api` library. It provides both regular response endpoints and streaming endpoints using Server-Sent Events (SSE).

## Features

- **AI Chat Integration**: Connect with pre-defined Mastra agents through REST endpoints
- **Real-time Streaming**: Support for SSE streaming responses from AI agents
- **Authentication**: Security using Supabase authentication
- **Error Handling**: Global exception filter for consistent error responses
- **Type Safety**: Strong typing and request validation

## Getting Started

First, run the development server:

```bash
pnpm run dev
```

By default, your server will run at [http://localhost:3000](http://localhost:3000). You can use your favorite API platform like [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/) to test your APIs.

### ⚠️ Note about build

If you plan to only build this app, please make sure you've built the packages first.

## API Endpoints

### Chat Endpoints

All chat endpoints require authentication (Supabase JWT token in `Authorization: Bearer <token>` header).

#### Single Response

```bash
POST /chat/:agentName
```

**Parameters:**

- `agentName`: Name of the Mastra agent to use (path parameter)

**Request Body:**

```json
{
  "prompt": "Your message to the agent",
  "threadId": "optional-thread-id-for-conversation-context"
}
```

**Response:**
Standard JSON response from the agent.

#### Streaming Response

```bash
GET /chat/stream/:agentName?prompt=Your%20message&threadId=optional-thread-id
```

**Parameters:**

- `agentName`: Name of the Mastra agent to use (path parameter)
- `prompt`: Your message to the agent (query parameter)
- `threadId`: Optional thread ID for conversation context (query parameter)

**Response:**
Server-Sent Events (SSE) stream with JSON-encoded message chunks.

## Architecture

The API is built using NestJS with the following key modules:

1. **MastraCoreModule**: Centralizes Mastra agent initialization and provides injectable instances
2. **ChatModule**: Contains services and controllers for chat functionality
3. **Global Exception Filter**: Handles errors and provides consistent API responses

## Learn More

To learn more about NestJs, take a look at the following resources:

- [Official Documentation](https://docs.nestjs.com) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [Official NestJS Courses](https://courses.nestjs.com) - Learn everything you need to master NestJS and tackle modern backend applications at any scale.
- [GitHub Repo](https://github.com/nestjs/nest)
