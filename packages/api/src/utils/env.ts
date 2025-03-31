/**
 * Environment variable utilities
 * Provides type-safe access to environment variables
 */

/**
 * Get an environment variable with optional default value
 */
export const getEnvVar = (key: string, defaultValue: string = ''): string => {
  const value = process.env[key];
  if (!value && defaultValue === '') {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || defaultValue;
};

/**
 * Get a boolean environment variable
 */
export const getBooleanEnvVar = (
  key: string,
  defaultValue = false,
): boolean => {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

/**
 * Get a number environment variable
 */
export const getNumberEnvVar = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};
