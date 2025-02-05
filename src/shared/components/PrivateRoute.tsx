import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../pages/contexts/auth.context';
import NoPermission from '../../pages/common/NoPermission';
interface PrivateRouteProps {
  requiredRoles?: string[];
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRoles }) => {
  const { isAuthenticated, userInformation } = useAuth();
  const roles = userInformation?.roles || [];
  const location = useLocation();

  const hasRequiredRole = requiredRoles?.some((role) => roles.includes(role));

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  if (!hasRequiredRole) {
    return <NoPermission />;
  }

  return <Outlet />;
};

export default PrivateRoute;
