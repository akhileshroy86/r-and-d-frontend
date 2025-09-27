import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../../store';
import { loginStart, loginSuccess, loginFailure, logout } from '../../store/slices/authSlice';
import { authService, LoginCredentials } from '../../services/api/authService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch(loginStart());
      const response = await authService.login(credentials);
      
      localStorage.setItem('token', response.token);
      dispatch(loginSuccess({ user: response.user, token: response.token }));
      
      // Redirect based on user role
      switch (response.user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'doctor':
          router.push('/doctor/dashboard');
          break;
        case 'staff':
          router.push('/staff/dashboard');
          break;
        case 'patient':
          router.push('/patient/portal');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (error) {
      dispatch(loginFailure());
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      dispatch(logout());
      router.push('/login');
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      try {
        const response = await authService.getProfile();
        dispatch(loginSuccess({ user: response.user, token }));
      } catch (error) {
        localStorage.removeItem('token');
        dispatch(logout());
      }
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout: logoutUser,
    checkAuth
  };
};