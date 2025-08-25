import { Card, Form, Input, Button, Alert } from 'antd';
import { useAppDispatch, useAppSelector } from '../hooks';
import { login } from '../slices/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';

export default function Login() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation() as any;

  const onFinish = async (values: any) => {
    const res = await dispatch(login(values));
    // @ts-ignore
    if (res.type.endsWith('fulfilled')) {
      const to = location.state?.from || '/';
      navigate(to, { replace: true });
    }
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
        {error && (
          <Alert message={error} type="error" style={{ marginBottom: 12 }} />
        )}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            登录
          </Button>
        </Form>
      </Card>
    </div>
  );
}
