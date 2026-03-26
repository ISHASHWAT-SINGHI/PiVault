import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import DashboardLayout from '../layouts/DashboardLayout';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedRoute;
