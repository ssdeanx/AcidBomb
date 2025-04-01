import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

/**
 * Data transfer object for creating a new AI agent.
 * Defines the structure and validation rules for agent creation requests.
 */
export class CreateAgentDto {
  /**
   * The name of the agent. Must be a non-empty string.
   * @example 'Customer Support Agent'
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * A description of the agent's purpose or capabilities. Optional.
   * @example 'An agent designed to answer customer support queries.'
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * The identifier of the AI model the agent will use. Must be a non-empty string.
   * @example 'openai:gpt-4o'
   */
  @IsString()
  @IsNotEmpty()
  model: string; // Consider adding specific validation if model IDs follow a pattern

  /**
   * The system instructions or prompt for the agent. Must be a non-empty string.
   * @example 'You are a helpful assistant. Answer questions concisely.'
   */
  @IsString()
  @IsNotEmpty()
  instructions: string;

  // Add other relevant properties like tool configurations, memory settings, etc.
  // For example:
  // @IsOptional()
  // @IsArray()
  // tools?: string[]; // Array of tool IDs or configurations
}
