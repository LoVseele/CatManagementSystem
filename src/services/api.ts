// src/services/api.ts

import axios from 'axios';

// 1. 创建实例
const api = axios.create({
  baseURL: '', // 你的后端地址
  timeout: 10000,
});

// 3. 配置请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. 配置响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log(response.data);
    return response;
  },
  (error) => {
    console.error('响应拦截器错误:', error.response); // 调试日志
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminName');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 5. 默认导出这个配置好的实例
export default api;
