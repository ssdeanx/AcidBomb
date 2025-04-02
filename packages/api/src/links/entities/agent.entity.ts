import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entity representing an AI agent in the system.
 * This class defines the structure of an agent as stored in the database.
 */
@Entity('agents')
export class Agent {
  /**
   * Unique identifier for the agent.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Name of the agent. Used as a reference when registering with Mastra.
   * @example 'customerSupportAgent'
   */
  @Column({ unique: true })
  name: string;

  /**
   * Optional description of the agent's purpose or capabilities.
   * @example 'An agent designed to answer customer support queries.'
   */
  @Column({ nullable: true })
  description?: string;

  /**
   * The identifier of the AI model the agent uses.
   * @example 'openai:gpt-4o'
   */
  @Column()
  model: string;

  /**
   * System instructions or prompt for the agent.
   * @example 'You are a helpful assistant. Answer questions concisely.'
   */
  @Column({ type: 'text' })
  instructions: string;

  /**
   * Timestamp when the agent was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Timestamp when the agent was last updated.
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Optional configuration for tools the agent can use.
   * Stored as a JSON object in the database.
   */
  @Column({ type: 'json', nullable: true })
  tools?: Record<string, unknown>;
}
