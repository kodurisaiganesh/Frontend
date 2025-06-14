import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../api/blogApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const decodeAndSetUser = (access) => {
    try {
      const decoded = jwtDecode(access);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        logoutUser();
        return;
      }

      setUser({ username: decoded.username, id: decoded.user_id });
    } catch (err) {
      console.error('Token decode failed', err);
      logoutUser();
    }
  };

  const loginUser = async (username, password, onSuccess, onError) => {
    setLoading(true);
    try {
      const res = await API.post('token/', { username, password });
      const { access, refresh } = res.data;

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      decodeAndSetUser(access);
      onSuccess?.();
    } catch (err) {
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) return logoutUser();

    try {
      const res = await API.post('token/refresh/', { refresh });
      const access = res.data.access;
      localStorage.setItem('access', access);
      decodeAndSetUser(access);
    } catch (err) {
      console.error('Token refresh failed', err);
      logoutUser();
    }
  };

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (access) decodeAndSetUser(access);
    setLoading(false);

    const interval = setInterval(refreshToken, 1000 * 60 * 4); // Refresh every 4 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Optional: custom hook for convenience
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
