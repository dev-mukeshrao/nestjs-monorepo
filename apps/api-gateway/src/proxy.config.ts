import { createProxyMiddleware } from 'http-proxy-middleware';

export const proxyConfig = [
  {
    path: '/user',
    proxy: createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: {
        '^/user': '', // remove /user prefix
      },
    }),
  },
  {
    path: '/document',
    proxy: createProxyMiddleware({
      target: 'http://localhost:3002',
      changeOrigin: true,
      pathRewrite: {
        '^/document': '',
      },
    }),
  },
  {
    path: '/ingestion',
    proxy: createProxyMiddleware({
      target: 'http://localhost:3003',
      changeOrigin: true,
      pathRewrite: {
        '^/ingestion': '',
      },
    }),
  },
];
