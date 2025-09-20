import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // 当请求路径以 /api 开头时，启用代理
      '/api': {
        target: 'http://47.101.189.231:8080',
        // 开启跨域
        changeOrigin: true,
      },
    },
  },
});
