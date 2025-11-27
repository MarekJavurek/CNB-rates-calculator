import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@mui/styled-engine": "@mui/styled-engine-sc",
      },
    },
    envPrefix: "FE_",
    server: {
      // dev only - proxy to avoid CORS issues
      proxy: {
        "/api/daily.txt": {
          target:
            "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt",
          changeOrigin: true,
          rewrite: () => "",
        },
      },
    },
  };
});
