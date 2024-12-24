import React, { createContext, useState, useEffect } from "react";
import pb from "lib/pocketbase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(pb.authStore.isValid);
    };

    // Listen for changes to the auth store
    pb.authStore.onChange(handleAuthChange);

    return () => {
      pb.authStore.onChange(handleAuthChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
