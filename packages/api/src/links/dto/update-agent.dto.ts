
import { PartialType } from '@nestjs/mapped-types';
import { CreateAgentDto } from './create-agent.dto';

/**
 * Data transfer object for updating an existing AI agent.
 * Extends CreateAgentDto, making all properties optional.
 * Defines the structure and validation rules for agent update requests.
 */
export class UpdateAgentDto extends PartialType(CreateAgentDto) {}
