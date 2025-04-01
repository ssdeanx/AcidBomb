import { Injectable, NotFoundException } from '@nestjs/common';
import { Mastra } from '@mastra/core'; // Assuming Mastra is configured and injectable
import { Agent } from '@mastra/core';

// filepath: c:/Users/dm/Documents/Deanmachines/packages/api/src/controllers/agents/agent.service.ts
// Define DTOs later if needed
// import { CreateAgentDto } from './dto/create-agent.dto';
// import { UpdateAgentDto } from './dto/update-agent.dto';

// Placeholder for where agent configurations might be stored or managed
interface AgentConfig {
  id: number;
  name: string; // This name should correspond to the agent registered in Mastra
  description?: string;
  // Add other configuration details as needed
}

/**
 * Service for managing and interacting with AI agents.
 */
@Injectable()
export class AgentService {
  // Placeholder for agent configurations (replace with database/store)
  private readonly agents: Map<number, AgentConfig> = new Map([
    [1, { id: 1, name: 'chefAgent', description: 'Chef Michel Agent' }],
    // Add other pre-configured agents here
  ]);
  private nextId = 2;

  // Inject the Mastra instance (assuming it's provided through NestJS DI)
  // constructor(private readonly mastra: Mastra) {}
  // Using a placeholder Mastra instance for now
  private readonly mastra: Mastra = new Mastra({ agents: {} }); // Replace with actual injected Mastra instance

  /**
   * Creates a new agent configuration.
   * Note: This manages the configuration, not the runtime Mastra agent instance directly.
   * @param createAgentDto - Data for creating the agent configuration.
   * @returns The newly created agent configuration.
   * @throws Error if agent name is missing.
   */
  create(createAgentDto: /* CreateAgentDto */ { name: string; description?: string }): AgentConfig {
    if (!createAgentDto.name) {
      throw new Error('Agent name is required.');
    }
    const newAgent: AgentConfig = {
      id: this.nextId++,
      name: createAgentDto.name,
      description: createAgentDto.description,
    };
    this.agents.set(newAgent.id, newAgent);
    // In a real app, ensure the agent 'name' corresponds to a Mastra agent definition
    console.log(`Agent configuration created for: ${newAgent.name}`);
    return newAgent;
  }

  /**
   * Retrieves all agent configurations.
   * @returns A list of all agent configurations.
   */
  findAll(): AgentConfig[] {
    return Array.from(this.agents.values());
  }

  /**
   * Retrieves a specific agent configuration by its ID.
   * @param id - The ID of the agent configuration to retrieve.
   * @returns The agent configuration.
   * @throws {NotFoundException} If the agent configuration with the given ID is not found.
   */
  findOne(id: number): AgentConfig {
    const agentConfig = this.agents.get(id);
    if (!agentConfig) {
      throw new NotFoundException(`Agent configuration with ID ${id} not found`);
    }
    return agentConfig;
  }

  /**
   * Updates an existing agent configuration.
   * @param id - The ID of the agent configuration to update.
   * @param updateAgentDto - Data for updating the agent configuration.
   * @returns The updated agent configuration.
   * @throws {NotFoundException} If the agent configuration with the given ID is not found.
   */
  update(id: number, updateAgentDto: /* UpdateAgentDto */ Partial<AgentConfig>): AgentConfig {
    const agentConfig = this.findOne(id); // Reuse findOne to handle not found case
    const updatedAgent = { ...agentConfig, ...updateAgentDto };
    this.agents.set(id, updatedAgent);
    console.log(`Agent configuration updated for ID: ${id}`);
    return updatedAgent;
  }

  /**
   * Deletes an agent configuration.
   * @param id - The ID of the agent configuration to delete.
   * @throws {NotFoundException} If the agent configuration with the given ID is not found.
   */
  remove(id: number): void {
    const agentConfig = this.findOne(id); // Reuse findOne to handle not found case
    this.agents.delete(id);
    console.log(`Agent configuration removed for ID: ${id}`);
  }

  /**
   * Generates a response from a specific agent.
   * @param agentId - The ID of the agent configuration.
   * @param prompt - The prompt to send to the agent.
   * @returns The agent's response.
   * @throws {NotFoundException} If the agent configuration is not found.
   * @throws {Error} If the corresponding Mastra agent is not found or generation fails.
   */
  async generateResponse(agentId: number, prompt: string): Promise<string> {
    const agentConfig = this.findOne(agentId); // Find the config first

    try {
      // Retrieve the actual Mastra agent instance using the name from the config
      const agentInstance: Agent = this.mastra.getAgent(agentConfig.name);
      if (!agentInstance) {
        throw new Error(`Mastra agent named '${agentConfig.name}' not found.`);
      }

      // Use the agent's generate method
      const response = await agentInstance.generate(prompt);
      return response.text;
    } catch (error) {
      console.error(`Error generating response from agent ${agentConfig.name} (ID: ${agentId}):`, error);
      // Rethrow or handle specific Mastra errors as needed
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate response from agent ${agentConfig.name}: ${errorMessage}`);
    }
  }

  // Add other methods for interacting with agents (e.g., streaming) if needed
}
