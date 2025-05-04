import React, { createContext, useState, useEffect } from "react";
import pb from "lib/pocketbase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Function to check if user has admin role
  const checkAdminStatus = () => {
    if (pb.authStore.isValid) {
      // Check if the user has an admin role
      // Adjust this logic based on how your admin status is stored in PocketBase
      // Option 1: If using a boolean field called "isAdmin" on the user record
      return pb.authStore.model?.isAdmin === true;
      
      // Option 2: If using a role field with a specific value
      // return pb.authStore.model?.role === "admin";
      
      // Option 3: If admin status is in a separate collection
      // You might need to fetch this separately
    }
    return false;
  };

  useEffect(() => {
    const handleAuthChange = () => {
      const authValid = pb.authStore.isValid;
      setIsAuthenticated(authValid);
      
      // Update admin status when auth changes
      setIsAdmin(checkAdminStatus());
    };

    // Initial check
    handleAuthChange();

    // Listen for changes to the auth store
    pb.authStore.onChange(handleAuthChange);

    return () => {
      // Cleanup the event listener
      pb.authStore.onChange(handleAuthChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};


// import React, { createContext, useState, useEffect } from "react";
// import pb from "lib/pocketbase";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
//   const [isAdmin, setIsAdmin] = useState(false);
//   useEffect(() => {
//     const handleAuthChange = () => {
//       setIsAuthenticated(pb.authStore.isValid);
//     };

//     // Listen for changes to the auth store
//     pb.authStore.onChange(handleAuthChange);

//     return () => {
//       pb.authStore.onChange(handleAuthChange);
//     };
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
