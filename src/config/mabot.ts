// MABOT Configuration
// This file centralizes all MABOT-related configuration

interface MabotConfig {
  apiUrl: string;
  botUsername: string;
  email: string;
  password: string;
}

// Load configuration from environment variables
// Note: These will be undefined in the browser since they don't have VITE_ prefix
const config: MabotConfig = {
  apiUrl: import.meta.env.MABOT_API_URL || '',
  botUsername: import.meta.env.MABOT_BOT_USERNAME || 'aveeuropa',
  email: import.meta.env.MABOT_EMAIL || '',
  password: import.meta.env.MABOT_PASSWORD || '',
};

// Validation function to check if configuration is complete
export const isMabotConfigValid = (): boolean => {
  return !!(config.apiUrl && config.botUsername && config.email && config.password);
};

// Get configuration with validation
export const getMabotConfig = (): MabotConfig => {
  if (!isMabotConfigValid()) {
    console.warn('MABOT configuration is incomplete. Please check your .env.local file.');
  }
  return { ...config };
};

// Individual getters for specific values
export const getMabotApiUrl = (): string => config.apiUrl;
export const getMabotBotUsername = (): string => config.botUsername;
export const getMabotEmail = (): string => config.email;
export const getMabotPassword = (): string => config.password;

// Configuration status for debugging
export const getMabotConfigStatus = () => ({
  apiUrl: config.apiUrl,
  botUsername: config.botUsername,
  email: config.email,
  password: config.password,
  isValid: isMabotConfigValid(),
});

export default config; 