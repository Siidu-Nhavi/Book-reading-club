import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { authApi, userApi } from "../lib/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const data = await authApi.me();

        if (isMounted) {
          setUser(data.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const signup = async (payload) => {
    const data = await authApi.signup(payload);
    setUser(data.user);
    return data.user;
  };

  const login = async (payload) => {
    const data = await authApi.login(payload);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  const refreshSession = async () => {
    try {
      const data = await authApi.me();
      setUser(data.user);
      return data.user;
    } catch {
      setUser(null);
      return null;
    }
  };

  const updateProfile = async (payload) => {
    const data = await userApi.updateProfile(payload);
    setUser(data.user);
    return data.user;
  };

  const value = {
    user,
    isReady,
    isAuthenticated: Boolean(user),
    signup,
    login,
    logout,
    refreshSession,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
