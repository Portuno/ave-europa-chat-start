// MABOT Configuration
// This file centralizes all MABOT-related configuration

interface MabotConfig {
  apiUrl: string;
  botUsername: string;
  email: string;
  password: string;
}

// Load configuration from environment variables
// Try both Vite env and direct process.env for better compatibility
const getEnvVar = (key: string): string => {
  // First try Vite's import.meta.env
  const viteValue = import.meta.env[key];
  if (viteValue) return viteValue;
  
  // Fallback to process.env (for SSR or Node environments)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }
  
  return '';
};

const config: MabotConfig = {
  apiUrl: getEnvVar('MABOT_API_URL'),
  botUsername: getEnvVar('MABOT_BOT_USERNAME') || 'aveeuropa',
  email: getEnvVar('MABOT_EMAIL'),
  password: getEnvVar('MABOT_PASSWORD'),
};

// Debug logging to help troubleshoot
console.log('MABOT Config loaded:', {
  apiUrl: config.apiUrl ? '✓ Set' : '✗ Missing',
  botUsername: config.botUsername ? '✓ Set' : '✗ Missing',
  email: config.email ? '✓ Set' : '✗ Missing',
  password: config.password ? '✓ Set' : '✗ Missing',
});

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