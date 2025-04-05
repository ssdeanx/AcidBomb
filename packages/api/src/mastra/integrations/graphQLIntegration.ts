import { PrismaClient } from '@prisma/client';
import { getGraphData, getGraphDataWithParams } from '../tools/graphrag';
import { typeDefs } from '../../graphql/schema';

const prisma = new PrismaClient();

/**
 * Executes a GraphQL query against the database using Mastra AI's GraphRAG tool
 *
 * @param query - The GraphQL query string to execute
 * @returns The query result from the GraphRAG tool
 * @throws Error if the query execution fails
 */
export async function executeGraphQLQuery(query: string): Promise<unknown> {
  try {
    return await getGraphData(query);
  } catch (error) {
    console.error('Error executing GraphQL query:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to execute GraphQL query: ${errorMessage}`);
  }
}

/**
 * Executes a GraphQL query with parameters against the database using Mastra AI's GraphRAG tool
 *
 * @param query - The GraphQL query string to execute
 * @param params - Parameters to pass to the query
 * @returns The query result from the GraphRAG tool
 * @throws Error if the query execution fails
 */
export async function executeGraphQLQueryWithParams(
  query: string,
  params: Record<string, unknown>,
): Promise<unknown> {
  try {
    return await getGraphDataWithParams(query, params);
  } catch (error) {
    console.error('Error executing parameterized GraphQL query:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to execute parameterized GraphQL query: ${errorMessage}`,
    );
  }
}

/**
 * Provides the GraphQL schema type definitions for use with GraphRAG
 *
 * @returns The GraphQL schema type definitions string
 */
export function getGraphQLSchema(): string {
  return typeDefs.loc?.source.body || '';
}

/**
 * Example resolver functions for the GraphQL schema
 * These would typically be implemented in a separate file
 * and connected to your database via Prisma
 */
export const resolvers = {
  Query: {
    userPreference: (_: unknown, { userId }: { userId: string }) => {
      return prisma.userPreference.findFirst({
        where: { userId },
      });
    },
    conversations: (
      _: unknown,
      {
        userId,
        limit,
        offset,
      }: { userId: string; limit: number; offset: number },
    ) => {
      return prisma.conversation.findMany({
        where: { userId },
        orderBy: { lastMessageAt: 'desc' },
        take: limit,
        skip: offset,
      });
    },
    // Add other resolvers here
  },
  // Add other resolver objects here
};
