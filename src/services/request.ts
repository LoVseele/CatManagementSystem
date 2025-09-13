import axios from 'axios';

const api = axios.create({
  baseURL: 'http://47.101.189.231:8080',
  timeout: 10000,
});

//请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');

    // 如果 token 存在，则添加到请求的 Authorization header 中
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

//响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 检查是否是 401 (Unauthorized) 错误
    if (error.response && error.response.status === 401) {
      // 这里的逻辑是：如果 token 无效或过期，后端通常会返回 401
      // 此时我们应该清除本地存储的登录信息，并强制用户返回登录页

      localStorage.removeItem('token');
      localStorage.removeItem('adminName');

      // 使用 window.location.href 跳转，因为这里不是在 React 组件内部，无法使用 useNavigate
      window.location.href = '/login';
    }

    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default api;
