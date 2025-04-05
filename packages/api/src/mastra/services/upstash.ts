import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: 'https://ethical-ocelot-49780.upstash.io',
  token: 'AcJ0AAIjcDE5Y2E1NjNiMDI3ZWM0NWQ2YTQyNmUxOWExZDQ0NDNhZnAxMA',
});

/**
 * Demonstrates setting and getting a value from Redis.
 */
async function runRedisDemo(): Promise<void> {
  try {
    await redis.set('foo', 'bar');
    const data = await redis.get('foo');
    console.log(data);
  } catch (error) {
    console.error('Redis operation failed:', error);
  }
}

void runRedisDemo();
