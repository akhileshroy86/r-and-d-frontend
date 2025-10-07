import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { loginSuccess, logout } from '../../store/slices/authSlice';
import { adminAuthService } from '../../services/api/adminAuthService';

export const useAdminAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.role === 'admin') {
            // Verify token is still valid
            const verifiedUser = await adminAuthService.verifyToken();
            dispatch(loginSuccess({
              user: verifiedUser,
              token: storedToken
            }));
          }
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminAuthService.signIn({ email, password });
      
      // Store in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Update Redux state
      dispatch(loginSuccess({
        user: response.user,
        token: response.token
      }));

      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Sign in failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminAuthService.signUp({
        name,
        email,
        password
      });
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Sign up failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    
    try {
      await adminAuthService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Always clear local state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(logout());
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminAuthService.changePassword(currentPassword, newPassword);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: any) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await adminAuthService.updateProfile(profileData);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update Redux state
      dispatch(loginSuccess({
        user: updatedUser,
        token: token || ''
      }));

      return updatedUser;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await adminAuthService.refreshToken();
      localStorage.setItem('token', response.token);
      return response.token;
    } catch (error) {
      // If refresh fails, sign out
      await signOut();
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    changePassword,
    updateProfile,
    refreshToken,
    clearError: () => setError(null)
  };
};