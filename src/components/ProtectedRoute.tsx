import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const token = useSelector((s: RootState) => s.auth.token);
  const location = useLocation();
  if (!token)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
