import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import App from './App';
import 'antd/dist/reset.css';
// 导入你的测试函数
import { testUserListApi } from './testApi';

/* // 【临时添加】在这里调用测试函数
testUserListApi(); */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
