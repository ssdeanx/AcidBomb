import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AgentService, AgentResponse } from '../../mastra/services/agent-service';
import { CreateAgentDto } from '../../links/dto/create-agent.dto';
import { UpdateAgentDto } from '../../links/dto/update-agent.dto';
import { Agent } from '../../links/entities/agent.entity';

interface GenerateResponseDto {
  prompt: string;
  userId: string;
  sessionId?: string;
}

interface RagQueryDto {
  query: string;
  userId: string;
  maxResults?: number;
}

/**
 * Controller for managing and interacting with AI agents
 */
@Controller('agents')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
  ) {}

  /**
   * Create a new agent configuration
   * @param createAgentDto Data for creating the agent
   * @returns The created agent configuration
   */
  @Post()
  async create(@Body() createAgentDto: CreateAgentDto): Promise<Agent> {
    try {
      // In a real implementation, you would save to database
      // and possibly register with Mastra
      const agent = new Agent();
      agent.id = Math.floor(Math.random() * 1000);
      agent.name = createAgentDto.name;
      agent.description = createAgentDto.description;
      agent.model = createAgentDto.model;
      agent.instructions = createAgentDto.instructions;
      agent.createdAt = new Date();
      agent.updatedAt = new Date();

      return agent;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new HttpException(
        `Failed to create agent: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Retrieve all available agents
   * @returns List of all agents' names
   */
  @Get()
  async findAll(): Promise<string[]> {
    // Return the names of available agents from the Mastra configuration
    // Assuming AgentService has a method like findAllAgents() that returns Promise<Agent[]>
    // You might need to implement findAllAgents() in AgentService
    const agents: Agent[] = await this.agentService.findAllAgents(); // Hypothetical method
    return agents.map((agent) => agent.name);
  }

  /**
   * Generate a response from a specific agent
   * @param agentName Name of the agent to use
   * @param body Request body containing the prompt and user ID
   * @returns Generated response from the agent
   */
  @Post(':agentName/generate')
  async generateResponse(
    @Param('agentName') agentName: string,
    @Body() body: GenerateResponseDto,
  ): Promise<AgentResponse> {
    try {
      if (!body.prompt) {
        throw new HttpException('Prompt is required', HttpStatus.BAD_REQUEST);
      }

      if (!body.userId) {
        throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
      }

      const response = await this.agentService.generateResponse(
        agentName,
        body.userId,
        body.prompt,
        body.sessionId
      );

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new HttpException(
        `Failed to generate response: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Execute a RAG query to search and answer based on the knowledge base
   * @param body Request body containing the query and user ID
   * @returns Query results with response and sources
   */
  @Post('rag/query')
  async executeRagQuery(@Body() body: RagQueryDto) {
    try {
      if (!body.query) {
        throw new HttpException('Query is required', HttpStatus.BAD_REQUEST);
      }

      if (!body.userId) {
        throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.agentService.executeRagQuery(
        body.userId,
        body.query,
        body.maxResults
      );
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new HttpException(
        `Failed to execute RAG query: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
