import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

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
          // Dynamic import only when dev server starts up and receives request
          server.middlewares.use(async (req, res, next) => {
            // Polyfill Express/Vercel serverless helper methods on standard http.ServerResponse
            if (!res.status) {
              res.status = function(code) {
                res.statusCode = code;
                return res;
              };
            }
            if (!res.json) {
              res.json = function(data) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return res;
              };
            }

            const url = new URL(req.url, `http://${req.headers.host}`);

            if (url.pathname === '/api/user') {
              try {
                const { default: userHandler } = await import('./api/user.js');
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
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
                return;
              }
            }

            if (url.pathname === '/api/stats') {
              try {
                const { default: statsHandler } = await import('./api/stats.js');
                req.query = Object.fromEntries(url.searchParams);
                return await statsHandler(req, res);
              } catch (err) {
                res.statusCode = 200;
                res.end(JSON.stringify({ count: 120 }));
                return;
              }
            }

            next();
          });
        },
      },
    ],
  };
});
