// lovseele/catmanagementsystem/CatManagementSystem-feat/src/pages/Login.tsx

import { Card, Form, Input, Button, Alert } from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks';
import { login } from '../slices/authSlice'; // 1. 重新导入 login action
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';

export default function Login() {
  // 2. 重新从 Redux store 中获取状态
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation() as any;

  const onFinish = async (values: any) => {
    // 3. dispatch a login action, Redux Toolkit 会处理 Promise
    console.log('表单提交的 values:', values);
    const resultAction = await dispatch(login(values));

    // 4. Redux Toolkit 的 createAsyncThunk 会返回一个带有 `type` 属性的 action 对象。
    //    我们可以通过检查 action.type 是否以 'fulfilled' 结尾来判断异步操作是否成功。
    if (login.fulfilled.match(resultAction)) {
      const to = location.state?.from || '/';
      navigate(to, { replace: true });
    }
    // 如果失败了，authSlice 的 rejected reducer 会自动更新 error 状态，
    // Alert 组件会根据 error 状态自动显示错误信息。
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `url(${logo})`,
      }}
    >
      <Card
        title="管理员登录"
        style={{ width: 360 }}
        cover={
          <img
            alt="example"
            src={logo}
            style={{
              width: '80%',
              display: 'flex',
              margin: 'auto',
            }}
          />
        }
      >
        {/* 这里的 error 重新由 Redux store 提供 */}
        {error && (
          <Alert message={error} type="error" style={{ marginBottom: 12 }} />
        )}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="userName"
            label="用户名"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          {/* loading 状态也重新由 Redux store 提供 */}
          <Button type="primary" htmlType="submit" block loading={loading}>
            登录
          </Button>
        </Form>
      </Card>
    </div>
  );
}
