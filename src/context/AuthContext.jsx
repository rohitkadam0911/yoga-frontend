"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginApi, signupApi, logoutApi, getProfileApi } from "@/services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On first load, check if a valid session cookie exists
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileApi();
        setUser(res.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    setUser(res.data.data);
    return res.data;
  };

  const signup = async (formData) => {
    const res = await signupApi(formData);
    return res.data;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};