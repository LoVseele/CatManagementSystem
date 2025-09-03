import { Layout, Button, Typography, ConfigProvider } from 'antd';
import {
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import Login from './pages/Login';
import UsersList from './pages/UsersList';
import UserDetail from './pages/UserDetail';
import AppointmentsList from './pages/appointmentList';

import ProtectedRoute from './components/ProtectedRoute';
import { useAppSelector, useAppDispatch } from './hooks';
import { logout } from './slices/authSlice';
import './App.css';

const { Header, Content, Footer } = Layout;

export default function App() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);

  const doLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: 'rgba(253, 178, 2, 1)',
          },
        }}
      >
        {!isLogin && (
          <Header className="header">
            <div>
              <Link to="/" className="header-title">
                Cat招新小程序管理系统
              </Link>
            </div>

            <div style={{ color: '#210808ff' }}>
              <Link to="/appointment" className="header-appointment">
                预约管理
              </Link>
              <Typography.Text className="header-admin">
                {auth.adminName ? `当前管理员：${auth.adminName}` : ''}
              </Typography.Text>
              <Button onClick={doLogout} className="logout-button">
                退出登录
              </Button>
            </div>
          </Header>
        )}
        <Content style={{ padding: isLogin ? 0 : 24 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <UsersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id"
              element={
                <ProtectedRoute>
                  <UserDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointment"
              element={
                <ProtectedRoute>
                  <AppointmentsList />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
        {!isLogin && <Footer style={{ textAlign: 'center' }}>© CAT</Footer>}
      </ConfigProvider>
    </Layout>
  );
}
