import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe, forgotPassword, resetPassword } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            // parse error
          }
        }

        try {
          const res = await getMe();
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('[Auth] Token verification failed:', err.message);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, rememberMe = true) => {
    try {
      const res = await loginUser({ email, password });
      const { token: receivedToken, user: receivedUser } = res.data;

      setToken(receivedToken);
      setUser(receivedUser);

      if (rememberMe) {
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('user', JSON.stringify(receivedUser));
      } else {
        sessionStorage.setItem('token', receivedToken);
        localStorage.setItem('token', receivedToken); // Axios uses localStorage
        localStorage.setItem('user', JSON.stringify(receivedUser));
      }

      return { success: true, user: receivedUser };
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Login failed';
      throw new Error(message);
    }
  };

  const signup = async ({ name, email, password, confirmPassword }) => {
    try {
      const res = await registerUser({ name, email, password, confirmPassword });
      const { token: receivedToken, user: receivedUser } = res.data;

      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));

      return { success: true, user: receivedUser };
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Signup failed';
      throw new Error(message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  const sendForgotPassword = async (email) => {
    try {
      const res = await forgotPassword({ email });
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to request password reset';
      throw new Error(message);
    }
  };

  const submitResetPassword = async ({ email, code, newPassword, confirmPassword }) => {
    try {
      const res = await resetPassword({ email, code, newPassword, confirmPassword });
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to reset password';
      throw new Error(message);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    signup,
    logout,
    sendForgotPassword,
    submitResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
