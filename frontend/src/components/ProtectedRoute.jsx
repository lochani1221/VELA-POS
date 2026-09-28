import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap any page element with this in App.jsx to require login:
// <Route path="/customers" element={<ProtectedRoute><CustomerList /></ProtectedRoute>} />
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}