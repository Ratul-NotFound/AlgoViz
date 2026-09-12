import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import userHandler from './api/user.js';
import statsHandler from './api/stats.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env.MONGODB_URI = env.MONGODB_URI || env.VITE_MONGODB_URI || '';

  return {
    plugins: [
      react(),
      {
        name: 'mongo-dev-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = new URL(req.url, `http://${req.headers.host}`);

            if (url.pathname === '/api/user') {
              req.query = Object.fromEntries(url.searchParams);
              if (req.method === 'POST') {
                let body = '';
                req.on('data', (chunk) => { body += chunk; });
                req.on('end', async () => {
                  try { req.body = JSON.parse(body); } catch { req.body = {}; }
                  await userHandler(req, res);
                });
                return;
              }
              return await userHandler(req, res);
            }

            if (url.pathname === '/api/stats') {
              req.query = Object.fromEntries(url.searchParams);
              return await statsHandler(req, res);
            }

            next();
          });
        },
      },
    ],
  };
});

