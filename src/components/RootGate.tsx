import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import Login from '../pages/Login';

/**
 * At root URL (/): show Login when not authenticated, otherwise render app (Layout + Dashboard etc).
 * Ensures http://localhost:5173/ shows only the login screen until login succeeds, then dashboard.
 */
const RootGate = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Outlet />;
};

export default RootGate;
