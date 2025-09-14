import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // 【新增】代理配置
    proxy: {
      // 当请求路径以 /api 开头时，启用代理
      '/api': {
        // 代理目标，即你的真实后端地址
        target: 'http://47.101.189.231:8080',
        // 开启跨域
        changeOrigin: true,
      },
    },
  },
});
