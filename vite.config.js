import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env.MONGODB_URI = env.MONGODB_URI || env.VITE_MONGODB_URI || '';

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.svg',
          'logo.svg',
          'icons.svg',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
          'pwa-64x64.png'
        ],
        manifest: {
          name: 'AlgoFlowX — DSA Algorithm Visualizer',
          short_name: 'AlgoFlowX',
          description: 'Interactive Data Structures and Algorithms visualizer with real-time animated execution in Python, C, C++, Java, and JavaScript.',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          categories: ['education', 'productivity', 'utilities'],
          icons: [
            {
              src: '/pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png'
            },
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: false
        }
      }),
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
