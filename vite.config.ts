import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Define global constants for environment variables
    define: {
      'import.meta.env.MABOT_API_URL': JSON.stringify(env.MABOT_API_URL),
      'import.meta.env.MABOT_BOT_USERNAME': JSON.stringify(env.MABOT_BOT_USERNAME),
      'import.meta.env.MABOT_EMAIL': JSON.stringify(env.MABOT_EMAIL),
      'import.meta.env.MABOT_PASSWORD': JSON.stringify(env.MABOT_PASSWORD),
    },
  };
});
