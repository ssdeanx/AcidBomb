import { Index } from '@upstash/vector';

const index = new Index({
  url: 'https://premium-ram-67425-us1-vector.upstash.io',
  token:
    'ABUFMHByZW1pdW0tcmFtLTY3NDI1LXVzMWFkbWluTURGbU9UYzJaRFF0TldFeE5DMDBOVEJoTFRrMlpUUXRZemt5T0RVeU5HSTVNREE0',
});

/**
 * Main function to demonstrate Upstash Vector operations.
 */
async function main() {
  try {
    console.log('Upserting data...');
    await index.upsert({
      id: 'id1',
      data: 'Enter data as string',
      metadata: { metadata_field: 'metadata_value' },
    });
    console.log('Data upserted.');

    console.log('Querying data...');
    const queryResult = await index.query({
      data: 'Enter data as string',
      topK: 1,
      includeVectors: true,
      includeMetadata: true,
    });
    console.log('Query result:', queryResult);

    console.log('Deleting data...');
    const deleteResult = await index.delete('id1');
    console.log('Delete result:', deleteResult);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Execute the main function
void main();
