import { createTool } from '@mastra/core';
import { z } from 'zod';

const getWeatherInfo = async (city: string) => {
  // Replace with an actual API call to a weather service
  const data = await fetch(`https://api.example.com/weather?city=${city}`).then(
    (r) => r.json(),
  );
  return data;
};

export const weatherInfo = createTool({
  id: 'Get Weather Information',
  inputSchema: z.object({
    city: z.string(),
  }),
  description: `Fetches the current weather information for a given city`,
  execute: async ({ context: { city } }) => {
    console.log('Using tool to fetch weather information for', city);
    return await getWeatherInfo(city);
  },
});
